import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

const SeasonalBackground = ({ season }) => {
  // 계절별 아이콘 구성
  const icons = useMemo(() => {
    switch (season) {
      case 'spring': return ['🌸', '🌸', '✨', '🍃'];
      case 'summer': return ['🌊', '🏖️', '☀️', '🍹'];
      case 'autumn': return ['🍁', '🍂', '🌰', '🌾'];
      case 'winter': return ['❄️', '☃️', '🌨️', '🧤'];
      default: return ['✨'];
    }
  }, [season]);

  // 무작위 위치 및 애니메이션 설정 (8개 요소 생성)
  const particles = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      icon: icons[i % icons.length],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 5,
    }));
  }, [icons]);

  return (
    <Box sx={{ 
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
      pointerEvents: 'none', zIndex: 0, overflow: 'hidden', opacity: 0.4
    }}>
      {particles.map((p) => (
        <motion.div
          key={`${season}-${p.id}`}
          initial={{ y: -50, opacity: 0, x: 0, rotate: 0 }}
          animate={{ 
            y: [null, 900], 
            opacity: [0, 1, 1, 0],
            x: [0, Math.random() * 100 - 50, 0],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            delay: p.delay,
            ease: "linear"
          }}
          style={{ 
            position: 'absolute', 
            left: p.left, 
            fontSize: '1.5rem',
            userSelect: 'none'
          }}
        >
          {p.icon}
        </motion.div>
      ))}
    </Box>
  );
};

export default SeasonalBackground;
