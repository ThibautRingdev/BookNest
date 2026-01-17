import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await login(email, password);
      
// Rediriger selon le rôle
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '400px'
      }}>
        <h1 style={{ marginBottom: '24px', textAlign: 'center' }}>
          📚 BookNest
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              required
            />
          </div>

          {error && (
            <div style={{ 
              color: 'red', 
              marginBottom: '16px',
              padding: '10px',
              backgroundColor: '#ffebee',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Se connecter
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <p>Comptes de test :</p>
<p>Admin : admin@booknest.com / admin123</p>
          <p>Client : client@booknest.com / client123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;