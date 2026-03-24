import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import TransactionList from './pages/TransactionList';
import TransactionForm from './pages/TransactionForm';
import { AppBar, Toolbar, Typography, Button, Box, ThemeProvider } from '@mui/material';
import theme from './theme';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className="iphone-x">
          <div className="iphone-x-top">
            <div className="iphone-x-camera"></div>
            <div className="iphone-x-speaker"></div>
          </div>
          <div className="iphone-x-screen">
            <AppBar position="static" sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
              <Toolbar>
                <Box sx={{ flexGrow: 1 }} />
                <Typography
                  variant="h6"
                  component={Link}
                  to="/"
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  추억가계부
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  {isLoggedIn ? (
                    <Button color="inherit" onClick={handleLogout}>
                      로그아웃
                    </Button>
                  ) : (
                    <>
                      <Button color="inherit" component={Link} to="/login">
                        로그인
                      </Button>
                      <Button color="inherit" component={Link} to="/signup">
                        회원가입
                      </Button>
                    </>
                  )}
                </Box>
              </Toolbar>
            </AppBar>

            <Routes>
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={<TransactionList />} />
              <Route path="/transactions/new" element={<TransactionForm />} />
              <Route path="/transactions/edit/:id" element={<TransactionForm />} />
            </Routes>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;