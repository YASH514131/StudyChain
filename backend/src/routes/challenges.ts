import { Router } from 'express';
import Challenge from '../models/Challenge';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route GET /api/challenges
 * @desc Get all challenges
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const challenges = await Challenge.find({});
    return res.json(challenges);
  } catch (error) {
    console.error('Fetch challenges error:', error);
    return res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

/**
 * @route GET /api/challenges/:id
 * @desc Get single challenge by ID
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const challengeId = parseInt(req.params.id);
    if (isNaN(challengeId)) {
      return res.status(400).json({ error: 'Invalid challenge ID' });
    }

    const challenge = await Challenge.findOne({ id: challengeId });
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    return res.json(challenge);
  } catch (error) {
    console.error('Fetch challenge detail error:', error);
    return res.status(500).json({ error: 'Failed to fetch challenge details' });
  }
});

export default router;
