require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const booksRoutes = require('./routes/books');
const clientsRoutes = require('./routes/clients');
const loansRoutes = require('./routes/loans');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/loans', loansRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Backend BookNest fonctionne !' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 BookNest API ready at http://localhost:${PORT}`);
});
