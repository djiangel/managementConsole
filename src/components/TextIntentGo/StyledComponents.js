/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const StyledContainerDiv = styled.div`
  ${flexContainer};
  align-items: center;
  color: #29b6f6;
  font-size: 14px;
  flex-direction: row;

  .textWrapper {
  }

  .arrow {
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNIDAgLTAuNUMgLTAuMjc2MTQyIC0wLjUgLTAuNSAtMC4yNzYxNDIgLTAuNSAwQyAtMC41IDAuMjc2MTQyIC0wLjI3NjE0MiAwLjUgMCAwLjVMIDAgLTAuNVpNIDEwLjM1MzYgMC4zNTM1NTNDIDEwLjU0ODggMC4xNTgyOTEgMTAuNTQ4OCAtMC4xNTgyOTEgMTAuMzUzNiAtMC4zNTM1NTNMIDcuMTcxNTcgLTMuNTM1NTNDIDYuOTc2MzEgLTMuNzMwOCA2LjY1OTczIC0zLjczMDggNi40NjQ0NyAtMy41MzU1M0MgNi4yNjkyIC0zLjM0MDI3IDYuMjY5MiAtMy4wMjM2OSA2LjQ2NDQ3IC0yLjgyODQzTCA5LjI5Mjg5IDBMIDYuNDY0NDcgMi44Mjg0M0MgNi4yNjkyIDMuMDIzNjkgNi4yNjkyIDMuMzQwMjcgNi40NjQ0NyAzLjUzNTUzQyA2LjY1OTczIDMuNzMwOCA2Ljk3NjMxIDMuNzMwOCA3LjE3MTU3IDMuNTM1NTNMIDEwLjM1MzYgMC4zNTM1NTNaTSAwIDAuNUwgMTAgMC41TCAxMCAtMC41TCAwIC0wLjVMIDAgMC41WiIgc3R5bGU9ImZpbGw6ICMyOWI2ZjY7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSg0cHgpOyIgLz48L3N2Zz4=');
    height: 8px;
    margin-left: 10px;
    width: 11px;

    path {
      fill: #29b6f6;
      stroke: #29b6f6;
    }
  }
`;
