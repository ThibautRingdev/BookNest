const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// GET /api/loans - Lister tous les emprunts
router.get('/', async (req, res) => {
  try {
    const loans = await prisma.loan.findMany({
      include: {
        book: true,
        client: {
          include: {
            user: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(loans);
  } catch (error) {
    console.error('Erreur lors de la récupération des emprunts:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/loans/:id - Récupérer un emprunt
router.get('/:id', async (req, res) => {
  try {
    const loan = await prisma.loan.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        book: true,
        client: {
          include: {
            user: true
          }
        }
      }
    });
    
    if (!loan) {
      return res.status(404).json({ error: 'Emprunt non trouvé' });
    }
    
    res.json(loan);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'emprunt:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/loans - Créer un emprunt
router.post('/', async (req, res) => {
  try {
    const { bookId, clientId, dueDate } = req.body;
    
    if (!bookId || !clientId) {
      return res.status(400).json({ error: 'bookId et clientId requis' });
    }
    
    // Vérifier que le livre existe et est disponible
    const book = await prisma.book.findUnique({
      where: { id: parseInt(bookId) }
    });
    
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }
    
    if (!book.available) {
      return res.status(400).json({ error: 'Livre non disponible' });
    }
    
    // Vérifier que le client existe
    const client = await prisma.client.findUnique({
      where: { id: parseInt(clientId) }
    });
    
    if (!client) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }
    
    // Créer l'emprunt
    const loan = await prisma.loan.create({
      data: {
        bookId: parseInt(bookId),
        clientId: parseInt(clientId),
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 jours par défaut
      },
      include: {
        book: true,
        client: true
      }
    });
    
    // Marquer le livre comme non disponible
    await prisma.book.update({
      where: { id: parseInt(bookId) },
      data: { available: false }
    });
    
    res.status(201).json(loan);
  } catch (error) {
    console.error('Erreur lors de la création de l\'emprunt:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/loans/:id/return - Marquer un emprunt comme retourné
router.put('/:id/return', async (req, res) => {
  try {
    const loanId = parseInt(req.params.id);
    
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: { book: true }
    });
    
    if (!loan) {
      return res.status(404).json({ error: 'Emprunt non trouvé' });
    }
    
    if (loan.status === 'returned') {
      return res.status(400).json({ error: 'Emprunt déjà retourné' });
    }
    
    // Mettre à jour l'emprunt
    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: 'returned',
        returnDate: new Date()
      },
      include: {
        book: true,
        client: true
      }
    });
    
    // Marquer le livre comme disponible
    await prisma.book.update({
      where: { id: loan.bookId },
      data: { available: true }
    });
    
    res.json(updatedLoan);
  } catch (error) {
    console.error('Erreur lors du retour de l\'emprunt:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/loans/:id - Supprimer un emprunt
router.delete('/:id', async (req, res) => {
  try {
    const loanId = parseInt(req.params.id);
    
    const loan = await prisma.loan.findUnique({
      where: { id: loanId }
    });
    
    if (!loan) {
      return res.status(404).json({ error: 'Emprunt non trouvé' });
    }
    
    await prisma.loan.delete({
      where: { id: loanId }
    });
    
    res.json({ message: 'Emprunt supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'emprunt:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
