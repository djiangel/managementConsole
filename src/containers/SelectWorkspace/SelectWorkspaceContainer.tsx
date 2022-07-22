import * as React from 'react';
import {
  Divider,
  List,
  Input,
  InputAdornment,
  Container,
  Paper
} from '../../material/index';
import { Search } from '../../material/index';
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
    }
  ) => ReactElement;
  renderWorkspaceOption: (
    params: {
      workspaceKey: string;
      classes: object;
    }
  ) => ReactElement;
  selectedWorkspaceKey: string;
  workspaceKeys: string[];
  workspaceProducerNamesByWorkspaceKey: any[];
}

const SelectWorkspaceContainer: React.FunctionComponent<Props> = props => {
  const {
    onClickCloseMenu,
    onClickOpenMenu,
    menuIsOpen,
    renderWorkspaceLink,
    renderWorkspaceOption,
    selectedWorkspaceKey,
    workspaceKeys,
    workspaceProducerNamesByWorkspaceKey,
    ...rest
  } = props;

  const { t } = useTranslation();
  const [searchString, setSearchString] = useState('');

  const filteredWorkspaceKeys = workspaceKeys.filter(id =>
    workspaceProducerNamesByWorkspaceKey[id]
      .toLowerCase()
      .includes(searchString.toLowerCase())
  );

  const classes = useStyles();
  const styles = require('./SelectWorkspace.module.css');

  return (
      <Container component="main" maxWidth="sm">
        <Paper classes={ {root: classes.paper }}>
        <div className={styles.header}>
                {t('viewerMenu.selectWorkspace')}
              </div>
              <Input
                endAdornment={
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                }
                onChange={e => setSearchString(e.target.value)}
                placeholder={t('general.search')}
                value={searchString}
              />
            <Divider variant="fullWidth" />
          <List classes={{root: classes.list}}>
            {filteredWorkspaceKeys.map(workspaceKey =>
              renderWorkspaceLink({
                children: renderWorkspaceOption({
                  workspaceKey,
                  classes: classes
                }),
                workspaceKey
              })
            )}
          </List>
        </Paper>
      </Container>
  );
};

SelectWorkspaceContainer.displayName = 'SelectWorkspaceContainer';

export default SelectWorkspaceContainer;
