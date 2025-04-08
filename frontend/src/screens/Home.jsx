import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const userEmail = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
        <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
      <div style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h1>Home Page</h1>
        <h2>Welcome {userEmail || 'Guest'}</h2>
      </div>
    </div>
  );
};

export default Home;