import express from 'express';
import compose from 'composable-middleware';
import { config } from '../config/environment';
import User from '../api/v1/user/user.model';

// Passport Configuration
require('./local/passport').setup(User, config);

const router = express.Router();

router.use('/local', require('./local').default);

export default router;
