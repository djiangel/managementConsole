/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const inputClassName = 'input';

export const StyledFieldSet = styled.fieldset`
  ${flexContainer};
  border: none;
  margin: 10px 0 20px;

  > legend {
    border: none;
    color: #78909c;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 10px;
  }

  > .inputsWrapper {
    ${flexContainer};

    > .${inputClassName} {
      ${flexContainer};
      border-radius: 0px;
      margin-top: -1px;

      &:first-child {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        margin-top: 0px;
      }

      &:last-child {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border-bottom-width: 1px;
      }
    }
  }
`;
