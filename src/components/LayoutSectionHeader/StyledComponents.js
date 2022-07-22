/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const StyledContainerDiv = styled.div`
  ${flexContainer};
  border-bottom: 1px solid #e4ede5;
  padding: 30px 16px 16px;

  > h1,
  > * > h1 {
    color: #42a5f5;
    font-size: 24px;
    font-weight: 400;
  }

  > h2,
  > * > h2 {
    color: #607d8b;
    font-size: 18px;
    font-weight: 300;
  }

  > h3,
  > * > h3 {
    color: #78909c;
    font-size: 13px;
    font-weight: normal;
  }
`;
