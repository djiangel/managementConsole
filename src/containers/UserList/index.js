import { connect } from 'react-redux';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import selectWorkspaceProducerName from '../../selectors/workspaceProducerName';
import UserList from './userList';
import { graphql } from 'react-apollo';
import CreateProducerUser from '../../graphql/mutations/CreateProducerUser';
import { compose } from 'recompose';
import { registerField, change } from 'redux-form';
import { INVITE_USER_FORM } from '../../constants/formNames';
import UserListQuery from '../../graphql/queries/UserList';

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state),
  producerName: selectWorkspaceProducerName(state)
});

const mapDispatchToProps = dispatch => {
  dispatch(registerField(INVITE_USER_FORM, 'email', 'Field'));
  return {
    changeEmail: e => dispatch(change(INVITE_USER_FORM, 'email', e))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(CreateProducerUser, {}),
  graphql(UserListQuery, {
    options: props => ({
      variables: {
        producerId: props.producerId
      }
    }),
    name: 'userList'
  })
)(UserList);
