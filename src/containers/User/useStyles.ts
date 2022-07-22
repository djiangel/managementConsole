import { makeStyles } from '../../material/index';
import { COLORS } from '../../styles/theme';

const useStyles = makeStyles({
	modalContainer: {
		backgroundColor: '#FFF',
		width: '40%',
		height: '60%',
		margin: 'auto'
	},
	iconWrapper: {
		textAlign: 'center',
		marginBottom: 20,
		marginTop: 100,
		paddingTop: 35
	},
	icon: {
		margin: 'auto',
		height: 136,
		width: 136
	},
	desc: {
		fontFamily: 'AlphaHeadlinePro-Bold',
		fontSize: 18,
		color: COLORS.MARINE,
		textAlign: 'center'
	},
	actionWrapper: {
		display: 'flex',
		textAlign: 'center',
		justifyContent: 'center'
	},
	buttonStyle: {
		margin: 20
	},
	deleteUserButton: {
		backgroundColor: COLORS.AQUA_MARINE,
		color: COLORS.MARINE,
		fontFamily: 'OpenSans-Bold'
	}
});

export default useStyles;
