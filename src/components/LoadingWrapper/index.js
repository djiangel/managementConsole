import React from 'react';
import ActivityIndicator from '../ActivityIndicator';

type Props = {
  Component: () => React$Element,
  loading: boolean
};

const LoadingWrapper = ({ Component, loading, ...props }: Props) =>
  loading ? <ActivityIndicator /> : <Component {...props} />;

LoadingWrapper.displayName = 'LoadingWrapper';

export default LoadingWrapper;
