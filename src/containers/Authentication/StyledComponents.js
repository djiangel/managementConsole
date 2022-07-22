/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import PanelFooter from '../../components/PanelFooter';
import flexContainer from '../../styles/flexContainer';

export const StyledContainerDiv = styled.div`
  ${flexContainer};
  align-items: center;
  flex: 1;
  justify-content: center;

  > .welcomePanel {
    margin: 10px;
    width: 500px;

    > .header {
      display: flex;
      justify-content: center;
      padding: 20px 0;
    }
  }

  .authenticationForm {
    ${flexContainer};
    align-self: center;
    margin: 10px 20px;
  }
`;

export const StyledPanelFooter = styled(PanelFooter)`
  ${flexContainer};
  align-items: flex-end;
  flex-direction: row;
  justify-content: center;
  padding: 10px 10px 0 10px;
`;
