import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Button, TextField, Box, Typography, Grid } from '@mui/material';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requestData = { email, password, nickname };

    try {
      await api.post('/api/members/signup', requestData);
      alert('회원가입에 성공했습니다! 🥳 \n로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (error) {
      console.error('API 오류:', error);
      alert('회원가입에 실패했습니다. 😭 \n' + (error.response?.data?.message || '입력 정보를 확인해주세요.'));
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
        추억가계부 회원가입
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={neumorphicTextFieldSx}
        />
        <TextField
          required
          fullWidth
          name="nickname"
          label="닉네임"
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          sx={neumorphicTextFieldSx}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 2 }}
        >
          가입하기
        </Button>

        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link to="/login" style={{ color: '#333', textDecoration: 'none' }}>
              {"이미 계정이 있으신가요? 로그인"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default SignUp;