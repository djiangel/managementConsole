/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const StyledContainerDiv = styled.div`
  > .backdrop {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: rgba(0, 0, 0, 0.2);
  }

  > .body {
    background: white;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    position: relative;

    > .header {
      background: #fafafa;
      border-bottom: 1px solid #ddd;
      border-radius: 4px 4px 0 0;
      padding: 10px 30px;
      pointer-events: auto;

      > .headerText {
        color: #616161;
        font-size: 14px;
        font-weight: 600;
      }
    }

    > .childrenWrapper {
      pointer-events: auto;
    }
  }
`;
