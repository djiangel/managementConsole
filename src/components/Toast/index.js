import React, { Component } from 'react';
import { MdClose as CloseIcon } from 'react-icons/lib/md';
import { StyledContainerDiv } from './StyledComponents';

type Props = {
  children: ?React$Element | React$Element[],
  durationMilliseconds: ?number,
  message: ?string,
  onRequestClose: (toastKey: string) => any,
  title: string,
  toastKey: string
};

export default class Toast extends Component {
  componentDidMount() {
    const { durationMilliseconds } = this.props;

    if (durationMilliseconds) {
      setTimeout(this.handleRequestClose, durationMilliseconds);
    }
  }

  props: Props;

  handleRequestClose = () => {
    const { onRequestClose, toastKey } = this.props;

    return onRequestClose(toastKey);
  };

  render() {
    const { children, message, title, toastKey } = this.props;

    return (
      <StyledContainerDiv key={toastKey}>
        <div className="header">
          <div className="title">{title}</div>
          <CloseIcon
            className="closeButton"
            onClick={this.handleRequestClose}
            size={24}
          />
        </div>
        <div className="contents">{message || children}</div>
      </StyledContainerDiv>
    );
  }
}
