const express = require('express');
const prisma = require('../lib/prisma');

const router = express.Router();

// GET tous les livres
router.get('/', async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(books);
  } catch (error) {
    console.error('Erreur lors de la récupération des livres:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/books/:id - Récupérer un livre
router.get('/:id', async (req, res) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Erreur lors de la récupération du livre:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST nouveau livre
router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, publisher, year, category } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ error: 'Titre et auteur requis' });
    }
    
    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn: isbn || null,
        publisher: publisher || null,
        year: year ? parseInt(year) : null,
        category: category || null
      }
    });
    
    res.status(201).json(book);
  } catch (error) {
    console.error('Erreur lors de la création du livre:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT modifier un livre
router.put('/:id', async (req, res) => {
  try {
    const { title, author, isbn, publisher, year, category, available } = req.body;
    const bookId = parseInt(req.params.id);
    
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });
    
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }
    
    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        title: title || book.title,
        author: author || book.author,
        isbn: isbn !== undefined ? isbn : book.isbn,
        publisher: publisher !== undefined ? publisher : book.publisher,
        year: year !== undefined ? (year ? parseInt(year) : null) : book.year,
        category: category !== undefined ? category : book.category,
        available: available !== undefined ? available : book.available
      }
    });
    
    res.json(updatedBook);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du livre:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE supprimer un livre
router.delete('/:id', async (req, res) => {
  try {
    const bookId = parseInt(req.params.id);
    
    const book = await prisma.book.findUnique({
      where: { id: bookId }
    });
    
    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé' });
    }
    
    await prisma.book.delete({
      where: { id: bookId }
    });
    
    res.json({ message: 'Livre supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du livre:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;