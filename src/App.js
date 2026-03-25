import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import TransactionList from './pages/TransactionList';
import TransactionForm from './pages/TransactionForm';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import { ThemeProvider, Box, IconButton, Fab } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import LogoutIcon from '@mui/icons-material/Logout';
import theme from './theme';
import moment from 'moment';
import SeasonalBackground from './components/SeasonalBackground';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    // 현재 경로가 로그인이나 회원가입이 아니면서 로그인이 안 된 경우 로그인 페이지로 이동
    const path = window.location.pathname;
    if (!loggedIn && path !== '/login' && path !== '/signup') {
      navigate('/login');
    }
  }, [navigate]);

  const onLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/login');
    }
  };

  const today = moment().format('YYYY-MM-DD');

  const getSeason = (date) => {
    const month = date.getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  };

  const season = getSeason(currentDate);

  return (
    <ThemeProvider theme={theme}>
      <div className={`App ${season}`}>
        <div className="iphone-x">
          <div className="iphone-x-top"></div>
          
          <div className="iphone-x-screen">
            <SeasonalBackground season={season} />
            <Routes>
              <Route path="/login" element={<Login onLoginSuccess={onLoginSuccess} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<TransactionList currentDate={currentDate} setCurrentDate={setCurrentDate} />} />
              <Route path="/transactions/new" element={<TransactionForm />} />
              <Route path="/transactions/edit/:id" element={<TransactionForm />} />
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </div>

          {isLoggedIn && (
            <Box sx={{ 
                position: 'absolute', bottom: 25, left: '50%', transform: 'translateX(-50%)',
                width: '90%', height: 64, bgcolor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)', borderRadius: 8,
                display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                border: '1px solid #fde68a', zIndex: 1000, px: 1
            }}>
                <IconButton sx={{ color: '#fbbf24' }} component={Link} to="/"><HomeIcon /></IconButton>
                <IconButton sx={{ color: '#d1d5db' }} component={Link} to="/search"><SearchIcon /></IconButton>
                
                <Fab
                    color="primary" component={Link} to={`/transactions/new?date=${today}`}
                    sx={{ mt: -5, width: 60, height: 60, boxShadow: '0 8px 20px rgba(251, 191, 36, 0.4)', border: '5px solid #fff' }}
                >
                    <AddIcon sx={{ fontSize: 32 }} />
                </Fab>

                <IconButton sx={{ color: '#d1d5db' }} component={Link} to="/favorites"><StarIcon /></IconButton>
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
