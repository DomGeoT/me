import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5733',
    },
    secondary: {
      main: '#E0C2FF',
      light: '#F5EBFF',
      contrastText: '#47008F',
    },
    background: {
      paper: "#fAfAfA",
      default: "white"
    }
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === 'info' && {
            backgroundColor: '#60a5fa',
          }),
        }),
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            backgroundColor: 'theme.pallete.primary.main',
            color: 'white',
            "& > *": {
              color: 'white',
            }
          },
        },
      ],
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '200px',
          paddingX: '15px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#FF5733',
          color: 'white',
          "& > *": {
            color: 'white'
          }
        },
      },
    },
  },
});

export default theme;
