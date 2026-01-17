const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// GET /api/users - Lister tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        client: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/users/:id - Récupérer un utilisateur
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        client: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/users/:id - Mettre à jour un utilisateur
router.put('/:id', async (req, res) => {
  try {
    const { email, role } = req.body;
    const userId = parseInt(req.params.id);
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email: email || user.email,
        role: role || user.role
      },
      include: {
        client: true
      }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/users/:id - Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    await prisma.user.delete({
      where: { id: userId }
    });
    
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
