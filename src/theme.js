import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fbbf24', // 상큼한 개나리색 (Butter Yellow)
      light: '#fde68a',
      dark: '#d97706',
    },
    secondary: {
      main: '#fda4af', // 부드러운 피치 핑크
    },
    background: {
      default: '#fffdf5', // 아주 연한 크림색
      paper: '#ffffff',
    },
    text: {
      primary: '#451a03', // 따뜻한 브라운 블랙 (노란색과 조화)
      secondary: '#92400e',
    },
  },
  typography: {
    fontFamily: [
      'Pretendard', 
      'sans-serif'
    ].join(','),
    h4: { fontWeight: 900, letterSpacing: '-0.02em' },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 700 },
  },
  shape: {
    borderRadius: 16, // 너무 동글거리지 않게 세련된 곡률 적용
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontWeight: 700,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 8px 24px rgba(251, 191, 36, 0.05)',
          border: '1px solid rgba(251, 191, 36, 0.1)',
        },
      },
    },
  },
});

export default theme;
