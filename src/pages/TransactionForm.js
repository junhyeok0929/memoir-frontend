import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../api';
import { Typography, Box, TextField, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function TransactionForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = id !== undefined;

    const [transactionDate, setTransactionDate] = useState('');
    const [type, setType] = useState('EXPENSE');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [memo, setMemo] = useState('');
    const [loading, setLoading] = useState(isEditMode);

    const categories = [
        '식비',
        '교통/차량',
        '여가생활',
        '마트/편의점',
        '패션/미용',
        '생활비',
        '통신',
        '건강',
        '교육',
        '경조사/회비',
        '부모님',
        '숙박',
        '기타'
    ];

    useEffect(() => {
        if (isEditMode) {
            const fetchTransaction = async () => {
                try {
                    const response = await api.get(`/api/transactions/${id}`);
                    const transaction = response.data;
                    setTransactionDate(transaction.transactionDate);
                    setType(transaction.type);
                    setAmount(transaction.amount);
                    setCategory(transaction.category);
                    setMemo(transaction.memo);
                } catch (error) {
                    console.error("거래 내역 정보를 불러오는데 실패했습니다.", error);
                    alert("거래 내역 정보를 불러오는데 실패했습니다.");
                    navigate('/');
                } finally {
                    setLoading(false);
                }
            };
            fetchTransaction();
        } else {
            const queryParams = new URLSearchParams(location.search);
            const dateFromUrl = queryParams.get('date');
            if (dateFromUrl) {
                setTransactionDate(dateFromUrl);
            } else {
                setTransactionDate(new Date().toISOString().slice(0, 10));
            }
        }
    }, [id, isEditMode, navigate, location.search]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const transactionData = { transactionDate, type, amount: parseInt(amount, 10), category, memo };

        try {
            if (isEditMode) {
                await api.put(`/api/transactions/${id}`, transactionData);
                alert('거래 내역이 성공적으로 수정되었습니다.');
            } else {
                await api.post('/api/transactions', transactionData);
                alert('거래 내역이 성공적으로 작성되었습니다.');
            }
            navigate('/', { state: { refresh: true } });
        } catch (error) {
            console.error("거래 내역 저장 실패:", error);
            let errorMessage = '입력 정보를 확인해주세요.';
            if (error.response) {
                errorMessage = `서버 오류: ${error.response.status}\n메시지: ${JSON.stringify(error.response.data)}`;
            } else if (error.request) {
                errorMessage = '서버로부터 응답을 받지 못했습니다. 백엔드 서버가 실행 중인지 확인해주세요.';
            } else {
                errorMessage = `요청 설정 오류: ${error.message}`;
            }
            alert('거래 내역 저장에 실패했습니다. \n' + errorMessage);
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

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
                <CircularProgress />
                <Typography>거래 내역 정보를 불러오는 중...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography component="h1" variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
                {isEditMode ? '거래 내역 수정' : '새 거래 내역 작성'}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <TextField
                    label="날짜"
                    type="date"
                    fullWidth
                    required
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={neumorphicTextFieldSx}
                />
                <FormControl fullWidth sx={neumorphicTextFieldSx}>
                    <InputLabel>종류</InputLabel>
                    <Select
                        value={type}
                        label="종류"
                        onChange={(e) => setType(e.target.value)}
                    >
                        <MenuItem value="INCOME">수입</MenuItem>
                        <MenuItem value="EXPENSE">지출</MenuItem>
                        <MenuItem value="TRANSFER">이체</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="금액"
                    type="number"
                    fullWidth
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    sx={neumorphicTextFieldSx}
                />
                <FormControl fullWidth required sx={neumorphicTextFieldSx}>
                    <InputLabel>카테고리</InputLabel>
                    <Select
                        value={category}
                        label="카테고리"
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="일기"
                    fullWidth
                    multiline
                    rows={6}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    sx={neumorphicTextFieldSx}
                />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    {isEditMode ? '수정하기' : '작성하기'}
                </Button>
                 <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={() => navigate('/')}>
                    취소
                </Button>
            </Box>
        </Box>
    );
}

export default TransactionForm;