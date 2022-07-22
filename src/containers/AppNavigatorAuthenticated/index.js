import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
  ADMIN,
  ADMIN_DATA_EXPLORER,
  AUTHENTICATION,
  BATCHES,
  BATCH,
  BATCH_PRODUCT_REVIEWS,
  DASHBOARD,
  HOME,
  PANELS,
  PANELS_EXPIRED,
  PANEL,
  PANEL_CREATE,
  PANEL_EDIT,
  PANEL_PRODUCT_REVIEWS,
  PANEL_SEARCH,
  PRODUCTS,
  PRODUCT_CREATE,
  PRODUCT,
  PRODUCT_PRODUCT_REVIEWS,
  PRODUCT_REVIEWS,
  PRODUCT_REVIEW,
  USERS,
  USER,
  USER_PRODUCT_REVIEWS,
  REPORTS,
  REPORT,
  REQUEST_REPORT,
  CREATE_REVIEW,
  MANAGE_DEVICES,
  ADD_DEVICES,
  LANGUAGES,
  SELECT_WORKSPACE,
  CREATE_USER,
  EDIT_REVIEW,
  REPORTS_QA,
  REPORT_DASHBOARD,
  NOTIFICATION,
  DATA_QUALITY_DASHBOARD,
  PRODUCT_FILTER,
  GROUP_WORKSPACES,
  ADD_DEMOGRAPHIC_TARGET,
  DEMOGRAPHIC_TARGETS,
  DEMOGRAPHIC_TARGET,
  APP_ROOT,
  PANELISTS,
  USERS_DEMOGRAPHIC,
  CUSTOM_LEXICON
} from '../../constants/routePaths';
import AppHeaderContainer from '../AppHeader';
import ConditionViewerRoleIsAdminContainer from '../ConditionViewerRoleIsAdmin';
import UserRouteContainer from '../UserRoute';
import VerticalNavigationMenuContainer from '../VerticalNavigationMenu';
import styles from './AppNavigatorAuthenticated.module.css';

// Route components
import AdminDataExplorerContainer from '../AdminDataExplorer';
import BatchContainer from '../Batch';
import BatchListContainer from '../BatchList';
import DashboardContainer from '../Dashboard';
import NotFoundContainer from '../NotFound';
import PanelCreateContainer from '../PanelCreate';
import PanelCurrentContainer from '../PanelCurrent';
import PanelPastContainer from '../PanelPast';
import PanelEditContainer from '../PanelEdit';
import PanelContainer from '../Panel';
import PanelSearchContainer from '../PanelSearchResults';
import ProductContainer from '../Product';
import ProductCreateContainer from '../ProductCreate';
import ProductListContainer from '../ProductList';
import ProductReviewListContainer from '../ProductReviewList';
import ProductReviewContainer from '../ProductReview';
import UserListContainer from '../UserList';
import UserContainer from '../User';
import ReportsContainer from '../ReportRequestList';
import ReportsQAContainer from '../ReportQAList';
import ReportRequestContainer from '../RequestReport';
import CreateReviewContainer from '../CreateReview';
import ManageDevicesContainer from '../DeviceList';
import DeviceCreateContainer from '../DeviceCreate';
import LanguageSelectionContainer from '../LanguageSelection';
import SelectWorkspace from '../SelectWorkspace';
import UserCreateContainer from '../UserCreate';
import AdminToolsContainer from '../AdminTools';
import EditReviewContainer from '../EditReview';
import ReportContainer from '../Report';
import NotificationContainer from '../Notification';
import ReportDashboardContainer from '../ReportDashboard';
import DataQualityDashboardContainer from '../DataQualityDashboard';
import ProductFilterContainer from '../ProductFilter';
import GroupWorkspaceContainer from '../GroupWorkspace';
import DemographicTargetCreateContainer from '../DemographicTargetCreate';
import DemographicTargetListContainer from '../DemographicTargetList';
import DemographicTargetContainer from '../DemographicTarget';
import UserDemographicList from '../UserDemographicList';
import PanelUserContainer from '../PanelUser';
import CustomLexiconContainer from '../CustomLexicon';

const renderAdminOnlyRoutes = () => (
  <Switch>
    <Route
      path={ADD_DEMOGRAPHIC_TARGET}
      component={DemographicTargetCreateContainer}
    />
    <Route
      path={DEMOGRAPHIC_TARGETS}
      component={DemographicTargetListContainer}
    />
    <Route path={DEMOGRAPHIC_TARGET} component={DemographicTargetContainer} />
    <Route path={REQUEST_REPORT} component={ReportRequestContainer} />
    <Route path={REPORTS} component={ReportsContainer} />
    <Route path={REPORT} component={ReportContainer} />
    <Route
      exact
      path={ADD_DEVICES}
      render={props => <DeviceCreateContainer {...props} />}
    />
    <Route component={NotFoundContainer} />
  </Switch>
);

const renderSuperadminOnlyRoutes = () => (
  <Switch>
    <Route path={CUSTOM_LEXICON} component={CustomLexiconContainer} />
    <Route path={USERS_DEMOGRAPHIC} component={UserDemographicList} />
    <Route
      path={ADD_DEMOGRAPHIC_TARGET}
      component={DemographicTargetCreateContainer}
    />
    <Route
      path={DEMOGRAPHIC_TARGETS}
      component={DemographicTargetListContainer}
    />
    <Route path={DEMOGRAPHIC_TARGET} component={DemographicTargetContainer} />
    <Route path={PRODUCT_FILTER} component={ProductFilterContainer} />
    <Route path={GROUP_WORKSPACES} component={GroupWorkspaceContainer} />
    <Route path={REQUEST_REPORT} component={ReportRequestContainer} />
    <Route path={REPORT} component={ReportContainer} />
    <Route path={REPORTS} component={ReportsContainer} />
    <Route path={REPORTS_QA} component={ReportsQAContainer} />
    <Route path={CREATE_REVIEW} component={CreateReviewContainer} />
    <Route path={EDIT_REVIEW} component={EditReviewContainer} />
    <Route path={ADMIN_DATA_EXPLORER} component={AdminDataExplorerContainer} />
    <Route path={REPORT_DASHBOARD} component={ReportDashboardContainer} />
    <Route
      exact
      path={ADD_DEVICES}
      render={props => <DeviceCreateContainer {...props} />}
    />
    <Route
      path={MANAGE_DEVICES}
      render={props => (
        <ManageDevicesContainer {...props} title="Manage Devices" />
      )}
    />
    <Route path={ADMIN} component={AdminToolsContainer} />
    <Route component={NotFoundContainer} />
  </Switch>
);

const renderAuthenticatedRoutes = () => (
  <Switch>
    <Route
      path={AUTHENTICATION}
      render={() => <Redirect to={SELECT_WORKSPACE} />}
    />

    <Route
      path={BATCH_PRODUCT_REVIEWS}
      render={props => (
        <ProductReviewListContainer
          {...props}
          batchId={props.match.batchId}
          title={`Batch ${props.match.batchId} Product Reviews`}
        />
      )}
    />
    <Route path={BATCH} component={BatchContainer} />

    <Route
      path={BATCHES}
      render={props => <BatchListContainer {...props} title="All Batches" />}
    />

    <Route path={DASHBOARD} component={DashboardContainer} />

    <Route path={SELECT_WORKSPACE} component={props => <SelectWorkspace />} />

    <Route
      path={PANEL_PRODUCT_REVIEWS}
      render={props => (
        <ProductReviewListContainer
          {...props}
          panelId={props.match.panelId}
          title={`Panel ${props.match.panelId} Product Reviews`}
        />
      )}
    />

    <Route
      path={PANEL_CREATE}
      render={props => <PanelCreateContainer {...props} />}
    />

    <Route
      path={PANEL_EDIT}
      render={props => <PanelEditContainer {...props} />}
    />

    <Route
      path={DATA_QUALITY_DASHBOARD}
      render={props => <DataQualityDashboardContainer {...props} />}
    />

    <Route
      path={PANEL}
      render={props => <PanelContainer {...props} title="Panel" />}
    />

    <Route
      path={PANEL_SEARCH}
      render={props => <PanelSearchContainer {...props} />}
    />

    <Route
      path={PANELS}
      render={props => <PanelCurrentContainer {...props} />}
    />

    <Route
      path={PANELS_EXPIRED}
      render={props => <PanelPastContainer {...props} />}
    />

    <Route
      path={PRODUCT_PRODUCT_REVIEWS}
      render={props => (
        <ProductReviewListContainer
          {...props}
          productId={props.match.productId}
          title={`Product ${props.match.productId} Product Reviews`}
        />
      )}
    />
    <Route
      path={PRODUCT_CREATE}
      render={props => <ProductCreateContainer {...props} />}
    />
    <Route path={PRODUCT} component={ProductContainer} />

    <Route
      path={PRODUCTS}
      render={props => <ProductListContainer {...props} title="All Products" />}
    />

    <Route path={PRODUCT_REVIEW} component={ProductReviewContainer} />

    <Route path={PRODUCT_REVIEWS} component={ProductReviewListContainer} />

    <UserRouteContainer
      path={USER_PRODUCT_REVIEWS}
      render={props => (
        <ProductReviewListContainer
          {...props}
          userId={props.userId}
          title={`User ${props.match.userId} Product Reviews`}
        />
      )}
    />
    <Route path={USER} component={UserContainer} />

    <Route
      path={USERS}
      render={props => <UserListContainer {...props} title="All Users" />}
    />

    <Route
      path={PANELISTS}
      render={props => <PanelUserContainer {...props} title="All Panelists" />}
    />

    <Route
      exact
      path={HOME}
      render={props => <ProductListContainer {...props} title="All Products" />}
    />

    <Route
      path={LANGUAGES}
      render={props => (
        <LanguageSelectionContainer {...props} title="Select Language" />
      )}
    />
    <Route
      path={NOTIFICATION}
      render={props => (
        <NotificationContainer {...props} title="Notification" />
      )}
    />

    <Route
      path={APP_ROOT}
      render={() => (
        <ConditionViewerRoleIsAdminContainer
          render={(viewerRoleIsAdmin, viewerRoleIsSuperadmin) => {
            return viewerRoleIsSuperadmin
              ? renderSuperadminOnlyRoutes()
              : viewerRoleIsAdmin
                ? renderAdminOnlyRoutes()
                : null;
          }}
        />
      )}
    />
    {/* <ConditionViewerRoleIsAdminContainer
          render={(viewerRoleIsAdmin, viewerRoleIsSuperadmin) =>{
            return viewerRoleIsSuperadmin ? renderSuperadminOnlyRoutes() : viewerRoleIsAdmin ? renderAdminOnlyRoutes() : <NotFoundContainer />
          }
          }
        /> */}
    <Route component={NotFoundContainer} />
  </Switch>
);

const AppNavigatorAuthenticatedContainer = ({ workspaceProducerId }) =>
  workspaceProducerId === undefined ? (
    <SelectWorkspace />
  ) : (
    <div className={styles.container}>
      <AppHeaderContainer />
      <div className={styles.contentsRow}>
        <ConditionViewerRoleIsAdminContainer
          render={(viewerRoleIsAdmin, viewerRoleIsSuperadmin) => (
            <VerticalNavigationMenuContainer
              className={styles.verticalNavigationMenu}
              workspaceProducerId={workspaceProducerId}
              viewerRoleIsAdmin={viewerRoleIsAdmin}
              viewerRoleIsSuperadmin={viewerRoleIsSuperadmin}
            />
          )}
        />
        <div className={styles.contents}>{renderAuthenticatedRoutes()}</div>
      </div>
    </div>
  );

AppNavigatorAuthenticatedContainer.displayName =
  'AppNavigatorAuthenticatedContainer';

export default AppNavigatorAuthenticatedContainer;
