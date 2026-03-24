import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { 
    Typography, Box, CircularProgress, IconButton, Card, CardContent, 
    Grid, Avatar, LinearProgress 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import moment from 'moment';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const formatDate = (date) => moment(date).format('YYYY-MM-DD');
const COLORS = ['#fbbf24', '#f87171', '#34d399', '#60a5fa', '#a78bfa', '#fb923c'];

function TransactionItem({ transaction, onDelete }) {
    const isIncome = transaction.type === 'INCOME';
    const hasDiary = transaction.diaryContent && transaction.diaryContent.trim() !== '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            layout
        >
            <Box sx={{ mb: 2.5, px: 1 }}>
                <Card sx={{ 
                    border: '1px solid #fef3c7',
                    borderRadius: 3, // 곡률을 더 세련되게 줄임
                    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.03)',
                    '&:hover': { boxShadow: '0 8px 24px rgba(251, 191, 36, 0.08)' }
                }}>
                    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ 
                                bgcolor: isIncome ? '#ecfdf5' : '#fef2f2',
                                color: isIncome ? '#059669' : '#dc2626',
                                width: 48, height: 48,
                                borderRadius: '10px'
                            }}>
                                {isIncome ? <TrendingUpIcon /> : <TrendingDownIcon />}
                            </Avatar>
                            
                            <Box sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#451a03' }}>
                                            {transaction.category}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#92400e', opacity: 0.6 }}>
                                            {isIncome ? '수입' : '지출'}
                                        </Typography>
                                    </Box>
                                    <Typography variant="subtitle1" sx={{ 
                                        fontWeight: 900, 
                                        color: isIncome ? '#059669' : '#dc2626'
                                    }}>
                                        {isIncome ? '+' : '-'}{transaction.amount.toLocaleString()}원
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {hasDiary && (
                            <Box sx={{ 
                                mt: 2, p: 2, bgcolor: '#fffdf5', borderRadius: '10px',
                                border: '1px dashed #fde68a', position: 'relative'
                            }}>
                                {transaction.diaryTitle && (
                                    <Typography variant="caption" sx={{ fontWeight: 800, mb: 0.5, color: '#b45309', display: 'block' }}>
                                        {transaction.diaryTitle}
                                    </Typography>
                                )}
                                <Typography variant="body2" sx={{ color: '#78350f', lineHeight: 1.6, fontSize: '0.875rem' }}>
                                    {transaction.diaryContent}
                                </Typography>
                            </Box>
                        )}
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 0.5 }}>
                            <IconButton component={Link} to={`/transactions/edit/${transaction.transactionId}`} size="small" sx={{ color: '#d1d5db', '&:hover': { color: '#fbbf24' } }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => onDelete(transaction.transactionId)} size="small" sx={{ color: '#d1d5db', '&:hover': { color: '#ef4444' } }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </motion.div>
    );
}

function TransactionList() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ income: 0, expense: 0 });
    const [loading, setLoading] = useState(true);
    const [budget, setBudget] = useState(1000000); 

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
                    <Typography variant="h5" sx={{ color: '#451a03', fontWeight: 900 }}>추억 기록장 ✨</Typography>
                    <Typography variant="subtitle2" sx={{ color: '#92400e', opacity: 0.7 }}>{moment(currentDate).format('YYYY. MM')}</Typography>
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

            {/* 대시보드: 곡률을 3으로 줄이고 패딩을 늘려 답답함 해소 */}
            <Box sx={{ px: 3, mb: 4 }}>
                <Card sx={{ 
                    background: 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)', 
                    p: 1.5, // 패딩 증가
                    border: 'none', 
                    borderRadius: 4, // 곡률 감소 (더 날렵해짐)
                    boxShadow: '0 15px 35px rgba(251, 191, 36, 0.25)' 
                }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                                <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 700, opacity: 0.8 }}>나의 자산 추억</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: '#451a03', mt: 0.5 }}>{(summary.income - summary.expense).toLocaleString()}원</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 700, opacity: 0.8 }}>예산 사용량</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: expensePercent > 80 ? '#991b1b' : '#065f46' }}>{expensePercent}%</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mt: 2, mb: 1.5 }}>
                            <LinearProgress 
                                variant="determinate" 
                                value={expensePercent} 
                                sx={{ 
                                    height: 12, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.3)',
                                    '& .MuiLinearProgress-bar': { bgcolor: expensePercent > 80 ? '#ef4444' : '#065f46' } 
                                }} 
                            />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 700 }}>
                            목표 {budget.toLocaleString()}원 중 {summary.expense.toLocaleString()}원 지출
                        </Typography>

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

            {/* 소비 리포트 */}
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
                            {pieData.slice(0, 3).map((item, idx) => (
                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: COLORS[idx], mr: 1 }} />
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#666', flexGrow: 1 }}>{item.name}</Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 800 }}>{((item.value / summary.expense) * 100).toFixed(0)}%</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
            )}

            {/* 활동 내역 */}
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
