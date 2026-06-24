import { Response } from 'express';
import { Router } from 'express';
import { Keypair } from '@solana/web3.js';
import Challenge from '../models/Challenge';
import Session from '../models/Session';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route POST /api/sessions/start
 * @desc Start a new challenge solving session
 */
router.post('/start', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { challengeId } = req.body;
  const walletAddress = req.walletAddress;

  if (challengeId === undefined || !walletAddress) {
    return res.status(400).json({ error: 'challengeId is required' });
  }

  try {
    const challenge = await Challenge.findOne({ id: challengeId });
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Check if there is an active session already
    let session = await Session.findOne({
      walletAddress,
      challengeId,
      status: 'active'
    });

    if (session) {
      return res.json(session);
    }

    // Generate a fresh program ID for this developer's sandbox instance
    const sandboxProgramKeypair = Keypair.generate();
    const deployedProgramId = sandboxProgramKeypair.publicKey.toString();

    // Create session
    session = new Session({
      walletAddress,
      challengeId,
      deployedProgramId,
      status: 'active'
    });

    await session.save();
    return res.json(session);
  } catch (error) {
    console.error('Start session error:', error);
    return res.status(500).json({ error: 'Failed to start challenge session' });
  }
});

/**
 * @route GET /api/sessions/active
 * @desc Get all active sessions for the authenticated user
 */
router.get('/active', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const walletAddress = req.walletAddress;

  try {
    const sessions = await Session.find({ walletAddress, status: 'active' });
    return res.json(sessions);
  } catch (error) {
    console.error('Fetch active sessions error:', error);
    return res.status(500).json({ error: 'Failed to fetch active sessions' });
  }
});

export default router;
