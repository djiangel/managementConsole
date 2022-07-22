/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const linkClassName = 'link';
export const linkActiveClassName = 'linkActive';

export const StyledContainerDiv = styled.div`
  padding: 0 10px;

  > .${linkClassName} {
    color: #9e9e9e;
    font-size: 16px;
    margin: 0 10px;

    & :hover {
      cursor: pointer;
    }
  }

  > .${linkActiveClassName} {
    color: #e0e0e0;
  }
`;
