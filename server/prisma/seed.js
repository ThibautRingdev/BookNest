const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');

async function main() {
  console.log('Début du seed...');

  // Créer un admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminClient = await prisma.client.create({
    data: {
      email: 'admin@booknest.com',
      name: 'Admin BookNest'
    }
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@booknest.com',
      password: adminPassword,
      role: 'ADMIN',
      clientId: adminClient.id
    }
  });

  // Créer un client
  const clientPassword = await bcrypt.hash('client123', 10);
  const testClient = await prisma.client.create({
    data: {
      email: 'client@booknest.com',
      name: 'Client Test'
    }
  });

  const client = await prisma.user.create({
    data: {
      email: 'client@booknest.com',
      password: clientPassword,
      role: 'CLIENT',
      clientId: testClient.id
    }
  });

  // Créer des livres
  const books = [
    {
      title: 'Le Petit Prince',
      author: 'Antoine de Saint-Exupéry',
      isbn: '978-2-07-040850-4',
      publisher: 'Gallimard',
      year: 1943,
      category: 'Classique',
      available: true
    },
    {
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0-452-28423-4',
      publisher: 'Secker & Warburg',
      year: 1949,
      category: 'Science-fiction',
      available: true
    },
    {
      title: 'L\'Étranger',
      author: 'Albert Camus',
      isbn: '978-2-07-036002-4',
      publisher: 'Gallimard',
      year: 1942,
      category: 'Classique',
      available: true
    },
    {
      title: 'Le Seigneur des Anneaux',
      author: 'J.R.R. Tolkien',
      isbn: '978-0-261-10235-4',
      publisher: 'Allen & Unwin',
      year: 1954,
      category: 'Fantasy',
      available: true
    },
    {
      title: 'Harry Potter à l\'école des sorciers',
      author: 'J.K. Rowling',
      isbn: '978-0-7475-3269-9',
      publisher: 'Bloomsbury',
      year: 1997,
      category: 'Fantasy',
      available: true
    }
  ];

  await prisma.book.createMany({
    data: books
  });

  console.log('Seed terminé !');
  console.log('Admin créé: admin@booknest.com / admin123');
  console.log('Client créé: client@booknest.com / client123');
  console.log(`${books.length} livres créés`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });