import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ActivityIndicator from '../../components/ActivityIndicator';
import { StyledContainerDiv } from './StyledComponents';

type LinkLocation = string | Object;

type Props = {
  loading: boolean,
  nextButtonLinkLocation?: LinkLocation,
  previousButtonLinkLocation?: LinkLocation,
  renderPage: (resultNodes: Object[]) => React$Element,
  resultNodes: Object[]
};

export default class QueryPaginationContainer extends Component {
  static defaultProps = {
    filterField: fieldName => fieldName !== '__typename',
    nextButtonLinkLocation: null,
    previousButtonLinkLocation: null
  };

  props: Props;

  renderPagination() {
    const { previousButtonLinkLocation, nextButtonLinkLocation } = this.props;

    return (
      <div className="pagination">
        {previousButtonLinkLocation && (
          <Link to={previousButtonLinkLocation} className="button">
            Previous
          </Link>
        )}
        {nextButtonLinkLocation && (
          <Link to={nextButtonLinkLocation} className="button">
            Next
          </Link>
        )}
      </div>
    );
  }

  render() {
    const { loading, renderPage, resultNodes } = this.props;
    let contents;

    if (loading) {
      contents = <ActivityIndicator />;
    } else if (!resultNodes) {
      contents = <div className="message">No results</div>;
    } else {
      contents = renderPage(resultNodes);
    }

    return (
      <StyledContainerDiv>
        <div className="pageWrapper">{contents}</div>
        {resultNodes && this.renderPagination()}
      </StyledContainerDiv>
    );
  }
}
