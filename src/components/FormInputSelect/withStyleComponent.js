import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { COLORS } from '../../styles/theme';

export const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto'
  },
  underline: {
    '&:before': {
      borderBottomColor: COLORS.MARINE_FADED
    },
    '&:after': {
      borderBottomColor: COLORS.AQUA_MARINE
    }
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
    borderRadius: 0,
    backgroundColor: 'white'
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  chipOut: {
    backgroundColor: COLORS.CORAL_PINK
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2)
  },
  singleValue: {
    fontSize: 14
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    bottom: 6,
    fontSize: 14,
    fontFamily: 'OpenSans',
    color: COLORS.MARINE_FADED
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing(2)
  }
});
