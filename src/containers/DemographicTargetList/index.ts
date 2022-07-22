import DemographicTargetList from './DemographicTargetList';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import changeProductTablePage from '../../actions/changeProductTablePage';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import AllDemographicTargetQuery from '../../graphql/queries/AllDemographicTargetQuery';
import { withTranslation } from 'react-i18next';

const mapStateToProps = state => ({
  producerId: selectWorkspaceProducerId(state)
});

const mapDispatchToProps = dispatch => ({});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(AllDemographicTargetQuery, {
    options: (props: any) => ({
      variables: {
        first: 25,
        condition: {
          producerId: props.producerId,
        },
        orderBy: 'ID_DESC'
      },
      notifyOnNetworkStatusChange: true
    }),
    name: 'demographicTargetResults'
  }),
  withTranslation()
)(DemographicTargetList);
