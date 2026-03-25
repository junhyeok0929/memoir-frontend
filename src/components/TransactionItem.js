import React from 'react';
import { Typography, Box, IconButton, Card, CardContent, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
                    borderRadius: 3,
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
                                <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'right', color: '#92400e', opacity: 0.6 }}>
                                    {transaction.transactionDate}
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

export default TransactionItem;
