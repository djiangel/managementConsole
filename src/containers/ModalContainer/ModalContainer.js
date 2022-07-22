import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import modalConfirmYes from '../../actions/modal/modalConfirmYes';
import modalConfirmNo from '../../actions/modal/modalConfirmNo';
import Modal from '../../components/Modal';

type Props = {
  onConfirm: () => any,
  onCancel: () => any,
  message: string,
  title: string,
  open: boolean
};

class ModalContainer extends Component {
  props: Props;

  render() {
    const { onConfirm, onCancel, message, title, open, t } = this.props;
    // console.log(this.props);

    return (
      <Modal
        modalStyle
        styledTitle={<h5>{title}</h5>}
        open={open}
        onClose={onCancel}
        primaryAction={{
          content: 'Yes',
          action: onConfirm
        }}
      >
        <p>{message}</p>
      </Modal>
    );
  }
}

const actionCreators = {
  onConfirm: modalConfirmYes,
  onCancel: modalConfirmNo
};

const mapStateToProps = state => {
  const props = {
    open: state.modal.open,
    message: state.modal.message,
    title: state.modal.title
  };
  return props;
};

export default compose(
  connect(
    mapStateToProps,
    actionCreators
  ),
  withTranslation()
)(ModalContainer);
