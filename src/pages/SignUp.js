import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Typography, Box, TextField, Button, CircularProgress, Paper, Container } from '@mui/material';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/members/signup', { email, password, nickname });
            alert('회원가입이 완료되었습니다. 로그인해주세요! ✨');
            navigate('/login');
        } catch (error) {
            console.error('회원가입 실패:', error);
            alert('이미 존재하는 이메일이거나 입력 정보가 올바르지 않습니다.');
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
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#451a03' }}>반가워요! 👋</Typography>
                    <Typography variant="body2" sx={{ color: '#92400e', mt: 1 }}>새로운 추억을 기록할 준비가 되셨나요?</Typography>
                </Box>

                <Paper sx={{ p: 4, borderRadius: 6, boxShadow: '0 12px 40px rgba(251, 191, 36, 0.1)' }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="닉네임" fullWidth required variant="standard"
                            value={nickname} onChange={(e) => setNickname(e.target.value)}
                            sx={{ mb: 3 }}
                        />
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
                            {loading ? <CircularProgress size={24} color="inherit" /> : '시작하기'}
                        </Button>
                    </Box>
                </Paper>

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                        이미 계정이 있으신가요? {' '}
                        <Link to="/login" style={{ color: '#fbbf24', fontWeight: 700, textDecoration: 'none' }}>
                            로그인
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default SignUp;
