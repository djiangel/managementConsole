/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const StyledContainerDiv = styled.div`
  > .pageWrapper {
    margin-bottom: 10px;

    > .message {
      color: #9e9e9e;
      font-size: 36px;
      font-weight: 300;
      margin: 24px;
      text-align: center;
    }
  }

  > .pagination {
    ${flexContainer};
    flex-direction: row;
    justify-content: flex-end;

    > .button {
      border: 1px solid #ddd;
      border-radius: 4px;
      color: white;
      padding: 10px;
      margin-right: 10px;
      background: linear-gradient(0deg, #282f3b, #303847);
      margin-bottom: 1rem;
      font-weight: bold;
    }
  }
`;
