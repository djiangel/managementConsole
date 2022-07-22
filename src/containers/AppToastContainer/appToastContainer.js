import React, { Component } from 'react';
import Toast from '../../components/Toast';
import { StyledContainerDiv } from './StyledComponents';

type Props = {
  onRequestRemoveToast: (toastKey: string) => any,
  toasts: Object[]
};

export default class AppToastContainer extends Component {
  props: Props;

  renderToast = toast => {
    const { onRequestRemoveToast } = this.props;

    return (
      <Toast
        {...toast}
        key={toast.toastKey}
        onRequestClose={onRequestRemoveToast}
      />
    );
  };

  render() {
    const { toasts } = this.props;

    return (
      <StyledContainerDiv>{toasts.map(this.renderToast)}</StyledContainerDiv>
    );
  }
}
