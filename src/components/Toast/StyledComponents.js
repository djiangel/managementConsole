/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const StyledContainerDiv = styled.div`
  ${flexContainer};
  background: white;
  border-radius: 6px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  overflow: hidden;
  pointer-events: auto;
  width: 300px;

  > .header {
    ${flexContainer};
    align-items: center;
    flex-direction: row;
    min-height: 40px;
    padding: 0 10px;

    > .title {
      color: #9e9e9e;
      font-size: 16px;
      flex: 1;
    }

    > .closeButton {
      color: #9e9e9e;
      cursor: pointer;
    }
  }

  > .contents {
    color: #757575;
    font-size: 14px;
    padding: 10px;
  }
`;
