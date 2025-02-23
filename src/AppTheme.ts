import { createTheme } from '@mui/material/styles';

const theme = () => createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#047D95',
            light: '#038ba6',
            dark: '#016d82',
            contrastText: '#fff',
        },
        secondary: {
            main: '#31e0ba',
            light: '#34ebc3',
            dark: '#21a387',
            contrastText: '#fff',
        },
        background: {
            default: 'white',
            paper:  'white'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiButtonBase:{
            styleOverrides: {
                root: {
                    '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        border: 'none'
                    },
                },
            },
        }
    }
});

export default theme;
