import ReportsQATable from './ReportsQATable';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import changeProductTablePage from '../../actions/changeProductTablePage';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import AllMarketSurveyReportQuery from '../../graphql/queries/AllMarketSurveyReportQuery';
import AllOptimizationReportQuery from '../../graphql/queries/AllOptimizationReportQuery';
import { withTranslation } from 'react-i18next';

const mapStateToProps = state => ({
  userId: state.session && state.session.userId,
  producerId: selectWorkspaceProducerId(state),
});

const mapDispatchToProps = dispatch => ({
  changeReportsTablePage: page => dispatch(changeProductTablePage(page))
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  graphql(AllMarketSurveyReportQuery, {
    options: (props: any) => ({
      variables: {
        condition: {
          producerId: props.producerId
        },
        orderBy: 'ID_DESC'
      },
      notifyOnNetworkStatusChange: true
    }),
    name: 'marketSurveyResults'
  }),
  graphql(AllOptimizationReportQuery, {
    options: (props: any) => ({
      variables: {
        condition: {
          producerId: props.producerId
        },
        orderBy: 'ID_DESC'
      },
      notifyOnNetworkStatusChange: true
    }),
    name: 'optimizationResults'
  }),
  withTranslation()
)(ReportsQATable);
