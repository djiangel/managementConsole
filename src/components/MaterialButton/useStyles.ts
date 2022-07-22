import { makeStyles } from '../../material/index';
import { COLORS } from '../../styles/theme';

const useStyles = makeStyles({
  root: {
    borderRadius: 0,
    boxShadow: '0 0',
    minHeight: 44,
    textTransform: 'none'
  },
  softRoot: {
    borderRadius: 5,
    backgroundColor: 'white',
    boxShadow: '0 0',
    minHeight: 44,
    textTransform: 'none',
    borderColor: '#e4e3e3'
  },
  softTeal: {
    borderRadius: 5,
    backgroundColor: '#3ad6cc',
    boxShadow: '0 0',
    minHeight: 44,
    textTransform: 'none',
    borderColor: '#e4e3e3'
  },
  label: {
    fontFamily: 'OpenSans',
    color: COLORS.MARINE,
    fontWeight: 'bold',
    fontSize: 12
  },
  small: {
    minHeight: 15,
  },
  outlinedSecondary: {
    backgroundColor: 'var(--coral-pink)'
  }
});

export default useStyles;
