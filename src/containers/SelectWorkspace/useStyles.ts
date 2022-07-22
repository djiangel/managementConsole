import makeStyles from '@material-ui/core/styles/makeStyles';
import { COLORS } from '../../styles/theme';

const useStyles = makeStyles(({
    primary: {
        fontFamily: 'AlphaHeadlinePro-Bold',
        fontSize: 16,
        color: '#9e9e9e'
      },
    root: {
        '&:hover': {
            '& $avatar': {
                backgroundColor: COLORS.AQUA_MARINE
            },
            '& $primary': {
                color: COLORS.AQUA_MARINE
            }
        }
    },
    avatar: {

    },
    paper: {
      marginTop: '20%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    list: {
        maxHeight: '50vh',
        overflowY: 'hidden',
        marginRight: 50,
        marginLeft: 50,
        width: '-webkit-fill-available',
        '&:hover': {
          overflowY: 'auto'
        }
    }
  }));

export default useStyles;