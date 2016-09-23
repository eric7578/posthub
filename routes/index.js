import React from 'react';
import Router from 'koa-router';

import { ssr } from '../utils/ssr.js';
import Index from '../views/index/Index.jsx';

const router = Router();
router.get('/', ssr(<Index />, 'index'));

export default router;
