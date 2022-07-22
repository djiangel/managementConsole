/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const StyledContainerDiv = styled.div`
  ${flexContainer};
  align-items: center;
  background-color: white;
  border-radius: 0 0 4px 4px;
  border-top: 1px solid #ddd;
  flex-direction: row;
  min-height: 40px;
`;
