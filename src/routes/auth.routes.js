import express from 'express';
import { signUp } from '#controllers/auth.controller.js';

const router = express.Router();

router.post('/sign-up', signUp);

router.post('/sign-in', async (req, res) => {
  res.send('POST /api/auth/sign-in');
});

router.post('/sign-out', async (req, res) => {
  res.send('POST /api/auth/sign-out');
});

export default router;
