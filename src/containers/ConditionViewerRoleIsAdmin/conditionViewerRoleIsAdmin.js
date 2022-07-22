type Props = {
  viewerRoleIsAdmin: boolean,
  viewerRoleIsSuperadmin: boolean,
  render: (
    viewerRoleIsAdmin: boolean,
    viewerRoleIsSuperadmin?: boolean
  ) => React$Element
};

const ConditionViewerRoleIsAdminContainer = ({
  viewerRoleIsAdmin,
  viewerRoleIsSuperadmin,
  render
}: Props) => render(viewerRoleIsAdmin, viewerRoleIsSuperadmin);

ConditionViewerRoleIsAdminContainer.displayName =
  'ConditionViewerRoleIsAdminContainer';

export default ConditionViewerRoleIsAdminContainer;
