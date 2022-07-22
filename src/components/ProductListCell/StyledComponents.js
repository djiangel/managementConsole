/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const StyledContainerDiv = styled.div`
  ${flexContainer};
  align-items: center;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  color: #424242;
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  height: 100px;
  justify-content: center;
  padding: 20px;
  margin: 10px;
`;
