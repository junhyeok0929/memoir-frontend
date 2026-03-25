import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, IconButton, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import DeleteIcon from '@mui/icons-material/Delete';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CoffeeIcon from '@mui/icons-material/Coffee';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PaymentsIcon from '@mui/icons-material/Payments';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SavingsIcon from '@mui/icons-material/Savings';
import RedeemIcon from '@mui/icons-material/Redeem';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { motion, AnimatePresence } from 'framer-motion';

const getIconByCategory = (category) => {
    switch (category) {
        // 지출 카테고리
        case '식비': return <FastfoodIcon />;
        case '교통/차량': return <DirectionsBusIcon />;
        case '여가생활': return <SportsEsportsIcon />;
        case '마트/편의점': return <ShoppingBagIcon />;
        case '생활비': return <ShoppingBagIcon />;
        case '통신': return <PhoneIphoneIcon />;
        case '건강': return <LocalHospitalIcon />;
        case '교육': return <SchoolIcon />;
        case '경조사/회비': return <CardGiftcardIcon />;
        case '주거': return <HomeWorkIcon />;
        
        // 수입 카테고리
        case '월급': return <PaymentsIcon />;
        case '부수입': return <MonetizationOnIcon />;
        case '용돈': return <SavingsIcon />;
        case '상여': return <RedeemIcon />;
        case '금융소득': return <AccountBalanceIcon />;
        
        default: return <MoreHorizIcon />;
    }
};

function Favorites() {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await api.get('/api/favorites');
            setFavorites(response.data || []);
        } catch (error) {
            console.error("즐겨찾기 로드 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUseTemplate = (template) => {
        const query = new URLSearchParams({
            category: template.category,
            amount: template.amount,
            type: template.type
        }).toString();
        navigate(`/transactions/new?${query}`);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // 카드 클릭 이벤트 방지
        if (window.confirm('이 즐겨찾기를 삭제하시겠습니까?')) {
            try {
                await api.delete(`/api/favorites/${id}`);
                setFavorites(prev => prev.filter(f => f.favoriteId !== id));
            } catch (error) {
                alert('삭제 실패');
            }
        }
    };

    if (loading) return <Box sx={{ textAlign: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 3, pb: 15 }}>
            <Typography variant="h5" sx={{ color: '#451a03', fontWeight: 900, mb: 1 }}>자주 쓰는 가계부 ⭐</Typography>
            <Typography variant="body2" sx={{ color: '#92400e', mb: 4, opacity: 0.8 }}>
                반복되는 지출은 즐겨찾기로 빠르게 입력하세요!
            </Typography>

            <Grid container spacing={2}>
                <AnimatePresence>
                    {favorites.map((item) => (
                        <Grid item xs={6} key={item.favoriteId} component={motion.div} layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                        >
                            <Card 
                                onClick={() => handleUseTemplate(item)}
                                sx={{ 
                                    borderRadius: 4, 
                                    position: 'relative',
                                    border: '1px solid #fde68a',
                                    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.04)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': { 
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 20px rgba(251, 191, 36, 0.1)'
                                    }
                                }}
                            >
                                <IconButton 
                                    size="small" 
                                    onClick={(e) => handleDelete(e, item.favoriteId)}
                                    sx={{ position: 'absolute', top: 5, right: 5, color: '#fca5a5' }}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                    <Avatar sx={{ 
                                        bgcolor: '#fffbeb', color: '#fbbf24', 
                                        width: 48, height: 48, mx: 'auto', mb: 1.5,
                                        border: '1px solid #fde68a'
                                    }}>
                                        {getIconByCategory(item.category)}
                                    </Avatar>
                                    <Typography variant="subtitle2" sx={{ 
                                        fontWeight: 800, color: '#451a03',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                    }}>
                                        {item.templateName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 700 }}>
                                        {item.amount.toLocaleString()}원
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </AnimatePresence>
            </Grid>

            {favorites.length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 10, opacity: 0.5 }}>
                    <Typography variant="body1">등록된 즐겨찾기가 없어요 😢</Typography>
                    <Typography variant="caption">거래 기록 화면에서 즐겨찾기를 추가해보세요!</Typography>
                </Box>
            )}
        </Box>
    );
}

export default Favorites;
