import { makeStyles } from '../../material/index';
import { COLORS } from '../../styles/theme';

const useStyles = makeStyles({
  rootLabel: {
    fontFamily: 'OpenSans',
    fontSize: 14,
    color: COLORS.MARINE_FADED
  },
  root: {
    flex: 1,
    '&$focused $notchedOutline': {
      borderColor: COLORS.AQUA_MARINE,
    },
  },
  underline: {
    '&:before': {
      borderBottomColor: COLORS.MARINE_FADED
    },
    '&:after': {
      borderBottomColor: COLORS.AQUA_MARINE
    }
  },
  notchedOutline: {
    borderColor: COLORS.MARINE_FADED,
  },
  focused: {},
  input: {
    fontSize: 15,
    '&::placeholder': {
      fontFamily: 'OpenSans',
      fontSize: 14,
      color: COLORS.MARINE_FADED
    }
  }
});

export default useStyles;
