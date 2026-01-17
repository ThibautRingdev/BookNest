const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { JWT_SECRET } = require('../config/jwt');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validation basique
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    // Trouver l'utilisateur
const user = await prisma.user.findUnique({
      where: { email },
      include: { client: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        clientId: user.clientId,
        clientName: user.client?.name || null
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// POST /api/auth/register (pour créer un client)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Validation basique
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

// Créer d'abord le client
    const client = await prisma.client.create({
      data: {
        email,
        name: email.split('@')[0] // Nom par défaut depuis l'email
      }
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'CLIENT',
        clientId: client.id
      }
    });

res.status(201).json({ 
      message: 'Compte créé avec succès', 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        clientId: user.clientId,
        clientName: client.name
      } 
    });

  } catch (error) {
    console.error('Erreur lors de la création du compte:', error);
    res.status(500).json({ error: 'Erreur lors de la création du compte' });
  }
});

module.exports = router;