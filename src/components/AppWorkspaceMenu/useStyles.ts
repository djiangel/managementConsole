import makeStyles from '@material-ui/core/styles/makeStyles';
import { COLORS } from '../../styles/theme';

const useStyles = makeStyles({
  primary: {
    fontFamily: 'AlphaHeadlinePro-Bold',
    fontSize: 16,
    color: '#9e9e9e',
    '&:hover': {
      color: COLORS.AQUA_MARINE
    }
  }
});

export default useStyles;
