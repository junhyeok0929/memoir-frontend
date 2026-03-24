import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // A nice green
    },
    secondary: {
      main: '#FFC107', // A nice amber
    },
    background: {
      default: '#e0e0e0', // A light gray background for neumorphism
    },
    text: {
      primary: '#333',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#e0e0e0',
          boxShadow: '9px 9px 16px #bebebe, -9px -9px 16px #ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff',
          '&:hover': {
            boxShadow: 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff',
          }
        }
      }
    }
  }
});

export default theme;
