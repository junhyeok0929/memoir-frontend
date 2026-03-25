import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../api';
import { 
    Typography, Box, TextField, Button, CircularProgress, 
    FormControl, InputLabel, Select, MenuItem, Divider, InputAdornment
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';

import StarIcon from '@mui/icons-material/Star';

function TransactionForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = id !== undefined;

    const [transactionDate, setTransactionDate] = useState('');
    const [type, setType] = useState('EXPENSE');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [diaryTitle, setDiaryTitle] = useState('');
    const [diaryContent, setDiaryContent] = useState('');
    const [loading, setLoading] = useState(isEditMode);

    const expenseCategories = [
        '식비', '교통/차량', '여가생활', '마트/편의점', '패션/미용', 
        '생활비', '통신', '건강', '교육', '경조사/회비', '부모님', '기타'
    ];

    const incomeCategories = [
        '월급', '부수입', '용돈', '상여', '금융소득', '기타'
    ];

    useEffect(() => {
        if (isEditMode) {
            const fetchTransaction = async () => {
                try {
                    const response = await api.get(`/api/transactions/${id}`);
                    const transaction = response.data;
                    setTransactionDate(transaction.transactionDate);
                    setType(transaction.type);
                    setAmount(transaction.amount.toString());
                    setCategory(transaction.category);
                    setDiaryTitle(transaction.diaryTitle || '');
                    setDiaryContent(transaction.diaryContent || '');
                } catch (error) {
                    console.error("데이터 로드 실패:", error);
                    alert("정보를 불러오는데 실패했습니다.");
                    navigate('/');
                } finally {
                    setLoading(false);
                }
            };
            fetchTransaction();
        } else {
            const queryParams = new URLSearchParams(location.search);
            const dateFromUrl = queryParams.get('date');
            const categoryFromUrl = queryParams.get('category');
            const amountFromUrl = queryParams.get('amount');
            const typeFromUrl = queryParams.get('type');

            setTransactionDate(dateFromUrl || new Date().toISOString().slice(0, 10));
            if (categoryFromUrl) setCategory(categoryFromUrl);
            if (amountFromUrl) setAmount(amountFromUrl);
            if (typeFromUrl) setType(typeFromUrl);
        }
    }, [id, isEditMode, navigate, location.search]);

    const handleTypeChange = (e) => {
        setType(e.target.value);
        setCategory(''); // 구분 변경 시 카테고리 초기화
    };

    // 금액 입력 시 콤마 처리 및 음수 차단
    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남김 (음수 차단)
        setAmount(value);
    };

    // 화면 표시용 콤마 포맷팅
    const formatAmount = (val) => {
        if (!val) return '';
        return parseInt(val, 10).toLocaleString();
    };

    const handleAddFavorite = async () => {
        if (!amount || !category) {
            alert('금액과 카테고리를 입력해주세요.');
            return;
        }

        const templateName = window.prompt('즐겨찾기 이름을 입력해주세요 (예: 스타벅스 커피)');
        if (!templateName) return;

        try {
            await api.post('/api/favorites', {
                templateName,
                type,
                amount: parseInt(amount, 10),
                category
            });
            alert('즐겨찾기에 추가되었습니다! ⭐');
        } catch (error) {
            console.error("즐겨찾기 추가 실패:", error);
            alert('즐겨찾기 추가에 실패했습니다.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const transactionData = { 
            transactionDate, 
            type, 
            amount: parseInt(amount, 10), 
            category, 
            diaryTitle, 
            diaryContent 
        };

        try {
            if (isEditMode) {
                await api.put(`/api/transactions/${id}`, transactionData);
                alert('추억이 수정되었습니다. ✨');
            } else {
                await api.post('/api/transactions', transactionData);
                alert('새로운 추억이 기록되었습니다. 📖');
            }
            navigate('/', { state: { refresh: true } });
        } catch (error) {
            console.error("저장 실패 상세:", error);
            let errorDetail = '';
            
            if (error.response) {
                // 서버가 응답을 보낸 경우 (4xx, 5xx)
                const status = error.response.status;
                const data = error.response.data;
                const message = typeof data === 'string' ? data : JSON.stringify(data);
                errorDetail = `[상태코드: ${status}] 내용: ${message}`;
            } else if (error.request) {
                errorDetail = '서버로부터 응답을 받지 못했습니다. (네트워크/CORS 문제)';
            } else {
                errorDetail = error.message;
            }
            
            alert(`저장 실패! ✨\n원인: ${errorDetail}\n(내용을 캡처해서 알려주시면 바로 해결 가능합니다!)`);
        }
    };

    if (loading) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>;

    const sectionBoxSx = {
        p: 3, 
        borderRadius: 4, 
        mb: 3, 
        bgcolor: 'rgba(255,255,255,0.6)', // 배경색과 어우러지는 반투명 흰색
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
    };

    return (
        <Box sx={{ p: 3, pb: 12, maxWidth: 500, margin: '0 auto', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a1a1a' }}>
                    {isEditMode ? '기록 수정' : '오늘의 기록'}
                </Typography>
                {!isEditMode && (
                    <Button 
                        startIcon={<StarIcon />} 
                        onClick={handleAddFavorite}
                        sx={{ color: '#fbbf24', fontWeight: 700 }}
                    >
                        즐겨찾기 추가
                    </Button>
                )}
            </Box>
            
            <Box component="form" onSubmit={handleSubmit}>
                <Box sx={sectionBoxSx}>
                    <TextField
                        label="날짜" type="date" fullWidth required variant="standard"
                        value={transactionDate}
                        onChange={(e) => setTransactionDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 3 }}
                    />
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel>구분</InputLabel>
                            <Select value={type} label="구분" onChange={handleTypeChange}>
                                <MenuItem value="INCOME">수입</MenuItem>
                                <MenuItem value="EXPENSE">지출</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth required variant="standard">
                            <InputLabel>카테고리</InputLabel>
                            <Select value={category} label="카테고리" onChange={(e) => setCategory(e.target.value)}>
                                {(type === 'INCOME' ? incomeCategories : expenseCategories).map((cat) => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <TextField
                        label="금액" fullWidth required variant="standard"
                        value={formatAmount(amount)}
                        onChange={handleAmountChange}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">원</InputAdornment>,
                        }}
                    />
                </Box>

                <Typography variant="subtitle1" sx={{ mb: 1.5, ml: 1, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1, color: '#444' }}>
                    <BookIcon fontSize="small" color="primary" /> 추억 남기기
                </Typography>
                
                <Box sx={{ ...sectionBoxSx, bgcolor: '#fffef5', border: '1px solid #f0ead6' }}> {/* 편지지 느낌 */}
                    <TextField
                        label="제목" fullWidth variant="standard"
                        value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)}
                        placeholder="짧은 제목"
                        sx={{ mb: 2 }}
                    />
                    <Divider sx={{ mb: 2, opacity: 0.5 }} />
                    <TextField
                        label="본문" fullWidth multiline rows={6} variant="standard"
                        value={diaryContent} onChange={(e) => setDiaryContent(e.target.value)}
                        placeholder="오늘 하루는 어땠나요?"
                        InputProps={{ disableUnderline: true, sx: { fontSize: '0.95rem', lineHeight: 1.6 } }}
                    />
                </Box>

                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <Button type="submit" variant="contained" fullWidth size="large" disableElevation sx={{ borderRadius: 3, py: 1.5 }}>
                        {isEditMode ? '수정 완료' : '기록하기'}
                    </Button>
                    <Button variant="text" fullWidth size="large" onClick={() => navigate('/')} sx={{ color: 'text.secondary' }}>
                        취소
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default TransactionForm;
