import { Colors } from './colors';

export const Theme = {
  colors: Colors,

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    pill: 999,
  },

  typography: {
    title: {
      fontSize: 32,
      fontWeight: '700' as const,
      color: Colors.text,
    },

    heading: {
      fontSize: 24,
      fontWeight: '600' as const,
      color: Colors.text,
    },

    body: {
      fontSize: 16,
      color: Colors.text,
    },

    caption: {
      fontSize: 14,
      color: Colors.textSecondary,
    },
  },

  button: {
    primary: {
      backgroundColor: Colors.primary,
      paddingVertical: 14,
      borderRadius: 16,
    },

    primaryText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: '600' as const,
    },
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};