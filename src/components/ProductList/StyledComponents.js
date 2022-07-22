/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const StyledContainerDiv = styled.div`
  > .row {
    ${flexContainer};
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 20px;

    > .cellWrapper {
      flex: 1;
      height: 100px;
    }
  }
`;
