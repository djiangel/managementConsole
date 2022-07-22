import { makeStyles } from '../../../material/index';
import { COLORS } from '../../../styles/theme';

const useStyles = makeStyles({
  root: {
    marginLeft: '2em',
  },
  label: {
    fontFamily: 'OpenSans',
    color: COLORS.MARINE,
    fontSize: 12,
    marginBottom: 0
  },
  headerLabel: {
    fontFamily: 'OpenSans',
    color: COLORS.MARINE,
    fontSize: 14,
    marginBottom: 0
  },
});

export default useStyles;