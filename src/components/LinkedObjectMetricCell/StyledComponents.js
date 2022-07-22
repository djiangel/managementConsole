/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const StyledContainerDiv = styled.div`
  flex: 1;

  > .header {
    background: white;
    color: #78909c;
    font-size: 14px;
    padding: 20px 0 20px 30px;
    text-transform: uppercase;
  }

  > .contentWrapper {
    background: #fafafa;
    border-right: 1px solid rgba(0, 0, 0, 0.05);
    padding: 20px 30px;

    > .value {
      color: #7986cb;
      font-size: 24px;
      font-weight: 300;
    }

    > .intentWrapper {
      margin-top: 20px;
    }
  }

  &:last-child > .contentWrapper {
    border-right: none;
  }
`;
