const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// GET /api/clients - Lister tous les clients
router.get('/', async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        user: true,
        loans: {
          include: {
            book: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(clients);
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/clients/:id - Récupérer un client
router.get('/:id', async (req, res) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: true,
        loans: {
          include: {
            book: true
          }
        }
      }
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    
    res.json(client);
  } catch (error) {
    console.error('Erreur lors de la récupération du client:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/clients - Créer un client
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Nom et email requis' });
    }
    
    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone: phone || null,
        address: address || null
      }
    });
    
    res.status(201).json(client);
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/clients/:id - Mettre à jour un client
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const clientId = parseInt(req.params.id);
    
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    
    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        name: name || client.name,
        email: email || client.email,
        phone: phone !== undefined ? phone : client.phone,
        address: address !== undefined ? address : client.address
      }
    });
    
    res.json(updatedClient);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/clients/:id - Supprimer un client
router.delete('/:id', async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    
    const client = await prisma.client.findUnique({
      where: { id: clientId }
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    
    await prisma.client.delete({
      where: { id: clientId }
    });
    
    res.json({ message: 'Client supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
