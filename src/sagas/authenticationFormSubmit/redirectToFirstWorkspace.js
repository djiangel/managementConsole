import { head } from 'lodash';
import { call, put } from 'redux-saga/effects';
import workspaceProducerIdSet from '../../actions/workspaceProducerIdSet';
import graphqlClient from '../../consumers/graphqlClient';
import ViewerQuery from '../../graphql/queries/ViewerQuery';

export default function* redirectToFirstWorkspaceSaga() {
  const viewerWorkspaceProducersResult = yield call(graphqlClient.query, {
    query: ViewerQuery
  });
  const viewerWorkspaceProducers =
    viewerWorkspaceProducersResult &&
    viewerWorkspaceProducersResult.data &&
    viewerWorkspaceProducersResult.data.viewer &&
    viewerWorkspaceProducersResult.data.viewer.workspaceProducers &&
    viewerWorkspaceProducersResult.data.viewer.workspaceProducers.nodes;
  const firstWorkspaceProducer = head(viewerWorkspaceProducers);
  const firstWorkspaceProducerId =
    firstWorkspaceProducer && firstWorkspaceProducer.id;

  yield put(workspaceProducerIdSet(firstWorkspaceProducerId));
}
