import { createTheme, ThemeOptions } from '@mui/material/styles';

// Educational Color Palette
const colors = {
  background: {
    cream: '#F5F1EB',
    dark: '#1a1a1a',
    paper: '#FFFFFF',
    paperDark: '#2a2a2a',
  },
  primary: {
    main: '#1E88E5',
    light: '#6ab7ff',
    dark: '#005cb2',
    contrastText: '#ffffff',
  },
  success: {
    main: '#43A047',
    light: '#76d275',
    dark: '#00701a',
    contrastText: '#ffffff',
  },
  accent: {
    cyber: '#39FF14',
    gold: '#FFD700',
    flame: '#FF6B35',
  },
  learning: {
    focus: '#4A90E2',
    progress: '#10B981',
    achievement: '#FFD700',
    streak: '#FF6B35',
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

// Typography configuration
const typography = {
  fontFamily: '"Inter Variable", "Inter", system-ui, -apple-system, sans-serif',
  h1: {
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2.25rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '1.875rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.6,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.5,
    textTransform: 'none' as const,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1.5,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
  },
};

// Shape configuration
const shape = {
  borderRadius: 12,
};

// Shadows for depth
const shadows = [
  'none',
  '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 4px 6px -1px rgba(30, 136, 229, 0.1), 0 2px 4px -1px rgba(30, 136, 229, 0.06)',
  '0 10px 25px -5px rgba(255, 215, 0, 0.3), 0 4px 10px -5px rgba(255, 215, 0, 0.2)',
  '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.04)',
  '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
] as any;

// Light theme configuration
const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: {
      main: colors.learning.focus,
      light: colors.learning.progress,
      dark: colors.learning.streak,
      contrastText: '#ffffff',
    },
    success: colors.success,
    background: {
      default: colors.background.cream,
      paper: colors.background.paper,
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    grey: colors.grey,
  },
  typography,
  shape,
  shadows,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: shadows[2],
          '&:hover': {
            boxShadow: shadows[4],
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius * 1.5,
          boxShadow: shadows[2],
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: shadows[4],
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: shape.borderRadius,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius / 2,
          fontWeight: 500,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: shape.borderRadius,
          height: 8,
        },
        bar: {
          borderRadius: shape.borderRadius,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: colors.learning.progress,
        },
      },
    },
  },
};

// Dark theme configuration
const darkThemeOptions: ThemeOptions = {
  ...lightThemeOptions,
  palette: {
    mode: 'dark',
    primary: colors.primary,
    secondary: {
      main: colors.learning.focus,
      light: colors.learning.progress,
      dark: colors.learning.streak,
      contrastText: '#ffffff',
    },
    success: colors.success,
    background: {
      default: colors.background.dark,
      paper: colors.background.paperDark,
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.38)',
    },
    grey: {
      50: '#212121',
      100: '#424242',
      200: '#616161',
      300: '#757575',
      400: '#9e9e9e',
      500: '#bdbdbd',
      600: '#e0e0e0',
      700: '#eeeeee',
      800: '#f5f5f5',
      900: '#fafafa',
    },
  },
};

// Create themes
export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);

// Export colors for use in other components
export { colors };

// Custom theme extensions
declare module '@mui/material/styles' {
  interface Theme {
    learning?: {
      focus: string;
      progress: string;
      achievement: string;
      streak: string;
    };
    accent?: {
      cyber: string;
      gold: string;
      flame: string;
    };
  }
  interface ThemeOptions {
    learning?: {
      focus?: string;
      progress?: string;
      achievement?: string;
      streak?: string;
    };
    accent?: {
      cyber?: string;
      gold?: string;
      flame?: string;
    };
  }
}

// Add custom properties to themes
lightTheme.learning = colors.learning;
lightTheme.accent = colors.accent;
darkTheme.learning = colors.learning;
darkTheme.accent = colors.accent;