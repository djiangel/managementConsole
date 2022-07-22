/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

const colorsByStatus = {
  primary: '#42a5f5',
  positive: '#7cb342',
  warn: '#ff9800',
  negative: '#f44336',
  neutral: '#78909c'
};

export const StyledContainerDiv = styled.div`
  ${flexContainer};
  background-color: white;
  border: 1px solid #e4ede5;
  border-radius: 4px;
  padding: 10px;
  margin: 8px;

  > .title {
    color: #78909C;
    font-size: 12px;
    font-weight: normal;
  }

  > .contentContainer {
    color: ${({ status }) =>
      status ? colorsByStatus[status] : colorsByStatus.primary}
    padding-top: 8px;

    > h1 {
      font-size: 24px;
      font-weight: 400;
    }

    > h2 {
      font-size: 18px;
      font-weight: 300;
    }

    > h3 {
      font-size: 13px;
      font-weight: normal;
    }
  }
`;
