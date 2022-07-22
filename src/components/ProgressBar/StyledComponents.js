/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const StyledContainerDiv = styled.div`
  ${flexContainer};
  background-color: #f5f5f5;
  flex-direction: row;
  height: 2px;

  > .value {
    background-color: var(--aqua-marine);
    height: 2px;
    flex: ${({ value }) => value};
  }

  > .maximum {
    flex: ${({ value }) => 1 - value};
  }
`;
