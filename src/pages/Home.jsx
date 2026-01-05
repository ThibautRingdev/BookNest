import Header from '../components/Header'
import DashboardCard from '../components/DashboardCard'
import { FaBook, FaUsers, FaClipboardList, FaClock, FaPlus, FaUserPlus } from 'react-icons/fa'

// Import Google Fonts (Inter as an example of a friendly, modern font)
const fontLinkId = 'google-font-inter-link';

// Only inject the font link once
if (!document.getElementById(fontLinkId)) {
  const link = document.createElement('link');
  link.id = fontLinkId;
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap';
  document.head.appendChild(link);
}

function Home() {
  const fontFamily = "'Inter', Arial, sans-serif";

  // Example quick action handlers (replace with your navigation logic)
  const handleAddBook = () => {
    // navigate to add book page or open modal
    alert('Rediriger vers Ajouter un livre');
  };

  const handleAddClient = () => {
    // navigate to add client page or open modal
    alert('Rediriger vers Ajouter un client');
  };

  return (
    <div style={{ fontFamily }}>
      <Header />

      <main style={{ padding: '32px', backgroundColor: '#f5f5f5', minHeight: '100vh', fontFamily }}>
        <h1 style={{ marginBottom: '24px', fontFamily, fontWeight: 700, letterSpacing: '0.01em' }}>
          Tableau de bord
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            fontFamily,
            marginBottom: '36px' // more spacing before quick actions
          }}
        >
          <DashboardCard title="Total Livres" value="1,247" icon={FaBook} />
          <DashboardCard title="Clients actifs" value="342" icon={FaUsers} />
          <DashboardCard title="Emprunts en cours" value="89" icon={FaClipboardList} />
          <DashboardCard title="Retours attendus" value="23" icon={FaClock} />
        </div>
        </main>
    </div>
  );
}

export default Home
