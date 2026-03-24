import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import TransactionList from './pages/TransactionList';
import TransactionForm from './pages/TransactionForm';
import { ThemeProvider, Box, IconButton, Fab } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import theme from './theme';
import moment from 'moment';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const onLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/login');
    }
  };

  const today = moment().format('YYYY-MM-DD');

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className="iphone-x">
          <div className="iphone-x-top"></div>
          
          <div className="iphone-x-screen">
            <Routes>
              <Route path="/login" element={<Login onLoginSuccess={onLoginSuccess} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<TransactionList />} />
              <Route path="/transactions/new" element={<TransactionForm />} />
              <Route path="/transactions/edit/:id" element={<TransactionForm />} />
            </Routes>
          </div>

          {/* 폰 안쪽 하단에 고정된 미니멀 탭 바 (로그인 시에만 보임) */}
          {isLoggedIn && (
            <Box sx={{ 
                position: 'absolute', bottom: 25, left: '50%', transform: 'translateX(-50%)',
                width: '85%', height: 64, bgcolor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)', borderRadius: 8,
                display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                border: '1px solid #fde68a', zIndex: 1000
            }}>
                <IconButton sx={{ color: '#fbbf24' }} component={Link} to="/"><HomeIcon /></IconButton>
                <Fab
                    color="primary" component={Link} to={`/transactions/new?date=${today}`}
                    sx={{ mt: -5, width: 60, height: 60, boxShadow: '0 8px 20px rgba(251, 191, 36, 0.4)', border: '5px solid #fffdf5' }}
                >
                    <AddIcon sx={{ fontSize: 32 }} />
                </Fab>
                <IconButton sx={{ color: '#d1d5db' }} onClick={handleLogout}>
                    <LogoutIcon />
                </IconButton>
            </Box>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
