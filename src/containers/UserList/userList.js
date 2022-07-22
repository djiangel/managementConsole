import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import * as moment from 'moment';
import Button from '../../components/Button';
import { PANELISTS, USER } from '../../constants/routePaths';
import formatPath from '../../utils/formatPath';
import FieldTextInput from '../../components/FieldTextInput';
import FormContainer from '../Form';
import { Field } from 'redux-form';
import {
  ADD_USER_PRODUCER_FORM,
  INVITE_USER_FORM
} from '../../constants/formNames';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Input,
  InputAdornment
} from '../../material/index';
import styles from './UserList.module.css';
import { renderRaceAndEthnicity, renderDate } from './userTableConfig';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { withTranslation } from 'react-i18next';
import { COLORS } from '../../styles/theme';
import MaterialButton from '../../components/MaterialButton';
import { Search as SearchIcon } from '@material-ui/icons';
import UserSearch from '../../components/UserSearch';
import ConditionViewerRoleIsAdminContainer from '../ConditionViewerRoleIsAdmin';
import ERROR_CODE from '../../constants/errorCode';

const exclamationPoint = require('../../../public/assets/exclamationPoint.png');

const pageLength = 25;

class UserInvalidModalComponent extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = { visible: true };
  }

  render() {
    const { toggleDialog, errorCode, t } = this.props;
    return this.state.visible ? (
      <div className={styles.fade}>
        <div className={styles.modal}>
          <div className={styles.topBottomMargin}>
            <img
              src={exclamationPoint}
              className={styles.exclamationImage}
              alt="exclamation-point"
            />
          </div>
          <div className={styles.topBottomMargin}>
            {errorCode === ERROR_CODE.existingUser ? (
              <p className={styles.modalText}>
                {t('users.existingUserWarning', {
                  email: this.props.email,
                  workspace: this.props.workspace
                })}
              </p>
            ) : (
              <p className={styles.modalText}>
                {t('users.newUserWarning', {
                  email: this.props.email,
                  workspace: this.props.workspace
                })}
              </p>
            )}
          </div>
          {errorCode === ERROR_CODE.newUser && (
            <div className={styles.topBottomMargin}>
              <p className={styles.modalText}>{t('users.invitationMessage')}</p>
            </div>
          )}
          <div className={styles.topBottomMargin}>
            <Button
              light
              onClick={() => {
                this.setState({ visible: false });
                toggleDialog();
              }}
            >
              {t('general.cancel')}
            </Button>
            {errorCode === ERROR_CODE.newUser && (
              <FormContainer
                formName={INVITE_USER_FORM}
                render={({ handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <Button
                      dark
                      onClick={e => {
                        this.setState({ visible: false });
                        this.props.changeEmail(this.props.email);
                        handleSubmit(e);
                        toggleDialog();
                      }}
                    >
                      Send an invite
                    </Button>
                  </form>
                )}
              />
            )}
          </div>
        </div>
      </div>
    ) : (
      <div />
    );
  }
}

const UserInvalidModal = withTranslation()(UserInvalidModalComponent);

class UserList extends Component {
  state = {
    addUser: false,
    searchString: '',
    showSearch: false,
    widthBelow600: false,
    widthBelow700: false,
    widthBelow800: false,
    widthBelow900: false,
    widthBelow1000: false,
    widthBelow1100: false,
    widthBelow1400: false
  };

  updateDimensions() {
    if (window.innerWidth < 625) {
      this.setState({
        widthBelow600: true
      });
    } else {
      this.setState({
        widthBelow600: false
      });
    }
    if (window.innerWidth < 700) {
      this.setState({
        widthBelow700: true
      });
    } else {
      this.setState({
        widthBelow700: false
      });
    }

    if (window.innerWidth < 800) {
      this.setState({
        widthBelow800: true
      });
    } else {
      this.setState({
        widthBelow800: false
      });
    }

    if (window.innerWidth < 900) {
      this.setState({
        widthBelow900: true
      });
    } else {
      this.setState({
        widthBelow900: false
      });
    }

    if (window.innerWidth < 1000) {
      this.setState({
        widthBelow1000: true
      });
    } else {
      this.setState({
        widthBelow1000: false
      });
    }

    if (window.innerWidth < 1100) {
      this.setState({
        widthBelow1100: true
      });
    } else {
      this.setState({
        widthBelow1100: false
      });
    }

    if (window.innerWidth < 1250) {
      this.setState({
        widthBelow1400: true
      });
    } else {
      this.setState({
        widthBelow1400: false
      });
    }
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchString !== this.state.searchString ||
      prevState.showSearch !== this.state.showSearch
    ) {
      if (this.state.searchString.length > 0 && this.state.showSearch)
        document.body.style.overflow = 'hidden';
      else document.body.style.overflow = 'unset';
    }
  }

  hideSearch = () => {
    this.setState({
      showSearch: false
    });
  };

  toggleAddUserDialog = () =>
    this.setState({
      addUser: !this.state.addUser
    });

  renderAddUserDialog = () => {
    const { addUser } = this.state;
    const { producerName, t } = this.props;

    return (
      <div>
        <Dialog open={addUser} onClose={this.toggleAddUserDialog}>
          <DialogTitle>{t('users.addUser')}</DialogTitle>
          <FormContainer
            formName={ADD_USER_PRODUCER_FORM}
            render={({ handleSubmit, submitting, error }) => {
              return (
                <div>
                  <DialogContent>
                    <form
                      className={styles.addUserForm}
                      onSubmit={handleSubmit}
                    >
                      {submitting && <strong>Adding user...</strong>}
                      <Field
                        component={FieldTextInput}
                        style={{ width: '65%' }}
                        key="user-list-email"
                        label={t('users.email')}
                        name="email"
                        placeholder="you@example.com"
                      />
                      {error && (
                        <UserInvalidModal
                          email={error.email}
                          changeEmail={this.props.changeEmail}
                          workspace={producerName}
                          toggleDialog={this.toggleAddUserDialog}
                          errorCode={error.code}
                        />
                      )}
                    </form>
                  </DialogContent>
                  {!error && (
                    <DialogActions>
                      <MaterialButton
                        color="secondary"
                        type="submit"
                        onClick={e => handleSubmit(e)}
                      >
                        {t('users.addUser')}
                      </MaterialButton>
                      <MaterialButton
                        color="primary"
                        onClick={this.toggleAddUserDialog}
                      >
                        {t('general.cancel')}
                      </MaterialButton>
                    </DialogActions>
                  )}
                </div>
              );
            }}
          />
        </Dialog>
      </div>
    );
  };

  render() {
    const { userList, t } = this.props;
    const { searchString } = this.state;

    const columns = [
      {
        dataField: 'id',
        text: 'User ID',
        sort: true,
        hidden: true
      },
      {
        dataField: 'username',
        sort: true,
        text: t('users.username')
      },
      {
        dataField: 'email',
        text: t('users.email'),
        sort: true,
        headerStyle: { width: '25%' },
        hidden: this.state.widthBelow600
      },
      {
        dataField: 'phoneNumber',
        text: t('users.phoneNumber'),
        sort: true,
        hidden: this.state.widthBelow700
      },
      // {
      //   dataField: 'dateOfBirth',
      //   text: t('users.dateOfBirth')
      // },
      {
        dataField: 'firstLanguage',
        text: t('users.firstLanguage'),
        hidden: this.state.widthBelow1100
      },
      {
        dataField: 'raceEthnicity',
        text: t('users.raceEthnicity'),
        hidden: this.state.widthBelow1400
      },
      {
        dataField: 'totalReviews',
        text: t('users.totalReviews'),
        sort: true,
        hidden: this.state.widthBelow900
      },
      {
        dataField: 'lastActive',
        text: t('users.lastActive'),
        sort: true,
        formatter: cell => (cell ? moment(cell).format('LL') : 'N.A'),
        hidden: this.state.widthBelow900
      }
    ];

    const data = get(userList, 'producer.producerUsers.nodes', []).map(
      ({ id, user }) => ({
        id: id,
        username: (
          <Link key={id} to={formatPath(USER, { username: user.username })}>
            {user.username}
          </Link>
        ),
        email: user.email,
        phoneNumber: user.phoneNumber,
        dateOfBirth: renderDate(user.dateOfBirth),
        firstLanguage: user.firstLanguage,
        raceEthnicity: renderRaceAndEthnicity(user.race),
        totalReviews: get(user, 'productReviews.totalCount'),
        lastActive: user.lastActive
      })
    );

    return (
      <Paper className={styles.container}>
        <div className={styles.headerContainer}>
          <div className={styles.headerTextContainer}>
            <h5 className={styles.userHeader}>{t('users.users')}</h5>
            <h3 className={styles.userTitle}>{t('users.list')}</h3>
          </div>
          <Input
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
            onChange={event =>
              this.setState({
                ...this.state,
                searchString: event.target.value,
                showSearch: true
              })
            }
            placeholder={t('general.search')}
          />
          <ConditionViewerRoleIsAdminContainer
            render={(viewerRoleIsAdmin, viewerRoleIsSuperadmin) =>
              viewerRoleIsAdmin || viewerRoleIsSuperadmin ? (
                <div>
                  <MaterialButton
                    variant="outlined"
                    soft
                    teal
                    onClick={this.toggleAddUserDialog}
                  >
                    {t('users.addUser')}
                  </MaterialButton>
                  <Link to={PANELISTS}>
                    <MaterialButton variant="outlined" soft teal>
                      {t('users.panelists')}
                    </MaterialButton>
                  </Link>
                </div>
              ) : (
                <div />
              )
            }
          />
        </div>
        {this.state.showSearch &&
          searchString.length > 0 && (
            <UserSearch
              query={searchString}
              hideSearch={this.hideSearch}
              first={10}
            />
          )}
        <div>
          <BootstrapTable
            keyField="id"
            bordered={false}
            columns={columns}
            data={data}
            rowStyle={(_, index) => ({
              backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
            })}
            rowClasses={styles.tableRow}
            headerClasses={styles.tableHeader}
            pagination={paginationFactory({
              sizePerPage: pageLength
            })}
            bootstrap4
          />
        </div>
        {this.renderAddUserDialog()}
      </Paper>
    );
  }
}

export default withTranslation()(UserList);
