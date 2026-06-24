import { Router } from 'express';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import Developer from '../models/Developer';
import { generateToken } from '../utils/jwt';

const router = Router();

// In-memory store for nonces (should be replaced with Redis or similar in production)
const nonces = new Map<string, string>();

/**
 * @route GET /api/auth/nonce
 * @desc Get a one-time nonce for wallet signing
 */
router.get('/nonce', (req, res) => {
  const { walletAddress } = req.query;
  
  if (!walletAddress || typeof walletAddress !== 'string') {
    return res.status(400).json({ error: 'walletAddress parameter is required' });
  }

  // Generate a random 6-digit nonce
  const nonce = Math.floor(100000 + Math.random() * 900000).toString();
  nonces.set(walletAddress, nonce);

  // Set timeout to delete nonce after 5 minutes
  setTimeout(() => {
    nonces.delete(walletAddress);
  }, 5 * 60 * 1000);

  return res.json({ nonce });
});

/**
 * @route POST /api/auth/login
 * @desc Verify wallet signature and return JWT
 */
router.post('/login', async (req: any, res: any) => {
  const { walletAddress, signature, message } = req.body;

  if (!walletAddress || !signature || !message) {
    return res.status(400).json({ error: 'walletAddress, signature, and message are required' });
  }

  const savedNonce = nonces.get(walletAddress);
  if (!savedNonce) {
    return res.status(400).json({ error: 'Nonce not found or expired. Please request a new nonce.' });
  }

  // Verify that the message contains the expected nonce
  if (!message.includes(savedNonce)) {
    return res.status(400).json({ error: 'Message content does not match the active session nonce' });
  }

  try {
    // Decode public key, signature, and message
    const publicKeyBytes = bs58.decode(walletAddress);
    const signatureBytes = bs58.decode(signature);
    const messageBytes = new TextEncoder().encode(message);

    // Verify signature
    const isVerified = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);

    if (!isVerified) {
      return res.status(401).json({ error: 'Authentication failed. Invalid signature.' });
    }

    // Clear nonce
    nonces.delete(walletAddress);

    // Find or create developer profile
    let developer = await Developer.findOne({ walletAddress });
    if (!developer) {
      developer = new Developer({
        walletAddress,
        nasScore: 0,
        tier: 'Initiate'
      });
      await developer.save();
    }

    // Generate JWT
    const token = generateToken({ walletAddress });

    return res.json({
      token,
      developer: {
        walletAddress: developer.walletAddress,
        nasScore: developer.nasScore,
        tier: developer.tier
      }
    });
  } catch (error: any) {
    console.error('Wallet signature validation error:', error);
    return res.status(500).json({ error: 'Internal server error validating signature' });
  }
});

export default router;
