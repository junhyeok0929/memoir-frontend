import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api';
import TransactionItem from '../components/TransactionItem';
import { AnimatePresence } from 'framer-motion';

function Search() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setSearchResults([]);
                return;
            }
            
            setLoading(true);
            try {
                const response = await api.get(`/api/transactions/search`, {
                    params: { query }
                }); 
                setSearchResults(response.data || []);
            } catch (error) {
                console.error("검색 실패:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchResults();
        }, 500); // 500ms 디바운스

        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleDelete = async (id) => {
        if (window.confirm('추억을 삭제하시겠습니까?')) {
            try {
                await api.delete(`/api/transactions/${id}`);
                setSearchResults(prev => prev.filter(t => t.transactionId !== id));
            } catch (error) {
                alert('삭제 실패');
            }
        }
    };

    return (
        <Box sx={{ p: 3, pb: 15 }}>
            <Typography variant="h5" sx={{ color: '#451a03', fontWeight: 900, mb: 3 }}>추억 검색 🔍</Typography>
            
            <TextField
                fullWidth
                placeholder="어떤 추억을 찾으시나요?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                variant="outlined"
                sx={{ 
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 4,
                        bgcolor: 'white',
                        '& fieldset': { borderColor: '#fde68a' },
                        '&:hover fieldset': { borderColor: '#fbbf24' },
                    }
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: '#fbbf24' }} />
                        </InputAdornment>
                    ),
                }}
            />

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress color="primary" /></Box>
            ) : (
                <Box>
                    {query && (
                        <Typography variant="caption" sx={{ color: '#92400e', mb: 2, display: 'block', fontWeight: 700 }}>
                            {searchResults.length}개의 추억을 찾았습니다
                        </Typography>
                    )}
                    
                    <AnimatePresence mode="popLayout">
                        {searchResults.map(item => (
                            <TransactionItem key={item.transactionId} transaction={item} onDelete={handleDelete} />
                        ))}
                    </AnimatePresence>

                    {!loading && query && searchResults.length === 0 && (
                        <Box sx={{ textAlign: 'center', mt: 10, opacity: 0.5 }}>
                            <Typography variant="body1">검색 결과가 없어요 😢</Typography>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default Search;
