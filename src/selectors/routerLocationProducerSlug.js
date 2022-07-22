import { matchPath } from 'react-router';
import { PRODUCER_ROOT } from '../constants/routePaths';
import selectRouterLocation from './routerLocation';

export default function routerLocationProducerSlug(state) {
  const routerLocation = selectRouterLocation(state);
  const routerLocationPathname = routerLocation && routerLocation.pathname;
  const routerLocationProducerRootMatch = matchPath(routerLocationPathname, {
    path: PRODUCER_ROOT
  });

  return (
    routerLocationProducerRootMatch &&
    routerLocationProducerRootMatch.params &&
    routerLocationProducerRootMatch.params.producerSlug
  );
}
