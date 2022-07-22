import * as React from 'react';
import { FormControl, MenuItem, Paper, Select } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PanelUserList from './PanelUserList';
import { useState } from 'react';
import * as moment from 'moment';
import { Input, InputAdornment } from '../../material';
import { Search as SearchIcon } from '@material-ui/icons';
import PanelUserVanityStats from "containers/PanelUser/PanelUserVanityStats";

const styles = require('./PanelUser.module.css');

interface Props {
  workspaceId: number;
}

const PanelUser: React.FunctionComponent<Props> = ({ workspaceId }) => {
  const { t } = useTranslation();

  const [panelistType, setPanelistType] = useState('all');
  const [searchPanelist, setSearchPanelist] = useState('');

  const searchFilter = () => ({
    or: [
      {
        email: {
          includes: searchPanelist
        }
      },
      {
        name: {
          includes: searchPanelist
        }
      },
      {
        username: {
          includes: searchPanelist
        }
      }
    ]
  });

  const getFilter = () => {
    if (panelistType === 'all') {
      return searchFilter();
    }

    return {
      lastActive: {
        greaterThanOrEqualTo: moment()
          .subtract(30, 'days')
          .toISOString()
      },
      ...searchFilter()
    };
  };

  return (
    <Paper className={styles.container}>
      <div className={styles.mainHeaderContainer}>
        <div className={styles.headerTextContainer}>
          <h5 className={styles.userHeader}>{t('users.panelists')}</h5>
          <h3 className={styles.userTitle}>{t('users.list')}</h3>
        </div>
        <Input
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
          onChange={event => setSearchPanelist(event.target.value)}
          placeholder={t('general.search')}
        />
        <div>
          <FormControl>
            <Select
              value={panelistType}
              onChange={event => setPanelistType(String(event.target.value))}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="all">All Panelists</MenuItem>
              <MenuItem value="active">Active Panelists</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <PanelUserVanityStats workspaceId={workspaceId} />
      {panelistType === 'active' && (
        <p>Showing panelists with completed reviews in the last 30 days</p>
      )}
      <PanelUserList workspaceId={workspaceId} filter={getFilter()} />
    </Paper>
  );
};

export default PanelUser;
