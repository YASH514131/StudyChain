import { Router } from 'express';
import Credential from '../models/Credential';
import Developer from '../models/Developer';

const router = Router();

/**
 * @route GET /api/credentials/:wallet
 * @desc Get all credentials earned by a developer
 */
router.get('/:wallet', async (req, res) => {
  const { wallet } = req.params;

  if (!wallet) {
    return res.status(400).json({ error: 'Wallet address parameter is required' });
  }

  try {
    const credentials = await Credential.find({ recipientWallet: wallet });
    return res.json(credentials);
  } catch (error) {
    console.error('Fetch credentials error:', error);
    return res.status(500).json({ error: 'Failed to fetch credentials' });
  }
});

/**
 * @route GET /api/credentials/profile/:wallet
 * @desc Get developer profile stats and credentials
 */
router.get('/profile/:wallet', async (req, res) => {
  const { wallet } = req.params;

  if (!wallet) {
    return res.status(400).json({ error: 'Wallet address parameter is required' });
  }

  try {
    let developer = await Developer.findOne({ walletAddress: wallet });
    
    // If not found, check if they exist or just return a default starting state
    if (!developer) {
      developer = new Developer({
        walletAddress: wallet,
        nasScore: 0,
        tier: 'Initiate'
      });
    }

    const credentials = await Credential.find({ recipientWallet: wallet });

    return res.json({
      developer: {
        walletAddress: developer.walletAddress,
        nasScore: developer.nasScore,
        tier: developer.tier,
        createdAt: developer.createdAt
      },
      credentials
    });
  } catch (error) {
    console.error('Fetch profile details error:', error);
    return res.status(500).json({ error: 'Failed to fetch profile details' });
  }
});

export default router;
