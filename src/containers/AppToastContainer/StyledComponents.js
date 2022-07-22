/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const StyledContainerDiv = styled.div`
  ${flexContainer};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  align-items: flex-end;
  padding: 40px;
  pointer-events: none;
  z-index: 1000;
`;
