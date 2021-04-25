import 'regenerator-runtime/runtime';
import express from 'express';
import cors from 'cors';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import expressValidator from 'express-validator';

import authRoutes from './routes/auth';
import productRoutes from './routes/product';
import userRoutes from './routes/user';
import categoryRoutes from './routes/category';
import subCategoryRoutes from './routes/sub';
import cloudinaryRoutes from './routes/cloudinary';

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(expressValidator());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/', productRoutes);
app.use('/api/', categoryRoutes);
app.use('/api/', subCategoryRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'jyven API'
  });
});

app.use((req, res, next) => {
  next(createError(404));
});
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    status: error.status,
    error: {
      message: error.message
    }
  });
});

export default app;
