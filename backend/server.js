import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDatabase from './config/dbConfig.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();
connectDatabase();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contacts', contactRoutes);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
  
  app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
