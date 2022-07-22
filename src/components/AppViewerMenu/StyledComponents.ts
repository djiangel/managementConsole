/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

export const menuSectionClassName = 'menuSection';
export const notificationSectionClassName = 'notificationSection';

export const StyledContainerDiv = styled.div`
  ${flexContainer};
  z-index: 100;

  > .backdrop {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: rgba(0, 0, 0, 0.02);
  }

  > .notificationIcon {
    position: relative;
    right: 60px;
    top: 27px;

    > .toggleNotificationIsOpenButton {
      height: 50px;
      display: flex;
      flex-direction: row;
      margin-right: 15px;
      align-items: center;
    }

    > .notificationWrapper {
      transition: all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: absolute;
      top: 100%;
      right: 0px;

      opacity: 0;
      visibility: hidden;

      > .notification {
        ${flexContainer};
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.1);
        font-size: 14px;
        min-width: 475px;

        > .${notificationSectionClassName} {
          ${flexContainer};
          border-bottom: 1px solid #e4ede5;
          padding: 10px 0;
          
          &:last-child {
            border-bottom: none;
          }
        }
      }

      &.open {
        opacity: 1;
        padding-top: 9px;
        visibility: visible;
      }
    }
  }

  > .relativeWrapper {
    position: relative;
    top: -27px;

    > .toggleMenuIsOpenButton {
      height: 50px;
      display: flex;
      flex-direction: row;
      margin-right: 24px;
      align-items: center;
      
      > .usernameText {
        font-family: OpenSans, sans-serif;
        font-weight: bold;
        color: white;
        
        &:hover {
          cursor: pointer;
          color: var(--aqua-marine);
        }
      }
    }

    > .menuWrapper {
      transition: all 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: absolute;
      top: 100%;
      right: 8px;

      opacity: 0;
      visibility: hidden;

      > .menu {
        ${flexContainer};
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.1);
        font-size: 14px;
        min-width: 185px;

        > .${menuSectionClassName} {
          ${flexContainer};
          border-bottom: 1px solid #e4ede5;
          padding: 10px 0;
          
          &:last-child {
            border-bottom: none;
          }
        }
      }

      &.open {
        opacity: 1;
        padding-top: 13px;
        visibility: visible;
      }
    }
  }
`;
