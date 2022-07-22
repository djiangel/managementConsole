/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const StyledContainerDiv = styled.div`
  ${flexContainer};
  align-items: center;
  flex: 1;
  margin-top: 20px;
  justify-content: center;

  > h1 {
    color: #9e9e9e;
    font-size: 48px;
    font-weight: 300;
  }
`;
