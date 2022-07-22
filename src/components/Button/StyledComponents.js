/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import flexContainer from '../../styles/flexContainer';

const stylesByType = {
  negative: `
    background: #c62828;
    border: 1px solid #212121;
    color: #fafafa;

    &:hover {
      background: #d32f2f;
      color: #f5f5f5;
    }

    &:active {
      background: #b71c1c;
      color: #eee;
    }
  `,
  primary: `
    background: linear-gradient(0deg, #f5f5f5, #fafafa);
    border: 1px solid #ddd;
    color: #757575;

    &:hover {
      background: #fafafa;
    }

    &:active {
      color: #616161;
    }
  `,
  positive: `
    background: linear-gradient(0deg, #33691e, #558B2f);
    border: 1px solid #33691e;
    color: white;

    &:hover, &:active {
      background: linear-gradient(0deg, #33691e, #689f38);
      border: 1px solid #33691e;
      color: white;
    }
  `,
  secondary: `
    background: #eee;
    border: 1px solid #ddd;
    color: #9e9e9e;

    &:hover {
      background: #e0e0e0;
      color: #757575;
    }

    &:active {
      color: #9e9e9e;
    }
  `,
  dark: `
    background: #4a4a4a;
    border: 1px solid #4a4a4a;
    color: white;

    &:hover, &:active {
      background: #222222;
      border: 1px solid #979797;
      color: white;
    }
  `,
  light: `
    background: #ffffff;
    border: 1px solid #979797;
    color: black;

    &:hover, &:active {
      background: #e8e8e8;
      border: 1px solid #979797;
      color: black;
    }
  `
};

export const StyledButton = styled.button`
  ${flexContainer};
  align-items: center;
  border: none;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  color: white;
  font-size: 16px;
  font-weight: 500;
  height: 40px;
  justify-content: center;
  line-height: 1.2;
  outline: none;
  padding: 10px;
  transition: 200ms;
  margin: 1rem;

  &:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  &:active {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  &:disabled {
    background: #bdbdbd;
    box-shadow: none;
    color: #eee;
    cursor: not-allowed;
  }

  &:enabled {
    ${stylesByType.primary};
    ${props => props.negative && stylesByType.negative};
    ${props => props.positive && stylesByType.positive};
    ${props => props.secondary && stylesByType.secondary};
    ${props => props.dark && stylesByType.dark};
    ${props => props.light && stylesByType.light};

    &:hover {
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(1px);
    }
  }
`;
