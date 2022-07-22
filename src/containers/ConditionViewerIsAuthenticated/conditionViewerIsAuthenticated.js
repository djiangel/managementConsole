type Props = {
  viewerIsAuthenticated: boolean,
  render: (viewerIsAuthenticated: boolean) => React$Element
};

const ConditionViewerIsAuthenticatedContainer = ({
  viewerIsAuthenticated,
  render
}: Props) => render(viewerIsAuthenticated);

ConditionViewerIsAuthenticatedContainer.displayName =
  'ConditionViewerIsAuthenticatedContainer';

export default ConditionViewerIsAuthenticatedContainer;
