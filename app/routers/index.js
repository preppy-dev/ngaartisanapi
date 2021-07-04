import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: "Bienvenu a API de N'ga Artisan ",
    version: '1.0.0',
  });
});

export default router;