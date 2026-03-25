import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../api';
import { 
    Typography, Box, TextField, Button, CircularProgress, 
    FormControl, InputLabel, Select, MenuItem, Divider, InputAdornment, IconButton
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import StarIcon from '@mui/icons-material/Star';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

function TransactionForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const fileInputRef = useRef(null);
    const isEditMode = id !== undefined;

    const [transactionDate, setTransactionDate] = useState('');
    const [type, setType] = useState('EXPENSE');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [diaryTitle, setDiaryTitle] = useState('');
    const [diaryContent, setDiaryContent] = useState('');
    const [loading, setLoading] = useState(isEditMode);

    // 사진 관련 상태
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState('');

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
                    
                    if (transaction.imageUrl) {
                        setExistingImageUrl(transaction.imageUrl);
                        // 백엔드의 WebConfig 설정에 맞게 경로 구성 (예: http://IP:8088/uploads/파일명)
                        setImagePreview(`${api.defaults.baseURL}/uploads/${transaction.imageUrl}`);
                    }
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
        setCategory(''); 
    };

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setAmount(value);
    };

    const formatAmount = (val) => {
        if (!val) return '';
        return parseInt(val, 10).toLocaleString();
    };

    // 사진 선택 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setExistingImageUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
        
        let finalImageUrl = existingImageUrl;

        try {
            // 1. 사진이 새로 선택되었다면 먼저 업로드
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                
                const uploadRes = await api.post('/api/transactions/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalImageUrl = uploadRes.data; // 서버에서 저장된 파일명을 받아옴
            }

            // 2. 가계부 데이터 구성
            const transactionData = { 
                transactionDate, 
                type, 
                amount: parseInt(amount, 10), 
                category, 
                diaryTitle, 
                diaryContent,
                imageUrl: finalImageUrl // 사진 경로 추가
            };

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
            alert(`저장 실패! ✨`);
        }
    };

    if (loading) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>;

    const sectionBoxSx = {
        p: 3, 
        borderRadius: 4, 
        mb: 3, 
        bgcolor: 'rgba(255,255,255,0.6)',
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
                
                <Box sx={{ ...sectionBoxSx, bgcolor: '#fffef5', border: '1px solid #f0ead6' }}>
                    <TextField
                        label="제목" fullWidth variant="standard"
                        value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)}
                        placeholder="짧은 제목"
                        sx={{ mb: 2 }}
                    />
                    
                    {/* 사진 업로드 섹션 - 크기 다시 적정 수준으로 조정 */}
                    <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        {imagePreview ? (
                            <Box sx={{ 
                                position: 'relative', 
                                width: '100%', 
                                borderRadius: 2, 
                                overflow: 'hidden', 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                border: '2px solid #fff' 
                            }}>
                                <img src={imagePreview} alt="미리보기" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }} />
                                <IconButton 
                                    onClick={handleRemoveImage}
                                    sx={{ 
                                        position: 'absolute', top: 8, right: 8, 
                                        bgcolor: 'rgba(0,0,0,0.5)', color: 'white', 
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } 
                                    }}
                                    size="small"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ) : (
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                startIcon={<AddPhotoAlternateIcon />}
                                sx={{ 
                                    borderStyle: 'dashed', 
                                    py: 3, 
                                    color: 'text.secondary', 
                                    borderColor: '#d1d5db',
                                    bgcolor: 'rgba(0,0,0,0.01)'
                                }}
                            >
                                사진 추가하기
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                />
                            </Button>
                        )}
                    </Box>

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
