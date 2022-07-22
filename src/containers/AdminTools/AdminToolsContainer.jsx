import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import styles from './AdminToolsContainer.module.css';
import AdminToolItem from '../../components/AdminToolItem';
import UserCreate from '../UserCreate';
import ChangePassword from '../ChangePassword';
import AddUserToWorkspace from '../AddUserToWorkspace';
import GroupWorkspace from '../GroupWorkspace';
import MergeAccount from '../MergeAccount';
import UserWorkspaceList from '../UserWorkspaceList';
import AllWorkspaceList from '../AllWorkspaceList';
import CreateWorkspace from '../CreateWorkspace';
import HeavyUserTag from '../HeavyUserTag';
import HeavyUser from '../HeavyUser';
import { withTranslation } from 'react-i18next';
import MaterialButton from '../../components/MaterialButton';

import { handleGoogleDownload } from '../PanelEdit/handleEditPanel';
import { handleTriggerReport } from '../PanelEdit/handleEditPanel';
import { handleOptimizationReport } from '../PanelEdit/handleEditPanel';
import { Link } from 'react-router-dom';
import { PRODUCT_FILTER, USERS_DEMOGRAPHIC } from '../../constants/routePaths';
import { GROUP_WORKSPACES } from '../../constants/routePaths';

class AdminToolsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myImage: null,
      reportName: null
    };
  }

  downloadPDFClicked = () => {
    var putObjectPromise = handleGoogleDownload('testPDF.pdf');
    const _this = this;

    putObjectPromise
      .then(function(result) {
        _this.setState({
          myImage: 'data:application/pdf;base64,' + result.data.pdfDownloadQuery
        });
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  optiButtonClicked = () => {
    const optiRequestPayload = {
      resource_name: 'reporting-generic-t3-optimization',
      report_type: 'tune_taste_tune',
      project_name: 'p_name',
      client_name: 'c_name',
      demographic_name: 'd_name',
      countries: 'brazil',
      products_to_opt: 'Peanut Butter RX Nut Butter',
      constraint_levels: 'High',
      new_reference_flavors_allowed: 'FALSE',
      is_opt_test_mode: 'T',
      productIds: [1000],
      reportId: 1,
      ages: 'ages'
    };

    // var putObjectPromise = handleOptimizationReport(optiRequestPayload);
    handleOptimizationReport(optiRequestPayload);
    // const _this = this;

    // putObjectPromise
    //   .then(function(result) {
    //     _this.setState({
    //       reportName: result.data.optimizationRequest.metadata.name
    //     });
    //   })
    //   .catch(function(err) {
    //     console.log(err);
    //   });
  };

  reportButtonClicked = () => {
    const conchRequestPayload = {
      resource_name: 'reporting-generic-engineering',
      report_type: 'market_survey',
      project_name_p: 'Bread Competitive Set Postman',
      client_name_p: 'AFS',
      demographic_name_p: 'Canada Millennials',
      countries_p: 'c(\\\\\\"canada\\\\\\")',
      competitive_set_products_p:
        'c(\\\\\\"Arnold 100% Whole Wheat Bread\\\\\\")',
      competitive_set_folders_p: 'c(\\\\\\"bread\\\\\\")',
      reportId: 1
    };

    var putObjectPromise = handleTriggerReport(conchRequestPayload);
    const _this = this;

    putObjectPromise
      .then(function(result) {
        _this.setState({
          reportName: result.data.conchRequest.metadata.name
        });
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  render() {
    const { t } = this.props;

    return (
      <div>
        <Paper className={styles.container}>
          <h3 className={styles.header}>{t('navigation.adminTools')}</h3>
          <br />

          <MaterialButton
            variant="outlined"
            onClick={() => this.downloadPDFClicked()}
            soft
            teal
          >
            Test Download
          </MaterialButton>

          <MaterialButton
            variant="outlined"
            onClick={() => this.reportButtonClicked()}
            soft
            teal
          >
            Market Survey Report
          </MaterialButton>

          <MaterialButton
            variant="outlined"
            onClick={() => this.optiButtonClicked()}
            soft
            teal
          >
            Optimization Report
          </MaterialButton>

          <Link to={{ pathname: PRODUCT_FILTER }}>
            <MaterialButton variant="outlined" soft teal>
              Tag Product Filter
            </MaterialButton>
          </Link>

          <Link to={{ pathname: GROUP_WORKSPACES }}>
            <MaterialButton variant="outlined" soft teal>
              GROUP WORKSPACES
            </MaterialButton>
          </Link>

          <Link to={{ pathname: USERS_DEMOGRAPHIC }}>
            <MaterialButton variant="outlined" soft teal>
              Users Demographic
            </MaterialButton>
          </Link>

          {this.state.myImage && (
            <a
              download="GG_Report_Download"
              href={this.state.myImage}
              title="Download PDF"
            >
              Download Me!
            </a>
          )}

          {this.state.reportName && <p>{this.state.reportName}</p>}

          <br />
          <br />

          <AdminToolItem
            title={t('users.createUser')}
            component={<UserCreate />}
          />
          <AdminToolItem
            title={t('users.changePassword')}
            component={<ChangePassword />}
          />
          <AdminToolItem
            title={t('admin.addUserWorkspace')}
            component={<AddUserToWorkspace />}
          />
          <AdminToolItem
            title={t('admin.mergeAccount')}
            component={<MergeAccount />}
          />
          <AdminToolItem
            title={t('admin.userWorkspaces')}
            component={<UserWorkspaceList />}
          />
          <AdminToolItem
            title={t('admin.allWorkspaceList')}
            component={<AllWorkspaceList />}
          />
          <AdminToolItem
            title={t('admin.createWorkspace')}
            component={<CreateWorkspace />}
          />
          <AdminToolItem
            title={t('admin.heavyUserInfo')}
            component={<HeavyUser />}
          />
          <AdminToolItem
            title={t('admin.tagHeavyUser')}
            component={<HeavyUserTag />}
          />
        </Paper>
      </div>
    );
  }
}

export default withTranslation()(AdminToolsContainer);
