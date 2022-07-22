import createTheme from '@material-ui/core/styles/createTheme';

export const COLORS = {
  MARINE: '#022950',
  MARINE_FADED: 'rgba(2, 41, 80, 0.4)',
  AQUA_MARINE: '#3ad6cc',
  WHITE: '#ffffff',
  WHITE_FADED: 'rgba(255, 255, 255, 0.4)',
  RICE_WHITE: '#f5f5f5',
  PALE_GREY: '#f4f6f9',
  CORAL_PINK: '#e46e6e',
  SAFFRON: '#eac435'
};

export const MuiTheme = createTheme({
  palette: {
    primary: {
      main: COLORS.MARINE
    },
    secondary: {
      main: COLORS.AQUA_MARINE
    },
    error: {
      main: COLORS.CORAL_PINK
    }
  },
});
