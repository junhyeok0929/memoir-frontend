import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';
import { Typography, Box, CircularProgress, IconButton, Card, CardContent, CardActions, Fab, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { green, red } from '@mui/material/colors';
import BookIcon from '@mui/icons-material/Book';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import moment from 'moment';

// Helper function to format date to YYYY-MM-DD
const formatDate = (date) => moment(date).format('YYYY-MM-DD');

function TransactionGroup({ date, transactions, onDelete }) {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ textAlign: 'left', mb: 1, color: 'grey.600' }}>
                {moment(date).format('MM월 DD일')}
            </Typography>
            {transactions.map((transaction) => (
                <Card sx={{ mb: 1 }} key={transaction.transactionId}>
                    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1">{transaction.category}</Typography>
                            <Typography variant="body1" color={transaction.type === 'INCOME' ? green[700] : red[700]}>
                                {transaction.type === 'INCOME' ? '+' : '-'}{transaction.amount.toLocaleString()}원
                            </Typography>
                        </Box>
                        {transaction.memo && (
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 1 }}>
                                <BookIcon fontSize="small" color="action" />
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {transaction.memo}
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', pt: 0, p: 0.5 }}>
                        <IconButton component={Link} to={`/transactions/edit/${transaction.transactionId}`} size="small">
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => onDelete(transaction.transactionId)} size="small">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </CardActions>
                </Card>
            ))}
        </Box>
    );
}

function TransactionList() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ income: 0, expense: 0 });
    const [loading, setLoading] = useState(true);
    const location = useLocation();

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
                income: summaryData.income || 0,
                expense: summaryData.expense || 0,
            });
        } catch (error) {
            console.error("월간 데이터 조회 실패:", error);
            setSummary({ income: 0, expense: 0 });
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch and fetch on month change
    useEffect(() => {
        fetchMonthlyData(currentDate);
    }, [currentDate, fetchMonthlyData]);

    // Refetch when navigated back from form
    useEffect(() => {
        if (location.state?.refresh) {
            fetchMonthlyData(currentDate);
            // Clean up state to prevent re-fetching on other re-renders
            window.history.replaceState({}, '');
        }
    }, [location.state, fetchMonthlyData, currentDate]);


    const handleDelete = async (id) => {
        if (window.confirm('정말로 이 거래 내역을 삭제하시겠습니까?')) {
            try {
                await api.delete(`/api/transactions/${id}`);
                alert('거래 내역이 삭제되었습니다.');
                fetchMonthlyData(currentDate);
            } catch (error) {
                console.error('거래 내역 삭제 실패:', error);
                alert('거래 내역 삭제에 실패했습니다.');
            }
        }
    };

    const groupedTransactions = transactions.reduce((acc, transaction) => {
        const date = formatDate(transaction.transactionDate);
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
    }, {});

    const changeMonth = (amount) => {
        setCurrentDate(prevDate => moment(prevDate).add(amount, 'months').toDate());
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', p: 2 }}>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <IconButton onClick={() => changeMonth(-1)} size="small"><ArrowBackIosNewIcon fontSize="inherit" /></IconButton>
                    <Typography variant="h6">{moment(currentDate).format('YYYY년 MM월')}</Typography>
                    <IconButton onClick={() => changeMonth(1)} size="small"><ArrowForwardIosIcon fontSize="inherit" /></IconButton>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color={green[700]}>수입: {summary.income.toLocaleString()}원</Typography>
                    <Typography variant="body2" color={red[700]}>지출: {summary.expense.toLocaleString()}원</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>합계: {(summary.income - summary.expense).toLocaleString()}원</Typography>
                </Box>
            </Paper>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
                ) : Object.keys(groupedTransactions).length === 0 ? (
                    <Typography sx={{ textAlign: 'center', mt: 4 }}>이번 달 내역이 없습니다.</Typography>
                ) : (
                    Object.entries(groupedTransactions)
                        .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                        .map(([date, transactions]) => (
                            <TransactionGroup key={date} date={date} transactions={transactions} onDelete={handleDelete} />
                        ))
                )}
            </Box>

            <Fab
                color="primary"
                aria-label="add"
                component={Link}
                to={`/transactions/new?date=${formatDate(new Date())}`}
                sx={{
                    position: 'absolute',
                    bottom: 32,
                    right: 32,
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
}

export default TransactionList;
