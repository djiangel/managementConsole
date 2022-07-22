/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';
import { COLORS } from '../../styles/theme';

export const iconClassName = 'icon';
export const linkClassName = 'link';
export const linkActiveClassName = 'linkActive';
export const textClassName = 'text';
export const accessoryClassName = 'accessory';

export const StyledContainerDiv = styled.div`
  > .${linkClassName} {
    ${flexContainer};
    align-items: center;
    flex-direction: row;
    height: 60px;

    > .${iconClassName} {
      ${flexContainer};
      align-items: center;
      color: ${COLORS.MARINE};
      margin-right: 20px;
      width: 24px;
    }

    > .${textClassName} {
      color: ${COLORS.MARINE};
      font-size: 16px;
      font-weight: regular;
    }
    
    > .${accessoryClassName} {
      width: 3px;
      height: 40px;
      margin-right: 20px;
    }

    &:hover {
      > .${textClassName} {
        color: ${COLORS.AQUA_MARINE};
      }

      > .${iconClassName} {
        color: ${COLORS.AQUA_MARINE};
      }
      
      > .${accessoryClassName} {
        background-color: ${COLORS.AQUA_MARINE};
      }
    }

    &.${linkActiveClassName} {
      > .${textClassName} {
        color: ${COLORS.MARINE};
        font-weight: bold;
      }

      > .${iconClassName} {
        color: ${COLORS.MARINE};
      }
      
      > .${accessoryClassName} {
        background-color: ${COLORS.AQUA_MARINE};
      }
    }
  }
`;
