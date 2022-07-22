import { makeStyles } from '../../../material/index';
import { COLORS } from '../../../styles/theme';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    background: COLORS.RICE_WHITE,
    marginTop: 10,
    borderRadius: 0,
    boxShadow: '0 0'
  },
  cardTitle: {
    fontFamily: 'AlphaHeadlinePro-Bold',
    fontSize: 16,
    color: COLORS.AQUA_MARINE
  },
  cardSubheader: {
    fontSize: 12,
    color: COLORS.MARINE_FADED
  }
});

export default useStyles;
