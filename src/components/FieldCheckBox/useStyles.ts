import { makeStyles } from '../../material/index';
import { COLORS } from '../../styles/theme';

const useStyles = makeStyles({
  root: {
    fontFamily: 'AlphaHeadlinePro-Bold',
    color: COLORS.MARINE,
    fontSize: 14
  },
  label: {
    fontFamily: 'OpenSans',
    color: COLORS.MARINE,
    fontSize: 14,
    marginBottom: 0
  },
  helperText: {
    fontFamily: 'OpenSans',
    color: COLORS.MARINE_FADED,
    fontSize: 12
  }
});

export default useStyles;