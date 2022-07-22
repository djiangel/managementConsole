import * as React from 'react';
import { ReactElement } from 'react';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import { COLORS } from '../../styles/theme';

const styles = require('./PanelHeader.module.css');

interface Props {
  renderRightContents: () => ReactElement;
  pin: number;
  name?: string;
  toggleExpansion?: () => void;
  hasExpanded?: boolean;
  colorCode?: string;
}

const PanelHeader: React.FunctionComponent<Props> = ({
  renderRightContents,
  pin,
  name,
  toggleExpansion,
  hasExpanded,
  colorCode
}) => {
  return (
    <div
      className={styles.root}
      style={
        colorCode && {
          backgroundColor:
            colorCode === 'green' ? COLORS.AQUA_MARINE : COLORS.CORAL_PINK
        }
      }
    >
      <div className={styles.container}>
        <div className={styles.panelName}>
          {pin} {name && '-'} {name}
        </div>
        <div className="rightContentsWrapper">
          {!!renderRightContents && renderRightContents()}
        </div>
      </div>
      <div className={styles.minimizeContainer}>
        <IconButton onClick={toggleExpansion}>
          {hasExpanded ? (
            <KeyboardArrowUp color="primary" />
          ) : (
            <KeyboardArrowDown color="primary" />
          )}
        </IconButton>
      </div>
    </div>
  );
};

PanelHeader.displayName = 'PanelHeader';

export default PanelHeader;
