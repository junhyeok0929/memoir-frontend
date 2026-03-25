import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Typography, Box, TextField, Button, CircularProgress, Paper, Container } from '@mui/material';

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/api/members/login', { email, password });
            // 백엔드 TokenResponseDto의 필드명인 'accessToken'으로 꺼냅니다.
            const token = response.data.accessToken; 
            
            if (token) {
                localStorage.setItem('token', token);
                onLoginSuccess();
                navigate('/');
            } else {
                alert('로그인에 실패했습니다. (토큰이 없습니다)');
            }
        } catch (error) {
            console.error('로그인 실패:', error);
            alert('이메일 또는 비밀번호가 올바르지 않습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', bgcolor: '#fffdf5', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            p: 3 
        }}>
            <Container maxWidth="xs">
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#fbbf24', mb: 1 }}>✨</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#451a03' }}>추억 가계부 📒</Typography>
                    <Typography variant="body2" sx={{ color: '#92400e', mt: 1 }}>오늘의 소중한 순간을 기록하세요</Typography>
                </Box>

                <Paper sx={{ p: 4, borderRadius: 6, boxShadow: '0 12px 40px rgba(251, 191, 36, 0.1)' }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="이메일" fullWidth required variant="standard"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            label="비밀번호" type="password" fullWidth required variant="standard"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 4 }}
                        />
                        <Button 
                            type="submit" variant="contained" fullWidth size="large" 
                            disabled={loading}
                            sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1rem' }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : '로그인'}
                        </Button>
                    </Box>
                </Paper>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                        계정이 없으신가요? {' '}
                        <Link to="/signup" style={{ color: '#fbbf24', fontWeight: 700, textDecoration: 'none' }}>
                            회원가입
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default Login;
