/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const workspaceOptionClassName = 'workspaceOption';
export const workspaceCurrentTextClassName = 'workspaceCurrentText';

export const StyledContainerDiv = styled.div`
  ${flexContainer};
  width: 280px;
  z-index: 100;

  .${workspaceOptionClassName} {
    ${flexContainer};
    align-items: center;
    border-radius: 2px;
    color: #78909c;
    flex-direction: row;
    margin-left: 15px;
    
    & :hover {
      cursor: pointer;
    }

    > .${workspaceCurrentTextClassName} {
      color: white;
      font-size: 18px;
      font-family: AlphaHeadlinePro, sans-serif;
      margin-left: 10px;
    }
  }

  > .backdrop {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: rgba(0, 0, 0, 0.03);
  }

  > .relativeWrapper {
    position: relative;

    > .titleText {
      font-family: AlphaHeadlinePro, sans-serif;
      font-size: 24px;
      color: white;
    }

    > .toggleMenuIsOpenButton {
      height: 50px;
    }

    > .menuWrapper {
      transition: all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: absolute;
      top: 100%;
      left: 0;

      opacity: 0;
      visibility: hidden;

      > .menu {
        ${flexContainer};

        background-color: white;
        border: 1px solid #dae4ed;
        border-radius: 4px;
        box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.1);
        padding: 10px 10px 0;

        .${workspaceOptionClassName} {
          margin-bottom: 10px;
        }
      }

      &.open {
        opacity: 1;
        padding-top: 4px;
        visibility: visible;
      }
    }
  }
`;
