import express from 'express';
import path from 'path';
import { __dirname } from './utils.js';

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

export default app;