/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const menuItemClassName = 'menuItem';
export const menuItemActiveClassName = 'menuItemActive';

export const StyledContainerDiv = styled.div`
  ${flexContainer};
  flex-direction: row;

  > .${menuItemClassName} {
    color: #1565c0;
    font-size: 14px;
    font-weight: 400;
    margin: 0 10px;
    padding-bottom: 18px;

    &:hover {
      border-bottom: 1px solid #b0bec5;
      color: #455a64;
    }

    &.${menuItemActiveClassName} {
      border-bottom: 2px solid #2196f3;
      color: #2196f3;
    }
  }
`;
