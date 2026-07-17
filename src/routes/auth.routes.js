import express from 'express';

const router = express.Router();

router.post('/sign-up', async (req, res) => {
  res.send('POST /api/auth/sign-up');
});

router.post('/sign-in', async (req, res) => {
  res.send('POST /api/auth/sign-in');
});

router.post('/sign-out', async (req, res) => {
  res.send('POST /api/auth/sign-out');
});

export default router;
