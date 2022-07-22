import * as React from 'react';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { find } from 'lodash';
import { Paper } from '../../material/index';
import LoadingScreen from '../../components/LoadingScreen';
import FormSectionHeader from 'components/FormSectionHeader';
import { renderRaceAndEthnicity, renderRole } from '../UserList/userTableConfig';
import * as moment from 'moment';
import MaterialButton from 'components/MaterialButton';
import { ConfirmUserDeleteModal } from './ConfirmUserDeleteModal';
import ConditionViewerRoleIsAdminContainer from '../ConditionViewerRoleIsAdmin';

const styles = require('./User.module.css');

const dateFormat = 'MMM dd, yyyy';

interface Props {
	loading: boolean;
	producerUsersCount: number;
	productReviewsCount: number;
	userAttributes?: any;
	userId: number;
	workspaceId: number;
	handleDeleteUser: Function;
	t: Function;
}

export default class UserContainer extends React.Component<Props> {
	state = {
		modalVisible: false
	};
	render() {
		const {
			loading,
			producerUsersCount,
			productReviewsCount,
			userAttributes,
			userId,
			workspaceId,
			handleDeleteUser,
			t
		} = this.props;
		const { modalVisible } = this.state;

		if (loading) {
			return <LoadingScreen />;
		}

		const {
			id,
			createdAt,
			name,
			updatedAt,
			username,
			email,
			phoneNumber,
			dateOfBirth,
			gender,
			firstLanguage,
			race,
			smoke,
			role,
			producerUsers
		} = userAttributes;

		const producerUser = find(producerUsers.nodes, (producer) => producer.producerId === workspaceId);
		const onCancel = () => {
			this.setState({ modalVisible: !modalVisible });
		};
		const onDelete = () => {
			handleDeleteUser(producerUser.id);
			onCancel();
		};
		return (
			<Paper className={styles.container}>
				<ConfirmUserDeleteModal
					modalVisible={this.state.modalVisible}
					onCancel={() => onCancel()}
					onDelete={() => onDelete()}
				/>
				<div className={styles.headerContainer}>
					<h5 className={styles.userHeader}>Users</h5>
					<div style={{ display: 'flex', flexDirection: 'row' }}>
						<h3 className={styles.userTitle}>{name}</h3>
						{renderRole(role) === 'ADMIN' && <span className={styles.adminFlag}>ADMIN</span>}
						{renderRole(role) === 'SUPERADMIN' && <span className={styles.adminFlag}>SUPERADMIN</span>}
					</div>
					<span className={styles.userInfoText}>
						{t('general.dateCreated')}
						<strong>{` ${formatDate(parseISO(createdAt), dateFormat)} `}</strong>
						{t('general.dateUpdated')}
						<strong>{` ${formatDate(parseISO(updatedAt), dateFormat)}`}</strong>.
					</span>
				</div>
				<div className={styles.userTable}>
					<table>
						<tbody>
							<tr>
								<td>
									<div className={styles.infoContainer}>
										<FormSectionHeader text={t('users.username')} />
										<span className={styles.infoContent}>{username ? username : 'UNKNOWN'}</span>
									</div>
								</td>
								<td>
									<div className={styles.infoContainer}>
										<FormSectionHeader text={t('users.email')} />
										<span className={styles.infoContent}>{email ? email : 'UNKNOWN'}</span>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div className={styles.infoContainer}>
										<FormSectionHeader text={t('users.phoneNumber')} />
										<span className={styles.infoContent}>
											{phoneNumber ? phoneNumber : 'UNKNOWN'}
										</span>
									</div>
								</td>
								<td>
									<ConditionViewerRoleIsAdminContainer
										render={viewerRoleIsAdmin =>
											viewerRoleIsAdmin ? 
											<div className={styles.infoContainer}>
												<FormSectionHeader text={t('users.dateOfBirth')} />
												<span className={styles.infoContent}>
													{dateOfBirth ? moment(dateOfBirth).format('MMMM Y') : 'UNKNOWN'}
												</span>
											</div> 
										: 
											<div className={styles.infoContainer}>
												<FormSectionHeader text={t('users.dateOfBirth')} />
												<span className={styles.infoContent}>
													{'**/**/****'}
												</span>
											</div>}
									/>
								</td>
								{/* <td>
									{renderRole(role) === 'ADMIN' ?
										<div className={styles.infoContainer}>
											<FormSectionHeader text={t('users.dateOfBirth')} />
											<span className={styles.infoContent}>
												{dateOfBirth ? moment(dateOfBirth).format('MM/DD/YYYY') : 'UNKNOWN'}
											</span>
										</div>
										:
										<div className={styles.infoContainer}>
											<FormSectionHeader text={t('users.dateOfBirth')} />
											<span className={styles.infoContent}>
												{dateOfBirth ? '*' : 'UNKNOWN'}
											</span>
										</div>
									}
								</td> */}
							</tr>
							<tr>
								<td>
									<div className={styles.infoContainer}>
										<FormSectionHeader text={t('users.gender')} />
										<span className={styles.infoContent}>{gender ? gender : 'UNKNOWN'}</span>
									</div>
								</td>
								<td>
									<div className={styles.infoContainer}>
										<FormSectionHeader text={t('users.firstLanguage')} />
										<span className={styles.infoContent}>
											{firstLanguage ? firstLanguage : 'UNKNOWN'}
										</span>
									</div>
								</td>
							</tr>
							<tr>
								<td>
									<div className={styles.infoContainer}>
										<FormSectionHeader text={t('users.raceEthnicity')} />
										<span className={styles.infoContent}>
											{race ? renderRaceAndEthnicity(race) : 'UNKNOWN'}
										</span>
									</div>
								</td>
								<td>
									<div className={styles.infoContainer}>
										<FormSectionHeader text={t('users.smokingHabits')} />
										<span className={styles.infoContent}>{smoke ? smoke : 'UNKNOWN'}</span>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
					<div className={styles.countInfoContainer}>
						{/* <div className={styles.countContainer} style={{ borderRight: '1px solid rgb(128, 148, 167' }}>
							<FormSectionHeader text="Producer Counts" />
							<span className={styles.countText}>{producerUsersCount || '0'}</span>
						</div> */}
						<div className={styles.countContainer}>
							<FormSectionHeader text={t('users.totalReviews')} />
							<span className={styles.countText}>{productReviewsCount || '0'}</span>
						</div>
					</div>
				</div>
				{// shouldn't be able to delete the current logged in account and admin users
				userId !== id &&
				renderRole(role) !== 'ADMIN' && (
					<MaterialButton
						soft
						variant="outlined"
						onClick={() => this.setState({ modalVisible: !modalVisible })}
					>
						{t('users.delete')}
					</MaterialButton>
				)}
			</Paper>
		);
	}
}
