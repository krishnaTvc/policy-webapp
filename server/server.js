const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5009;

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set. Add it to server/.env before starting the API.');
  process.exit(1);
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
