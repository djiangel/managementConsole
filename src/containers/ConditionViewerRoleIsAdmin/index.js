import { graphql } from 'react-apollo';
import {
  adminUserRole,
  superadminUserRole
} from '../../constants/adminUserRole';
import ConditionViewerRoleIsAdmin from './conditionViewerRoleIsAdmin';
import ViewerQuery from '../../graphql/queries/ViewerQuery';

export default graphql(ViewerQuery, {
  props: ({ data: { loading, viewer } }) => {
    const viewerRole = viewer && viewer.role;

    return {
      loading,
      viewerRoleIsAdmin: viewerRole === adminUserRole,
      viewerRoleIsSuperadmin: viewerRole === superadminUserRole
    };
  }
})(ConditionViewerRoleIsAdmin);
