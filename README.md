# StudyChain

> **Learn. Build. Prove.** — Your wallet is your resume.

---

## The One-Line Pitch

StudyChain is an on-chain skill verification protocol where developers and CS students prove real technical capability through hands-on coding challenges — and carry that proof permanently in their wallet, under any issuing organization's brand, across every job, grant, and opportunity they ever apply for.

---

## Table of Contents

1. [The Problem](#the-problem)
2. [Why Now](#why-now)
3. [The Solution](#the-solution)
4. [Why Only Blockchain Makes This Possible](#why-only-blockchain-makes-this-possible)
5. [Two Sides of the Platform](#two-sides-of-the-platform)
6. [How It Works — Developers](#how-it-works--developers)
7. [How It Works — Organizations](#how-it-works--organizations)
8. [Organization Own-Mint Architecture](#organization-own-mint-architecture)
9. [Three Levels of Organization Access](#three-levels-of-organization-access)
10. [What Lives in a Developer's Wallet](#what-lives-in-a-developers-wallet)
11. [The Skill Track System](#the-skill-track-system)
12. [On-Chain Profile](#on-chain-profile)
13. [NAS — Network Ability Score](#nas--network-ability-score)
14. [Soulbound Credential Architecture](#soulbound-credential-architecture)
15. [Technical Architecture](#technical-architecture)
16. [Security and Anti-Gaming](#security-and-anti-gaming)
17. [Revenue Model](#revenue-model)
18. [Network Effects and Flywheel](#network-effects-and-flywheel)
19. [3-Month Launch Roadmap](#3-month-launch-roadmap)
20. [Competitive Landscape](#competitive-landscape)
21. [Risks and Mitigations](#risks-and-mitigations)
22. [Traction](#traction)

---

## The Problem

The upskilling market in 2026 is broken in a specific way that nobody has fixed yet.

**Knowledge access is not the problem.** YouTube, AI assistants, documentation, free bootcamps — a motivated developer can learn anything for free. The bottleneck is no longer access to information.

**The problem is proof. On both sides.**

### For Developers
A CS student in Pune, a self-taught developer in Lagos, a career-switcher in Jakarta — they grind for months learning Solana, React, Rust, ZK proofs. They become genuinely capable. But when they apply for a grant, a bounty, a contributor role, or a job, they have no proof that anyone actually trusts.

- GitHub history is gameable — anyone can copy-paste repos
- Udemy/Coursera certificates are just PDFs — no verification, no permanence, revokable by the platform
- LinkedIn skill endorsements mean nothing — any connection can click approve
- AI can now write portfolios, essays, cover letters, and pass most text-based assessments
- University degrees say nothing about practical capability

### For Organizations
Universities, bootcamps, protocols, and companies that issue training certificates face a different problem: their credentials live on their own servers. If the platform shuts down, the certificate URL 404s. There is no way for a third party to independently verify a credential without trusting the issuing organization's infrastructure. And because every organization issues credentials differently, there is no universal, trustless verification standard.

**The signal is broken on both sides. StudyChain fixes it.**

---

## Why Now

Three forces have converged in 2026 that make this the right moment:

**1. AI has made text-based proof worthless.**
Any certificate earned by watching videos or passing text quizzes can now be earned by AI in minutes. The only proof that cannot be faked is verified execution of real code on a real network. On-chain work output is the last tamper-proof signal.

**2. Web3 ecosystems are drowning in unverified talent.**
Solana Foundation, EVM foundations, and major protocols distribute millions in grants annually but have no scalable way to filter qualified developers from resume-padding applicants. The demand for a trusted technical filter exists and is funded.

**3. Blockchain credential portability is finally practical.**
Solana transaction costs are fractions of a cent. Metaplex Soulbound tokens are production-ready. Wallet abstraction via embedded wallets means non-crypto users can onboard in seconds. The infrastructure to make this work at scale exists today.

---

## The Solution

StudyChain is a two-sided verification protocol.

On one side: developers and CS students who prove skills by doing real work — not by watching content or passing AI-solvable quizzes.

On the other side: organizations — universities, bootcamps, protocols, DAOs, and companies — who issue their own branded, on-chain credentials using StudyChain's verification infrastructure. Each organization owns their own mint. Their name is on the credential. StudyChain is the invisible engine underneath.

Instead of:
```
Watch video → Pass quiz → Receive PDF certificate → 
Stored on company server → Revokable → Unverifiable → Worthless
```

StudyChain does:
```
Receive challenge → Write real code → Deploy on-chain → 
Verifier confirms execution → Organization's Soulbound credential 
minted to developer's wallet → Permanent → Portable → Unfakeable
```

The credential lives in the developer's wallet forever. It cannot be transferred, sold, faked, or revoked. It is cryptographic proof, recorded on a public blockchain, that this specific wallet address successfully completed this specific technical challenge, verified by this specific organization.

---

## Why Only Blockchain Makes This Possible

**A traditional database cannot do this** because:
- It is controlled by a company that can shut down, be hacked, or manipulate records
- Certificates become dead links when the company closes
- There is no trustless way for a third party to verify a record without trusting the issuing company's infrastructure
- Credentials cannot be truly owned by the developer — they are always tenant data on someone else's platform

**Blockchain makes this possible** because:
- Each organization's credential program is deployed on-chain under their own mint authority — they own it, not StudyChain
- Any third party can verify any credential instantly without asking StudyChain's or the organization's permission
- Credentials cannot be revoked, edited, or deleted after issuance
- Proof of work (devnet deployment, transaction signature, test execution) is permanently recorded on-chain and independently verifiable by anyone
- Developers truly own their credentials — if StudyChain shuts down tomorrow, every credential still exists on-chain

For the first time, a developer's skill proof is owned by the developer, issued under the organization's trusted brand, and verifiable by anyone — without trusting any single company's server. That is only achievable through blockchain.

---

## Two Sides of the Platform

### Side 1 — Developers and Students
The people who take challenges, earn credentials, and build their on-chain skill portfolio. Their wallet becomes their resume. Every credential they earn lives there permanently, visible to any employer, protocol, DAO, or institution that wants to verify it.

### Side 2 — Organizations
Universities, bootcamps, Web3 protocols, DAOs, companies, and certification bodies that want to issue verifiable credentials to their students, developers, or employees. They define the challenge and the rubric. StudyChain runs the verification engine and mints the credential under their own brand and their own on-chain program.

Both sides need each other. Developers want credentials from organizations that matter. Organizations want developers to trust their credentials and take their assessments. StudyChain is the neutral infrastructure layer that makes both possible.

---

## How It Works — Developers

**Step 1: Connect**
Developer connects a Solana wallet or signs up with email (embedded wallet created automatically via Privy — no crypto knowledge required).

**Step 2: Choose a Challenge**
Browse the challenge library — either StudyChain native tracks or organization-created assessments. Tracks organized by domain, level, and issuing organization.

**Step 3: Receive the Challenge**
Every challenge is a real technical task. Not a multiple choice quiz. Not a video to watch. Examples:
- "Implement a PDA-based escrow program in Anchor and deploy it to Solana Devnet" — issued by StudyChain
- "Deploy an ERC-20 token with custom vesting on Sepolia" — issued by StudyChain
- "Pass this smart contract security assessment" — issued by Ackee Blockchain on StudyChain rails
- "Complete this Anchor fundamentals challenge" — issued by Solana Foundation on StudyChain rails
- "Demonstrate proficiency in our Jupiter SDK" — issued by Jupiter Protocol on StudyChain rails

**Step 4: Build and Submit**
Developer writes code locally in their own environment. Deploys to the appropriate testnet. Submits their program ID, transaction signature, or contract address to StudyChain.

**Step 5: Automated Verification**
StudyChain's verifier backend inspects the on-chain state. Checks that the program exists, correct instructions are implemented, state transitions match the rubric. No human reviewer. Deterministic, automated, unfakeable.

**Step 6: Credential Minted**
If verification passes, the organization's on-chain program mints a Soulbound NFT credential directly to the developer's wallet — under the organization's own brand, from their own mint authority. StudyChain ran the engine. The organization's name is on the credential.

**Step 7: Own and Use**
Credential appears permanently in the developer's wallet and StudyChain profile. Shareable in grant applications, job applications, DAO contributor bids, bounty submissions. Any viewer verifies it on-chain in seconds — no login required, no trust in any company required.

---

## How It Works — Organizations

**Step 1: Onboard**
Organization creates a partner account on StudyChain. Completes verification (prevents credential spam from unknown entities).

**Step 2: Own-Mint Setup**
StudyChain deploys a unique Anchor program on Solana under the organization's identity. The organization is set as the mint authority. Their credentials are issued from their program — not from StudyChain's program.

**Step 3: Build Challenges**
Organization uses StudyChain's no-code challenge builder to define:
- Challenge title, description, and instructions
- Technical submission type (Solana devnet program ID, EVM contract address, test suite execution, or custom verification hook)
- Passing rubric (what the verifier checks)
- Credential name, badge design, and metadata
- Access controls (open to all, invite-only, or gated behind a previous credential)

**Step 4: Choose Access Level**
Organization selects how developers encounter their challenges — hosted on studychain.xyz, embedded on their own site, or fully white-labelled via API.

**Step 5: Developers Take the Assessment**
Developers complete the challenge on whichever surface the organization chose. StudyChain's verification engine runs automatically.

**Step 6: Credentials Issued Under Organization's Brand**
Passing developers receive a credential minted from the organization's own on-chain program. The organization's name, badge, and metadata appear in the developer's wallet. StudyChain is the invisible infrastructure.

**Step 7: Access the Verified Talent Pool**
Organization's partner dashboard shows all developers who hold their credentials — filterable by level, completion date, and other attributes. Use for grant filtering, hiring pipelines, contributor recruitment, or cohort tracking.

---

## Organization Own-Mint Architecture

This is the core technical differentiator. Every organization that issues credentials on StudyChain owns their own on-chain credential program. They are not a sub-issuer of StudyChain. They are an independent issuer using StudyChain's infrastructure.

### What Gets Deployed Per Organization

```
Organization onboards
        ↓
StudyChain deploys unique Anchor program
on Solana under organization's identity
        ↓
Organization wallet set as mint authority
        ↓
Organization's program ID recorded in
StudyChain registry (for discovery)
        ↓
All credentials mint FROM organization's program
→ Organization's name on every credential
→ Organization's badge in every wallet
→ StudyChain verification engine ran underneath
→ Developer and verifier see organization's brand
```

### What a Credential Looks Like in the Wallet

```
Developer Wallet:

"Solana Core — Advanced"
Issued by: StudyChain
Program: StudyChain Verifier v1
Mint Authority: StudyChain

"Anchor Security Certified"
Issued by: Ackee Blockchain
Program: AckeeCredential_v1 (Ackee's own program)
Mint Authority: Ackee Blockchain

"MIT Blockchain Fundamentals"
Issued by: MIT Digital Credentials Lab
Program: MIT_StudyChain_v1 (MIT's own program)
Mint Authority: MIT Digital Credentials Lab

"Jupiter SDK Verified"
Issued by: Jupiter Foundation
Program: JupiterVerifier_v1 (Jupiter's own program)
Mint Authority: Jupiter Foundation
```

Every credential is independently verifiable on Solana explorer. The organization's mint authority is visible on-chain. No trust in StudyChain required to verify any credential from any organization.

---

## Three Levels of Organization Access

### Level 1 — Hosted
Organization builds challenges and issues credentials entirely within studychain.xyz. Developers discover and complete challenges on the StudyChain platform. Simplest to set up — no technical integration required from the organization.

Best for: Smaller bootcamps, DAOs, protocols, Web3 projects.

### Level 2 — Embedded
Organization embeds the StudyChain challenge widget into their own website or learning platform. Developers never leave the organization's site. Credential still mints from the organization's own program via StudyChain's engine.

Best for: Universities, mid-size bootcamps, established protocols with existing developer portals.

### Level 3 — Full API / White Label
Organization calls StudyChain's verification API directly. Builds a fully custom frontend and challenge experience. StudyChain runs the verification engine and mints credentials silently. The organization's product is front and center — StudyChain is completely invisible to end users.

Best for: Large institutions, enterprise companies, established certification bodies wanting to move credentials on-chain without changing their brand experience.

---

## What Lives in a Developer's Wallet

A developer's wallet on StudyChain becomes their permanent, portable, multi-organization skill portfolio.

```
studychain.xyz/profile/0x...wallet...

─────────────────────────────────────────
SKILL PORTFOLIO
─────────────────────────────────────────

SOLANA DEVELOPMENT
✓ Solana Core — Foundation        [StudyChain]         June 2026
✓ Solana Core — Intermediate      [StudyChain]         June 2026
✓ Solana Core — Advanced          [StudyChain]         July 2026
✓ Anchor Security Certified       [Ackee Blockchain]   July 2026
✓ Jupiter SDK Verified            [Jupiter Protocol]   August 2026

EVM / SOLIDITY
✓ Solidity Fundamentals           [StudyChain]         May 2026
✓ Smart Contract Security         [OpenZeppelin Track] June 2026

CS FUNDAMENTALS
✓ Data Structures — Advanced      [StudyChain]         April 2026
✓ Systems Design — Intermediate   [StudyChain]         May 2026

─────────────────────────────────────────
MATCHED OPPORTUNITIES
─────────────────────────────────────────
→ Jupiter Foundation Grant (you qualify)
→ Superteam Bounty: Anchor Developer (you qualify)
→ Ackee Blockchain Junior Auditor (you qualify)
─────────────────────────────────────────

[Verify all credentials on Solana Explorer →]
```

Every credential links directly to its on-chain record. Any employer, protocol, or institution viewing this profile can verify every credential independently — without logging into StudyChain, without trusting StudyChain, without contacting the issuing organization.

---

## The Skill Track System

StudyChain launches with security exploit challenges as its entry point — the one challenge type that is provably unfakeable — then expands to the full platform track system as traction is established.

### Launch Tracks — Security Exploit Challenges

The first thing StudyChain ships. Three vulnerable Anchor smart contracts of increasing difficulty. The only way to earn the credential is to submit a successful exploit transaction on Solana Devnet. No tutorial covers these exact contracts. No copy-paste works. No AI agent reliably exploits novel vulnerabilities without deep understanding.

**L1 — Missing Signer Check (Beginner)**
A vulnerable escrow contract where the authority check exists in code but is never enforced. Anyone can drain the escrow without being the rightful owner. Exploiting it requires understanding Solana's account model and PDA validation.

Credential: `StudyChain — Solana Security L1`
Proof: Successful unauthorized withdrawal transaction on devnet

**L2 — Authority Validation Flaw (Intermediate)**
A vault contract where the owner field is stored in an account but never cross-checked against the actual signer. An attacker passes their own account as owner and drains the vault. One of the most common real-world Solana bugs — appeared in multiple mainnet exploits.

Credential: `StudyChain — Solana Security L2`
Proof: Successful vault drain via spoofed authority on devnet

**L3 — CPI Reentrancy Attack (Advanced)**
A lending protocol that makes a CPI call to an external program before updating its own internal state. An attacker controls the external program and calls back into the lending contract mid-execution, draining funds before balances update. Mirrors real DeFi exploits.

Credential: `StudyChain — Solana Security L3`
Proof: Successful reentrancy drain via attacker-controlled CPI program on devnet

A developer holding all three credentials has demonstrated progressive security depth that any protocol or auditing firm can verify on-chain in seconds.

---

### Full Platform Tracks (Phase 2 — Post Launch Traction)

Once the security exploit loop is proven and initial protocol partnerships are established, StudyChain expands to its complete track system.

**Web3 Tracks**
- Solana Core — Foundation, Intermediate, Advanced, Master
- EVM / Solidity — Foundation, Intermediate, Advanced, Master
- ZK Cryptography — Foundation, Intermediate, Advanced
- DeFi Architecture — Foundation, Intermediate, Advanced
- Rust Programming — Foundation, Intermediate, Advanced, Master
- Full Stack Web3 — Foundation, Intermediate, Advanced

**CS Fundamentals Tracks**
- Data Structures and Algorithms — Foundation, Intermediate, Advanced, Master
- System Design — Foundation, Intermediate, Advanced
- Distributed Systems — Foundation, Intermediate

Completing all levels in a track earns a Master credential for that domain.

### Organization Tracks (Built by partner organizations, issued under their brand)
- Any organization can create any track on any technical topic
- StudyChain provides the verification primitives — exploit listeners, deployment checks, test suite runners, custom verification hooks
- Organizations define the content, rubric, and credential design
- Visible in StudyChain discovery alongside native tracks, clearly labelled by issuing organization

---

## On-Chain Profile

Every developer has a public profile at:
```
studychain.xyz/profile/<wallet_address>
```

The profile is owned by the developer's wallet. StudyChain cannot delete it. If StudyChain shuts down tomorrow, every credential still exists on-chain. The profile page is simply a reader — the source of truth is always the blockchain.

Profile displays: all earned credentials with issuing organizations, skill domains and levels, challenge completion timestamps, matched opportunities the wallet currently qualifies for, and a direct link to verify every credential on Solana explorer.

---

## NAS — Network Ability Score

Credentials tell you what a developer has completed. NAS tells you how well they performed doing it.

NAS is StudyChain's Elo-style skill rating — a single public number on every developer's profile that reflects challenge difficulty, speed of completion, and attempt efficiency. It is not binary like a credential. It is continuous, always updating, and impossible to fake because every data point feeding it is verified on-chain.

---

### What NAS Measures

Three factors determine how many NAS points a developer earns on each challenge:

**1. Challenge Difficulty — Base Points**

| Challenge Level | Base Points |
|---|---|
| L1 — Beginner | 100 |
| L2 — Intermediate | 250 |
| L3 — Advanced | 500 |
| Master Track Completion | 1,000 |

**2. Speed Multiplier**
Measured against the average completion time across all developers who passed the same challenge.

| Completion Speed | Multiplier |
|---|---|
| Top 10% fastest | 2.0× |
| Top 25% fastest | 1.5× |
| Top 50% fastest | 1.2× |
| Below median | 1.0× |

**3. Attempt Multiplier**
Fewer attempts signals deeper first-pass understanding — not trial and error.

| Attempts Taken | Multiplier |
|---|---|
| 1st attempt | 1.5× |
| 2nd attempt | 1.2× |
| 3rd attempt | 1.0× |

---

### NAS Formula

```
NAS Points = Base Points × Speed Multiplier × Attempt Multiplier
```

**Example — Elite Performance:**
Developer exploits the L3 CPI Reentrancy challenge on first attempt, finishing in the top 10% of all completion times:
```
500 × 2.0 × 1.5 = 1,500 NAS points
```

**Example — Standard Performance:**
Developer completes an L1 challenge on their third attempt, below median speed:
```
100 × 1.0 × 1.0 = 100 NAS points
```

NAS accumulates across every challenge completed. The score reflects the full history of a developer's verified performance.

---

### NAS Tiers

| NAS Score | Tier | What It Signals |
|---|---|---|
| 0 – 299 | Initiate | Just getting started |
| 300 – 799 | Builder | Solid fundamentals proven |
| 800 – 1,999 | Practitioner | Real working knowledge across domains |
| 2,000 – 4,999 | Expert | Hire-ready, grant-ready signal |
| 5,000 – 9,999 | Architect | Senior-level depth and breadth |
| 10,000+ | Sovereign | Top 1% verified technical talent |

---

### NAS on the Developer Profile

NAS score and tier are fully public on every developer's profile. Organizations browsing the verified talent pool can sort by NAS to surface the highest performers instantly — no additional screening required.

```
studychain.xyz/profile/0x...wallet...

NAS Score: 3,840 — Expert
───────────────────────────────────
Rank: Top 4% globally
Credentials: 7 earned across 3 organizations
Last active: 3 days ago
```

---

### Why NAS Creates Daily Active Usage

Credentials are earned once and held forever. NAS keeps moving. A developer who earns their L3 security credential still has reason to return — every new challenge completed improves their score, moves them up the leaderboard, and makes them more visible to protocols browsing the talent pool.

The public leaderboard ranked by NAS is also a growth mechanic. "Just hit Architect tier on StudyChain" is a post developers share on X. That is organic distribution the platform does not pay for.

---

### NAS Is Off-Chain Computed, On-Chain Anchored

NAS is computed by StudyChain's backend using verified on-chain data — challenge completion transactions, timestamps, and attempt counts recorded on Solana. The score itself is stored off-chain for fast querying, but the underlying data feeding it is always on-chain and independently verifiable. Periodic NAS snapshots are anchored on-chain so the score history cannot be manipulated retroactively.

---

## Soulbound Credential Architecture

### Token Standard
Metaplex Programmable NFT (pNFT) with Soulbound rule set — non-transferable, non-sellable, permanently bound to the issuing wallet. Minted from the issuing organization's own on-chain program under their mint authority.

### Credential Metadata Structure

```json
{
  "name": "Anchor Security Certified",
  "symbol": "ACKEE",
  "description": "Verified by Ackee Blockchain via StudyChain infrastructure. The holder successfully completed the Ackee smart contract security assessment, demonstrating ability to identify and remediate common Anchor program vulnerabilities.",
  "image": "arweave://<ackee_badge_uri>",
  "attributes": [
    { "trait_type": "Issuing Organization", "value": "Ackee Blockchain" },
    { "trait_type": "Track", "value": "Smart Contract Security" },
    { "trait_type": "Level", "value": "Intermediate" },
    { "trait_type": "Verified Program", "value": "<devnet_program_id>" },
    { "trait_type": "Verification TX", "value": "<transaction_signature>" },
    { "trait_type": "Verification Engine", "value": "StudyChain Verifier v1" },
    { "trait_type": "Issued", "value": "2026-07-15T00:00:00Z" }
  ]
}
```

Metadata stored permanently on Arweave — not on StudyChain's or the organization's servers. One-time cost of ~$0.01 per credential. Accessible forever regardless of what happens to any company.

### Verification Flow

```
Developer submits work
        ↓
StudyChain Edge Function receives submission
        ↓
Helius RPC / Alchemy fetches on-chain state
        ↓
Verification Rubric Engine checks against
organization-defined rubric:
  ├── Program / contract existence
  ├── Instruction / function implementation
  ├── State correctness
  ├── Build hash uniqueness (anti-copy)
  └── Wallet ownership of submission
        ↓
Pass → Organization's Anchor program mints
       Soulbound pNFT to developer wallet
     → Arweave metadata uploaded under org brand
     → Developer profile updated
        ↓
Fail → Structured feedback returned
     → Attempt logged (rate limiting applied)
```

---

## Technical Architecture

### Stack Overview

| Layer | Technology | Purpose |
|---|---|---|
| Blockchain | Solana | Fast finality, sub-cent transaction costs |
| Smart Contracts | Anchor (Rust) | Per-organization credential programs, Soulbound minting, verifier logic |
| NFT Standard | Metaplex pNFT | Soulbound enforcement, non-transferability |
| Credential Metadata | Arweave | Permanent, decentralised metadata storage |
| Backend | Node.js + Express | Verification engine, session management, deploy orchestration |
| Database | MongoDB Atlas | Sessions, developer profiles, credentials, NAS scores |
| RPC Provider | Helius | Reliable Solana RPC with webhook support |
| Frontend | React (Web) — already built | Developer dashboard and organization portal |
| CLI Tool | studychain-cli (npm) | Bridges browser to developer's local terminal for exploit execution |
| Wallet | Phantom | Native Solana wallet connection |
| Auth | JWT (wallet signature verified on backend) | Session management |
| Hosting — Frontend | Vercel | Free, auto-deploys from GitHub |
| Hosting — Backend | DigitalOcean Droplet (GitHub Student Pack $200) | Node.js server, .so file storage |
| EVM Verification | Alchemy | Sepolia testnet state verification for EVM challenges |

---

### Complete Project Folder Structure

```
studychain/
│
├── web/                          ← FRONTEND (already built by you)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.tsx         ← Landing page
│   │   │   ├── dashboard.tsx     ← Developer dashboard
│   │   │   ├── challenge/
│   │   │   │   └── [id].tsx      ← Challenge page (Monaco Editor)
│   │   │   ├── profile/
│   │   │   │   └── [wallet].tsx  ← Public developer profile
│   │   │   └── org/
│   │   │       └── dashboard.tsx ← Organization dashboard
│   │   ├── components/
│   │   │   ├── WalletConnect.tsx
│   │   │   ├── MonacoEditor.tsx
│   │   │   ├── NASScore.tsx
│   │   │   ├── CredentialCard.tsx
│   │   │   └── CLIStatus.tsx     ← Shows if studychain-cli is connected
│   │   └── lib/
│   │       ├── api.ts            ← Calls to backend API
│   │       └── wallet.ts         ← Phantom wallet utils
│   ├── package.json
│   └── .env.local                ← NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
│
├── backend/                      ← BACKEND (Node.js — what we build next)
│   ├── src/
│   │   ├── index.ts              ← Express server entry point
│   │   ├── routes/
│   │   │   ├── auth.ts           ← POST /api/auth/login (wallet signature → JWT)
│   │   │   ├── challenges.ts     ← GET /api/challenges, GET /api/challenges/:id
│   │   │   ├── sessions.ts       ← POST /api/sessions/start (deploy .so instance)
│   │   │   ├── verify.ts         ← POST /api/verify (check exploit TX)
│   │   │   ├── credentials.ts    ← GET /api/credentials/:wallet
│   │   │   └── organizations.ts  ← POST /api/orgs/register
│   │   ├── services/
│   │   │   ├── deploy.service.ts     ← Deploys .so to devnet via Solana CLI
│   │   │   ├── verify.service.ts     ← 3-step TX verification logic
│   │   │   ├── mint.service.ts       ← Triggers Anchor program to mint NFT
│   │   │   ├── arweave.service.ts    ← Uploads metadata to Arweave
│   │   │   ├── nas.service.ts        ← Calculates and updates NAS score
│   │   │   └── jwt.service.ts        ← Issues and validates JWT tokens
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    ← Validates JWT on protected routes
│   │   │   └── ratelimit.middleware.ts ← Max 3 attempts per challenge per 24hr
│   │   ├── models/
│   │   │   ├── Developer.ts          ← MongoDB schema
│   │   │   ├── Session.ts            ← MongoDB schema
│   │   │   ├── Credential.ts         ← MongoDB schema
│   │   │   ├── Challenge.ts          ← MongoDB schema
│   │   │   └── Organization.ts       ← MongoDB schema
│   │   └── utils/
│   │       ├── solana.ts             ← Helius RPC connection
│   │       └── constants.ts          ← NAS multipliers, tier thresholds
│   ├── contracts/                ← Pre-compiled vulnerable contracts (.so files)
│   │   ├── vulnerable_escrow_l1.so
│   │   ├── vulnerable_vault_l2.so
│   │   └── vulnerable_lending_l3.so
│   ├── keys/
│   │   └── .gitignore            ← NEVER commit keypairs to GitHub
│   ├── package.json
│   └── .env                      ← All secrets (never committed)
│
├── programs/                     ← ANCHOR SMART CONTRACTS
│   └── studychain/
│       └── src/
│           └── lib.rs            ← Main Anchor program (already written)
│
├── cli/                          ← STUDYCHAIN CLI (npm package)
│   ├── src/
│   │   ├── index.ts              ← CLI entry point
│   │   └── server.ts             ← Local HTTP server on port 39999
│   └── package.json
│
├── Anchor.toml                   ← Anchor config (already written)
└── README.md                     ← This file
```

---

### Environment Variables

**backend/.env** (never commit to GitHub)
```
# Solana
HELIUS_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_KEY
PLATFORM_KEYPAIR=[your funded devnet keypair as JSON array]

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studychain

# JWT
JWT_SECRET=your_long_random_secret_string_here

# Arweave
ARWEAVE_KEY=[your arweave wallet key]

# Server
PORT=4000
```

**web/.env.local**
```
# Local development
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000

# Production (swap this when deploying)
# NEXT_PUBLIC_BACKEND_URL=https://your-digitalocean-ip:4000
```

---

### Local Development Setup (Run Everything Locally First)

Follow these steps exactly to run StudyChain on your PC before any deployment.

**Prerequisites**
```bash
# Make sure you have these installed
node --version        # v18+
solana --version      # 1.18+
anchor --version      # 0.29+
mongod --version      # or use MongoDB Atlas free tier
```

**Step 1 — Clone and install**
```bash
git clone https://github.com/YASH514131/studychain
cd studychain

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies  
cd ../web && npm install

# Install CLI dependencies
cd ../cli && npm install
```

**Step 2 — Set up environment variables**
```bash
# Copy example env files
cp backend/.env.example backend/.env
cp web/.env.example web/.env.local

# Fill in your values in both files
```

**Step 3 — Set up your platform devnet wallet**
```bash
# Generate a new keypair for the platform backend
solana-keygen new --outfile backend/keys/platform-devnet.json

# Airdrop free SOL on devnet
solana airdrop 5 $(solana-keygen pubkey backend/keys/platform-devnet.json) --url devnet

# Add the keypair to backend/.env as JSON array
cat backend/keys/platform-devnet.json
# Copy the output into PLATFORM_KEYPAIR in .env
```

**Step 4 — Build and deploy Anchor program to devnet**
```bash
cd programs

# Build the program
anchor build

# Get your program ID
anchor keys list

# Replace STUDYCHAIN_PROGRAM_ID_REPLACE_AFTER_DEPLOY
# in Anchor.toml and lib.rs with your actual program ID

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

**Step 5 — Run backend locally**
```bash
cd backend
npm run dev
# Backend running at http://localhost:4000
```

**Step 6 — Run frontend locally**
```bash
cd web
npm run dev
# Frontend running at http://localhost:3000
```

**Step 7 — Run StudyChain CLI locally**
```bash
cd cli
npm run dev
# CLI server running at http://localhost:39999
# Browser will detect this automatically
```

**Step 8 — Test the full flow locally**
```
Open http://localhost:3000
Connect Phantom wallet (switch to devnet in Phantom)
Navigate to a challenge
CLI should show: ✅ Connected
Deploy your instance → get program ID
Write exploit → Run → TX signature returned
Submit → Backend verifies → NFT minted
```

---

### Deployment (After Local Testing Is Successful)

Only deploy when everything works perfectly locally.

**Frontend → Vercel**
```bash
# Push web/ folder to GitHub
# Connect repo to Vercel
# Set environment variable:
# NEXT_PUBLIC_BACKEND_URL=https://your-digitalocean-ip:4000
# Vercel auto-deploys on every GitHub push
```

**Backend → DigitalOcean Droplet**
```bash
# Create $4/month Droplet on DigitalOcean
# (covered by GitHub Student Pack $200 credit)
# Choose: Ubuntu 22.04, Node.js pre-installed

# SSH into your droplet
ssh root@your-droplet-ip

# Clone your repo
git clone https://github.com/YASH514131/studychain
cd studychain/backend

# Install dependencies
npm install

# Set up environment variables on the server
nano .env
# Paste all your environment variables

# Install PM2 to keep backend running forever
npm install -g pm2
pm2 start npm --name "studychain-backend" -- start
pm2 save
pm2 startup

# Backend now running at http://your-droplet-ip:4000
```

**CLI → npm registry**
```bash
cd cli
npm publish
# Developers install with:
# npm install -g studychain-cli
```

---

### TX Verification Flow (3-Step Process)

After developer runs exploit locally via CLI and submits TX signature:

```
Developer submits TX signature to backend
        ↓
CHECK 1 — TX exists on devnet
Backend asks Helius RPC:
"Did this transaction happen?"
Helius returns full TX details
If TX not found or failed → reject
        ↓
CHECK 2 — Correct wallet signed it
TX signer must match session wallet in MongoDB
If mismatch → reject
"You cannot submit someone else's transaction"
        ↓
CHECK 3 — Correct program exploited successfully
TX must have interacted with THIS session's program ID
On-chain state checked: was contract drained/exploited?
If wrong program or exploit failed → reject
        ↓
ALL 3 PASS →
  Upload metadata to Arweave
  Trigger Anchor program → mint Soulbound NFT
  Update NAS score in MongoDB + on-chain
  Close devnet program instance (reclaim SOL)
  Mark session as passed in MongoDB
  Return success to frontend
        ↓
Browser shows:
"🎉 Exploit verified! Credential minted to your wallet."
```

---

### Per-Organization Program Deployment

```
Organization completes onboarding
        ↓
StudyChain admin triggers program deployment
        ↓
Unique Anchor program compiled with:
  ├── Organization's wallet as mint authority
  ├── StudyChain verifier as authorized caller
  └── Organization's credential metadata config
        ↓
Program deployed to Solana Mainnet
        ↓
Program ID registered in StudyChain registry
        ↓
Organization receives their program ID
and can verify deployment independently
```

### Challenge Builder (No-Code for Organizations)

Organizations define challenges through a structured interface — no Solana or Anchor knowledge required to create a challenge. The builder accepts:
- Challenge title, description, and instructions
- Submission type selection (Solana devnet deployment, EVM contract, test suite, custom hook)
- Rubric configuration (which on-chain states or test results count as passing)
- Credential design (name, badge image upload, metadata attributes)
- Access rules (open, invite-only, prerequisite credential required)

StudyChain translates the rubric configuration into verification logic automatically.

---

## Security and Anti-Gaming

### Exploit Transaction as the Primary Proof

The security exploit challenges at launch sidestep the anti-gaming problem entirely. The proof is not a build hash, a deployed program ID, or a quiz score — it is a successful exploit transaction on devnet. To forge this you would need to actually understand the vulnerability and craft a working attack. That is the skill being verified. There is nothing to copy-paste.

Specifically for exploit challenges:

- The vulnerable contract is unique to StudyChain — no tutorial covers it
- The exploit transaction must interact with StudyChain's specific deployed contract address
- The verifier listens for the exact on-chain event signature that proves successful exploitation (unauthorized fund drain, spoofed authority acceptance, reentrancy callback execution)
- Submitting someone else's exploit transaction doesn't work — the wallet claiming the credential must be the signer of the exploit

This is why exploit challenges are the launch entry point. The proof is inherently high-signal.

### For General Coding Challenges (Phase 2)

When the platform expands to deployment and coding challenges, verification combines automated checks with human review thresholds:

**Wallet-Bound Submissions** — Submission must be signed by the claiming wallet. Cannot claim a credential to wallet A by deploying from wallet B.

**Attempt Rate Limiting** — Maximum 3 attempts per challenge per 24-hour window. Prevents brute-force farming.

**Timestamp Verification** — Deployment transaction must fall within the active submission window. Cannot reuse historical deployments.

**Human Review Layer** — For advanced credentials, automated verification is a first filter only. A senior developer spot-checks a sample of passing submissions. This is the lesson from judge feedback — automation alone is insufficient for high-signal credentials. Human review is not a bug, it is the feature.

**Organization Reputation Accountability** — Each organization issues credentials under their own brand. A low-quality or gameable credential reflects on the organization's name. They self-police their own standards.

### AI-Resistance

For exploit challenges: an AI agent cannot reliably exploit a novel vulnerable contract without genuine understanding of Solana's execution model. AutoGPT can deploy boilerplate — it cannot reason about a specific CPI reentrancy flaw in a contract it has never seen.

For general challenges in Phase 2: AI assistance is expected and acceptable for learning. What AI cannot do is produce a verified on-chain track record across multiple challenges over time. A single credential could be AI-assisted. A full portfolio of 10 credentials across different domains, issued by different organizations, earned over months — that tells a real story no AI can fake wholesale.

### Anti-Sybil (Post-MVP)
Integration with established identity protocols (Civic, World ID) to prevent one person farming credentials across multiple wallets.

---

## Revenue Model

### Pricing Tiers

| Tier | Who | Price | What They Get |
|---|---|---|---|
| Free | Developers | $0 | All StudyChain native challenges, credential minting, public profile |
| Developer Pro | Developers | $9/month | Advanced analytics, opportunity matching, priority verification queue, profile highlights |
| Organization Hosted | Bootcamps, small protocols, DAOs | $200/month | Own mint program, no-code challenge builder, hosted on studychain.xyz, partner dashboard |
| Organization Embedded | Universities, mid-size protocols | $800/month | Everything in Hosted + embed widget on their own site |
| White Label API | Large institutions, enterprise | Custom | Full API, own mint, complete white label, StudyChain invisible, dedicated support |
| Per-Credential Issuance | Any organization tier | $0.50–$2 per credential | Alternative to monthly pricing for lower-volume organizations |

### Revenue Projections

| Milestone | Org Partners | Developers | Monthly Revenue |
|---|---|---|---|
| MVP (Month 3) | 2–3 pilot orgs | 200 devs | $1K–$2K |
| 6 Months | 10 orgs | 2,000 devs | $5K–$10K |
| 12 Months | 40 orgs | 15,000 devs | $20K–$35K |
| 24 Months | 150 orgs | 75,000 devs | $80K–$120K |

Revenue scales with network effects. As more organizations issue credentials, more developers join. As more developers hold credentials, more organizations want to issue here. Both sides drive each other.

---

## Network Effects and Flywheel

StudyChain benefits from a two-sided network effect that compounds over time.

```
More organizations issue credentials on StudyChain
                ↓
More developers earn multi-org credentials here
                ↓
Developer profiles become richer and more trusted
                ↓
More protocols and employers check StudyChain profiles
                ↓
Developers want more credentials → take more challenges
                ↓
More organizations want to issue here to reach that audience
                ↓
                (repeat)
```

The key insight: **an organization's credential is worth more when it sits alongside other trusted organizations' credentials in the same wallet.** MIT's credential looks better next to Ackee's credential and Jupiter's credential than it does alone on a PDF. This means each new organization that joins makes every existing organization's credentials more valuable — a classic network effect moat.

---

## 3-Month Launch Roadmap

### The Launch Strategy

StudyChain does not launch with every feature. It launches with the one thing that is immediately compelling, provably unfakeable, and generates organic buzz in the Solana developer community — the security exploit challenge series. Everything else follows once traction is established.

---

### Month 1 — Security Exploit Core

**Smart Contracts**
- `studychain_verifier` — master verifier program, Soulbound minting logic
- `org_credential_factory` — deploys per-organization credential programs on demand
- Metaplex pNFT integration with Soulbound rule set
- Three vulnerable Anchor contracts deployed to Solana Devnet:
  - `vulnerable_escrow_l1.so` — missing signer check
  - `vulnerable_vault_l2.so` — authority validation flaw
  - `vulnerable_lending_l3.so` — CPI reentrancy attack

**Backend**
- Helius RPC webhook listener — detects successful exploit transactions against StudyChain's vulnerable contracts
- Exploit event verifier — confirms the correct on-chain event signature (unauthorized drain, spoofed authority, reentrancy callback)
- Arweave metadata upload pipeline
- Supabase schema — developers, challenges, submissions, credentials

**Frontend (React)**
- Single-page launch experience: connect wallet → read challenge → submit exploit TX → credential minted
- Real-time verification status
- Credential display with on-chain verification link

**Milestone:** A developer can connect their wallet, exploit a vulnerable contract on devnet, submit the transaction, and receive a Soulbound Security credential — end to end, live on Mainnet.

**Validation Gate (before Month 2):** Post the L1 challenge publicly on X. Collect first 20–30 successful exploiters. Take that list to one Solana protocol contact from Bridge Accelerator. Ask: "Would you fast-track these developers for a grant or auditing role?" One yes = proceed to Month 2 at full speed.

---

### Month 2 — Developer Profile and Organization Layer

**Developer Profile**
- Public profile page at `studychain.xyz/profile/<wallet>`
- Security credential portfolio display with on-chain verification links
- Matched opportunity feed based on held credentials
- Phantom integration for crypto-native users
- Privy embedded wallet for non-crypto users (email/Google signup)

**Organization Infrastructure**
- Per-organization Anchor program deployment pipeline (own-mint)
- Organization partner dashboard — challenge management, credential analytics, verified developer pool browser
- Hosted access level fully functional
- First pilot organization onboarded — their own branded credential live

**General Coding Challenges (Phase 2 tracks begin)**
- 3 Solana Core deployment challenges (Foundation, Intermediate, Advanced)
- 2 DSA challenges with automated test suite runner
- Human review layer for advanced credential spot-checks

**Milestone:** Full two-sided platform live. Developers earn security and coding credentials. First organization issues their own branded credential through StudyChain.

---

### Month 3 — Expansion, Mobile, and Public Launch

**Organization Level 2**
- Embeddable challenge widget for organization websites
- API endpoints for Level 3 white label (documented, beta)
- Webhook support for organizations to receive pass/fail events

**Flutter Mobile App**
- Full challenge and profile experience on iOS and Android
- Push notifications for new challenges and matched opportunities

**Track Expansion**
- EVM / Solidity — Foundation and Intermediate
- ZK Cryptography — Foundation
- Rust Programming — Foundation and Intermediate

**Launch**
- Closed beta with 50+ developers from Solana ecosystem and Bridge Accelerator network
- 2–3 pilot organization partners confirmed (target: one Web3 protocol, one security bootcamp, one DAO)
- All programs deployed to Solana Mainnet
- Public launch announcement across X, LinkedIn, Solana ecosystem channels

**Milestone:** Public launch. Security exploit credentials established as the trusted entry signal. General coding tracks expanding the platform. Organizations issuing their own credentials. Protocol partners using the verified talent pool.

---

## Competitive Landscape

| Platform | What They Do | StudyChain Difference |
|---|---|---|
| YouTube / AI | Free knowledge consumption | No proof of capability produced |
| Udemy / Coursera | Video courses, PDF certificates | Certificates unverifiable, revokable, platform-owned |
| LearnWeb3 / Cyfrin | Free Web3 content | Education only, no on-chain proof, no org credentialing layer |
| Ackee / Turbin3 | Bootcamps, developer placements | 9-week human-reviewed programs, not scalable, credentials not on-chain |
| HackerRank / LeetCode | Coding assessments | Centralized, certificates not portable, company controls data, org credentials not on-chain |
| GitHub | Code portfolio | Gameable, no independent verification, owned by Microsoft |
| Badgr / Credly | Digital badge platforms | Centralized, not on-chain, revokable, no live code verification |

**StudyChain's position:** The only platform where organizations can issue their own branded, on-chain, unfakeable credentials verified by live code execution — and where developers carry those credentials permanently in their wallet, owned by nobody but themselves.

---

## Risks and Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Organizations don't change their assessment process | Medium | Validate with 1 org before building org layer. One live pilot = proceed. |
| Protocols don't use credentials to filter grants | Medium | Validate with 1 protocol before Sprint 1. One yes = build. |
| Bear market kills Web3 protocol budgets | Medium | CS fundamentals tracks and university partnerships provide non-crypto revenue buffer |
| "Auto-pass bot" goes viral and kills credential trust | Low-Medium | Exploit challenges are the defense — no script bypasses a novel reentrancy flaw. Human review layer on general challenges. |
| General coding challenges get gamed at scale | Medium | Human spot-check layer on advanced credentials. Org reputation accountability. Portfolio depth over time is harder to fake than single credential. |
| Competitors copy the own-mint model | Medium | Network effects and first-mover org relationships make switching costly |
| Organization challenge quality varies | Low-Medium | Organization reputation is on the line — they self-police. StudyChain sets minimum rubric standards. |
| Solana RPC downtime causes false verification failures | Low | Helius fallback + PostgreSQL cache for read operations + manual review queue for disputed submissions |
| EVM verification complexity | Medium | Ship Solana exploit challenges only in Month 1. Add EVM in Month 2 after core loop proven. |
| Developers don't trust startup-issued credentials | Low | Org own-mint solves this — trust attaches to the organization's brand, not StudyChain |
| Cold-start two-sided marketplace | Medium | Security exploit challenges attract developers organically via X before org layer is built. Orgs see existing developer pool before committing. |

---

## Traction

- **Dev3pack Hackathon** — Winner (Solana Mobile track)
- **The Bridge Accelerator 2026** — Accepted
- **Solana Incubator Off Season II** — Applied
- **School of Solana (Ackee Blockchain)** — Applied
- **Research:** Co-authored "Effect of Quantum Computing on Blockchain Cryptography" — submitted to Springer LNNS / WorldS4 2025, London
- **Micet Wallet** — Shipped non-custodial Solana Firefox extension, 30+ DAU
- **NEXUS Web3 Radar** — Live on Indus App Store, 295+ companies scraped, zero-cost architecture

---

## The One Sentence That Matters

Every certificate you've ever earned lives on someone else's server. StudyChain puts it in your wallet — under the brand of the organization that issued it — where nobody can ever take it away.

---

*StudyChain — Learn. Build. Prove.*

**Contact**
Founder: Yash
X: [@yash514131](https://x.com/yash514131)
