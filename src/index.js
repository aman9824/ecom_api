import 'regenerator-runtime/runtime';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();

mongoose.connect(process.env.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });
const port = process.env.PORT || 3000;
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`app running on port ${port}`));
