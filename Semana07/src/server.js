const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/users.routes');
const webRoutes = require('./routes/web.routes');
const { seedRoles } = require('./utils/seedRoles');
const { seedUsers } = require('./utils/seedUsers');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.redirect('/signIn');
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API working correctly' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/', webRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Server error' });
});

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_db';

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000, connectTimeoutMS: 2000 });
    console.log(`Connected to MongoDB: ${mongoUri}`);
    global.isMemoryMode = false;
  } catch (error) {
    console.warn('MongoDB not available at localhost. Continuing in local memory mode for this environment.');
    global.isMemoryMode = true;
  }
}

async function startServer() {
  await connectDatabase();
  await seedRoles();
  await seedUsers();

  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
}

startServer();

module.exports = app;
