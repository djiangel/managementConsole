/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const StyledContainerDiv = styled.div`
  ${flexContainer};
  align-items: center;
  background-color: #282f3b;
  background-image: linear-gradient(to right, #022950, #465dba);
  flex-shrink: 0;
  flex-direction: row;
  font-size: 14px;
  height: 70px;

  > .leftItemWrapper {
    ${flexContainer};
    align-items: flex-start;
    flex: 1;
    padding: 0 16px;

    > .logo {
      color: #9e9e9e;
      font-family: 'Fira Sans', sans-serif;
      font-size: 22px;
    }
  }

  > .notificationsMenuWrapper,
  > .viewerMenuWrapper {
    ${flexContainer};
    justify-content: center;
  }
`;
