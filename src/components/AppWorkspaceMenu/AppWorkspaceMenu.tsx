import * as React from 'react';
import {
  StyledContainerDiv,
  workspaceOptionClassName,
  workspaceCurrentTextClassName
} from './StyledComponents';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

interface Props {
  onClickCloseMenu: () => any;
  onClickOpenMenu: () => any;
  menuIsOpen: boolean;
  renderWorkspaceLink: (
    params: {
      children: ReactElement;
      workspaceKey: string;
      clearSearch: () => any;
    }
  ) => ReactElement;
  renderWorkspaceOption: (
    params: {
      workspaceKey: string;
      classes: object;
    }
  ) => ReactElement;
  renderCurrentWorkspace: (
    params: {
      workspaceKey: string;
      workspaceOptionClassName: string;
      workspaceCurrentTextClassName: string;
    }
  ) => ReactElement;
  selectedWorkspaceKey: string;
  workspaceKeys: string[];
  workspaceProducerNamesByWorkspaceKey: any[];
}

const styles = require('./AppWorkspaceMenu.module.css');

const AppWorkspaceMenu: React.FunctionComponent<Props> = props => {
  const {
    onClickCloseMenu,
    onClickOpenMenu,
    menuIsOpen,
    renderWorkspaceLink,
    renderCurrentWorkspace,
    renderWorkspaceOption,
    selectedWorkspaceKey,
    workspaceKeys,
    workspaceProducerNamesByWorkspaceKey,
    ...rest
  } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const [searchString, setSearchString] = useState('');

  const filteredWorkspaceKeys = workspaceKeys.filter(id =>
    workspaceProducerNamesByWorkspaceKey[id]
      .toLowerCase()
      .includes(searchString.toLowerCase())
  );

  const onClose = () => {
    setSearchString('');
    onClickCloseMenu()
  }

  return (
    <StyledContainerDiv {...rest}>
      {menuIsOpen && (
        <div className="backdrop" onClick={onClose} tabIndex={-1} />
      )}
      <div className="relativeWrapper">
        <img
          src={require('../../../public/assets/logo_white.png')}
          alt="header-logo"
          width={165}
        />
        <a
          className="toggleMenuIsOpenButton"
          onClick={menuIsOpen ? onClose : onClickOpenMenu}
          tabIndex={-1}
        >
          {renderCurrentWorkspace({
            workspaceKey: selectedWorkspaceKey,
            workspaceOptionClassName,
            workspaceCurrentTextClassName
          })}
        </a>
        <Drawer
          anchor="top"
          open={!selectedWorkspaceKey || menuIsOpen}
          onClose={onClose}
        >
          <List>
            <div className={styles.headerContainer}>
              <span className={styles.selectWorkspaceText}>
                {t('viewerMenu.selectWorkspace')}
              </span>
              <Input
                endAdornment={
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                }
                onChange={e => setSearchString(e.target.value)}
                placeholder={t('general.search')}
                value={searchString}
                autoFocus
                classes={{ root: styles.searchBar }}
              />
            </div>
            <Divider />
            {filteredWorkspaceKeys.map(workspaceKey =>
              renderWorkspaceLink({
                children: renderWorkspaceOption({
                  workspaceKey,
                  classes
                }),
                workspaceKey,
                clearSearch: () => setSearchString('')
              })
            )}
          </List>
        </Drawer>
      </div>
    </StyledContainerDiv>
  );
};

AppWorkspaceMenu.displayName = 'AppWorkspaceMenu';

export default AppWorkspaceMenu;
