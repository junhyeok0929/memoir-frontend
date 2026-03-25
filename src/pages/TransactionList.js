import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { 
    Typography, Box, CircularProgress, IconButton, Card, CardContent, 
    Grid, Avatar, LinearProgress, Popover, Button, TextField
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import moment from 'moment';
import { AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import TransactionItem from '../components/TransactionItem';

const formatDate = (date) => moment(date).format('YYYY-MM-DD');
const COLORS = ['#fbbf24', '#f87171', '#34d399', '#60a5fa', '#a78bfa', '#fb923c'];

function TransactionList({ currentDate, setCurrentDate }) {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ income: 0, expense: 0 });
    const [loading, setLoading] = useState(true);
    const [budget, setBudget] = useState(1000000); 
    const [budgetAnchorEl, setBudgetAnchorEl] = useState(null);
    const [tempBudget, setTempBudget] = useState(budget);

    const handleBudgetClick = (event) => {
        setTempBudget(budget);
        setBudgetAnchorEl(event.currentTarget);
    };

    const handleBudgetClose = () => {
        setBudgetAnchorEl(null);
    };

    const handleBudgetSubmit = () => {
        setBudget(tempBudget);
        handleBudgetClose();
    };

    const [dateAnchorEl, setDateAnchorEl] = useState(null);

    const handleDateClick = (event) => {
        setDateAnchorEl(event.currentTarget);
    };

    const handleDateClose = () => {
        setDateAnchorEl(null);
    };

    const handleMonthSelect = (month) => {
        const nextDate = moment(currentDate).month(month).toDate();
        setCurrentDate(nextDate);
        handleDateClose();
    };

    const handleYearSelect = (year) => {
        const nextDate = moment(currentDate).year(year).toDate();
        setCurrentDate(nextDate);
    };

    const openDatePopover = Boolean(dateAnchorEl);
    const id = openDatePopover ? 'date-popover' : undefined;

    const currentYear = currentDate.getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
    const months = Array.from({ length: 12 }, (_, i) => i);

    const expensePercent = Math.min(Math.round((summary.expense / budget) * 100), 100);

    const fetchMonthlyData = useCallback(async (date) => {
        setLoading(true);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        try {
            const [transactionsResponse, summaryResponse] = await Promise.all([
                api.get(`/api/transactions/monthly?year=${year}&month=${month}`),
                api.get(`/api/transactions/summary/monthly?year=${year}&month=${month}`)
            ]);
            setTransactions(transactionsResponse.data || []);
            const summaryData = summaryResponse.data || {};
            setSummary({
                income: summaryData.totalIncome || 0,
                expense: summaryData.totalExpense || 0,
            });
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMonthlyData(currentDate);
    }, [currentDate, fetchMonthlyData]);

    const handleDelete = async (id) => {
        if (window.confirm('추억을 삭제하시겠습니까?')) {
            try {
                await api.delete(`/api/transactions/${id}`);
                fetchMonthlyData(currentDate);
            } catch (error) {
                alert('삭제 실패');
            }
        }
    };

    const groupedTransactions = transactions.reduce((acc, transaction) => {
        const date = formatDate(transaction.transactionDate);
        if (!acc[date]) acc[date] = [];
        acc[date].push(transaction);
        return acc;
    }, {});

    const pieData = Object.entries(
        transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {})
    ).map(([name, value]) => ({ name, value }));

    return (
        <Box sx={{ p: 0, position: 'relative', minHeight: '100%' }}>
            <Box sx={{ p: 4, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" sx={{ color: '#451a03', fontWeight: 900 }}>추억 가계부 📒</Typography>
                    <Typography 
                        variant="subtitle2" 
                        onClick={handleDateClick}
                        sx={{ 
                            color: '#92400e', opacity: 0.8, cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: 0.5,
                            '&:hover': { color: '#fbbf24', opacity: 1 },
                            transition: 'all 0.2s'
                        }}
                    >
                        {moment(currentDate).format('YYYY. MM')} ✨
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => setCurrentDate(moment(currentDate).subtract(1, 'month').toDate())} size="small" sx={{ border: '1px solid #fde68a' }}>
                        <ChevronLeftIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => setCurrentDate(moment(currentDate).add(1, 'month').toDate())} size="small" sx={{ border: '1px solid #fde68a' }}>
                        <ChevronRightIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            <Popover
                id={id}
                open={openDatePopover}
                anchorEl={dateAnchorEl}
                onClose={handleDateClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                PaperProps={{
                    sx: { 
                        p: 2, borderRadius: 4, width: 280, 
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid #fef3c7' 
                    }
                }}
            >
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', gap: 1, borderBottom: '1px solid #fef3c7', pb: 1 }}>
                    {years.map(year => (
                        <Button 
                            key={year} 
                            size="small"
                            onClick={() => handleYearSelect(year)}
                            sx={{ 
                                minWidth: 60, fontWeight: year === currentYear ? 900 : 500,
                                color: year === currentYear ? '#fbbf24' : '#92400e',
                                bgcolor: year === currentYear ? '#fffdf5' : 'transparent'
                            }}
                        >
                            {year}
                        </Button>
                    ))}
                </Box>
                <Grid container spacing={1}>
                    {months.map(m => (
                        <Grid item xs={3} key={m}>
                            <Button
                                fullWidth
                                onClick={() => handleMonthSelect(m)}
                                sx={{ 
                                    py: 1, borderRadius: 2, fontSize: '0.8rem', fontWeight: m === currentDate.getMonth() ? 900 : 500,
                                    color: m === currentDate.getMonth() ? '#fbbf24' : '#6b7280',
                                    bgcolor: m === currentDate.getMonth() ? '#fffdf5' : 'transparent',
                                    '&:hover': { bgcolor: '#fffbeb' }
                                }}
                            >
                                {m + 1}월
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Popover>

            <Box sx={{ px: 3, mb: 4 }}>
                <Card sx={{ 
                    background: 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)', 
                    p: 1.5, 
                    border: 'none', 
                    borderRadius: 4,
                    boxShadow: '0 15px 35px rgba(251, 191, 36, 0.25)' 
                }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 4 }}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 800, opacity: 0.9, whiteSpace: 'nowrap', display: 'block', fontSize: '0.85rem' }}>나의 자산 추억</Typography>
                                {(() => {
                                    const balance = (summary?.income || 0) - (summary?.expense || 0);
                                    const balanceStr = balance.toLocaleString() + '원';
                                    const isLong = balanceStr.length > 10;
                                    return (
                                        <Typography sx={{ 
                                            fontWeight: 900, color: '#451a03', mt: 0.5, whiteSpace: 'nowrap',
                                            fontSize: { 
                                                xs: isLong ? '1.3rem' : '1.6rem', 
                                                md: isLong ? '1.7rem' : '2.1rem' 
                                            },
                                            letterSpacing: '-0.05em', lineHeight: 1.1
                                        }}>
                                            {balanceStr}
                                        </Typography>
                                    );
                                })()}
                            </Box>
                            <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 1 }}>
                                <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 800, opacity: 0.9, whiteSpace: 'nowrap', display: 'block', fontSize: '0.85rem' }}>예산 사용량</Typography>
                                <Typography sx={{ 
                                    fontWeight: 900, 
                                    color: expensePercent > 80 ? '#991b1b' : '#065f46',
                                    whiteSpace: 'nowrap',
                                    fontSize: { xs: '1.1rem', md: '1.4rem' },
                                    lineHeight: 1.1
                                }}>
                                    {expensePercent}%
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mt: 1.5, mb: 1.5 }}>
                            <LinearProgress 
                                variant="determinate" 
                                value={expensePercent} 
                                sx={{ 
                                    height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.3)',
                                    '& .MuiLinearProgress-bar': { bgcolor: expensePercent > 80 ? '#ef4444' : '#065f46', borderRadius: 4 } 
                                }} 
                            />
                        </Box>
                        <Typography 
                            variant="caption" 
                            onClick={handleBudgetClick}
                            sx={{ color: '#92400e', fontWeight: 800, cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
                        >
                            목표 {(budget || 0).toLocaleString()}원 중 {(summary?.expense || 0).toLocaleString()}원 지출
                        </Typography>

                        <Popover
                            open={Boolean(budgetAnchorEl)}
                            anchorEl={budgetAnchorEl}
                            onClose={handleBudgetClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            PaperProps={{ sx: { p: 2, borderRadius: 3, width: 220, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' } }}
                        >
                            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>월 목표 예산 설정</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                type="number"
                                value={tempBudget}
                                onChange={(e) => setTempBudget(e.target.value)}
                                InputProps={{ endAdornment: <Typography variant="caption">원</Typography> }}
                                sx={{ mb: 2 }}
                            />
                            <Button 
                                fullWidth 
                                variant="contained" 
                                onClick={handleBudgetSubmit}
                                sx={{ bgcolor: '#fbbf24', '&:hover': { bgcolor: '#f59e0b' }, fontWeight: 700 }}
                            >
                                설정하기
                            </Button>
                        </Popover>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.4)', p: 2, borderRadius: 2, flexGrow: 1, mr: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#92400e', display: 'block', mb: 0.5, fontWeight: 700 }}>수입</Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#065f46' }}>+{summary.income.toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.4)', p: 2, borderRadius: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#92400e', display: 'block', mb: 0.5, fontWeight: 700 }}>지출</Typography>
                                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#991b1b' }}>-{summary.expense.toLocaleString()}</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {pieData.length > 0 && (
                <Box sx={{ px: 4, mb: 4 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 900, color: '#451a03' }}>소비 요약</Typography>
                    <Box sx={{ height: 150, display: 'flex', alignItems: 'center', bgcolor: 'white', p: 2.5, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                        <ResponsiveContainer width="50%" height="100%">
                            <PieChart>
                                <Pie data={pieData} innerRadius={35} outerRadius={50} paddingAngle={6} dataKey="value">
                                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <Box sx={{ width: '50%', pl: 2 }}>
                            {(() => {
                                const totalPieValue = pieData.reduce((acc, cur) => acc + cur.value, 0);
                                return pieData.slice(0, 3).map((item, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: COLORS[idx], mr: 1 }} />
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#666', flexGrow: 1 }}>{item.name}</Typography>
                                        <Typography variant="caption" sx={{ fontWeight: 800 }}>
                                            {totalPieValue > 0 ? ((item.value / totalPieValue) * 100).toFixed(1) : 0}%
                                        </Typography>
                                    </Box>
                                ));
                            })()}
                        </Box>
                    </Box>
                </Box>
            )}

            <Box sx={{ px: 3, pb: 15 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, px: 1, fontWeight: 900, color: '#451a03' }}>최근 기록</Typography>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress size={24} /></Box>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {Object.entries(groupedTransactions)
                            .sort(([a], [b]) => new Date(b) - new Date(a))
                            .map(([date, items]) => (
                                <Box key={date} sx={{ mb: 3 }}>
                                    <Typography variant="caption" sx={{ color: '#d97706', fontWeight: 800, ml: 1, mb: 1, display: 'block' }}>{moment(date).format('MM. DD. dddd')}</Typography>
                                    {items.map(item => <TransactionItem key={item.transactionId} transaction={item} onDelete={handleDelete} />)}
                                </Box>
                            ))
                        }
                    </AnimatePresence>
                )}
            </Box>
        </Box>
    );
}

export default TransactionList;
