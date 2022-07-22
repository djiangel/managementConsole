/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

// NOTE: `graphiql-container` is the className of the div rendered by
// GraphiQL. This may break if changed in future versions...
export const StyledContainerDiv = styled.div`
  > .graphiql-container {
    height: 90vh;
  }
`;
