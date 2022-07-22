/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const StyledContainerDiv = styled.div`
  overflow: ${({ multiline }) => (multiline ? 'hidden' : 'visible')};

  > old.label {
    color: #212121;
    display: block;
    font-size: 14px;
    font-weight: 400;
  }

  > .input {
    border-radius: 3px;
    color: #212121;
    font-size: 14px;
    line-height: 20px;
    min-height: 34px;
    outline: none;
    padding: ${({ chromeless }) => (chromeless ? 'none' : '4px 0')};
    vertical-align: middle;

    &:focus {
      border: 1px solid #2196f3;
      box-shadow: inset 0 1px 2px rgba(27, 31, 35, 0.075),
        0 0 0 0.2em rgba(3, 102, 214, 0.3);
    }

    &[type='checkbox'] {
      appearance: none;
      background: #fafafa;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.075);
      cursor: pointer;
      height: 34px;
      margin-top: 6px;
      width: 34px;

      &:checked {
        background: #2196f3;
        border: 1px solid white;
        box-shadow: 0 0 0 1px #ddd;
      }
    }
  }

  > .descriptionText {
    color: #757575;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    min-height: 17px;
    margin: 4px 0 2px;
  }
`;
