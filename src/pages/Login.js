import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Button, TextField, Box, Typography, Grid } from '@mui/material';

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestData = { email, password };

    try {
      const response = await api.post('/api/members/login', requestData);
      const token = response.data.accessToken;

      localStorage.setItem('accessToken', token);
      setIsLoggedIn(true);

      alert('로그인에 성공했습니다! 🥳 \n메인 페이지로 이동합니다.');
      navigate('/');

    } catch (error) {
      console.error('API 오류:', error);
      alert('로그인에 실패했습니다. 😭 \n이메일과 비밀번호를 다시 확인해주세요.');
    }
  };

  const neumorphicTextFieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
        '& fieldset': {
            border: 'none',
        },
    },
    mb: 2
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 3,
      }}
    >
      <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
        로그인
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <TextField
          required
          fullWidth
          id="email"
          label="이메일 주소"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={neumorphicTextFieldSx}
        />
        <TextField
          required
          fullWidth
          name="password"
          label="비밀번호"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={neumorphicTextFieldSx}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 2 }}
        >
          로그인
        </Button>

        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link to="/signup" style={{ color: '#333', textDecoration: 'none' }}>
              {"계정이 없으신가요? 회원가입"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Login;