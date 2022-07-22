import * as React from 'react';
import { Prompt } from 'react-router-dom';
import { WarningModal } from '../WarningModal/WarningModal';

interface Props {
	navigate: any;
	shouldBlockNavigation: any;
	when: any;
}
export class RouteLeavingGuard extends React.Component<Props> {
	state = {
		modalVisible: false,
		lastLocation: null,
		confirmedNavigation: false
	};

	showModal = (location) =>
		this.setState({
			modalVisible: true,
			lastLocation: location
		});

	closeModal = (callback) =>
		this.setState(
			{
				modalVisible: false
			},
			callback
		);

	handleBlockedNavigation = (nextLocation) => {
		const { confirmedNavigation } = this.state;
		const { shouldBlockNavigation } = this.props;
		if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
			this.showModal(nextLocation);
			return false;
		}

		return true;
	};
	handleConfirmNavigationClick = () =>
		this.closeModal(() => {
			const { navigate } = this.props;
			const { lastLocation } = this.state;
			if (lastLocation) {
				this.setState(
					{
						confirmedNavigation: true
					},
					() => {
						navigate(lastLocation.pathname);
					}
				);
			}
		});

	render() {
		const { when } = this.props;
		const { modalVisible, lastLocation } = this.state;
		return (
			<React.Fragment>
				<Prompt when={when} message={this.handleBlockedNavigation} />
				<WarningModal
					modalVisible={modalVisible}
					closeModal={() => this.closeModal(() => {})}
					handleConfirmNavigationClick={this.handleConfirmNavigationClick}
				/>
			</React.Fragment>
		);
	}
}
