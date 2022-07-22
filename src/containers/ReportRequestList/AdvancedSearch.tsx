import * as React from 'react';
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Paper,
  TextField
} from '@material-ui/core';
import { COUNTRIES } from '../../constants/report';
import { useTranslation } from 'react-i18next';
import useStyles from 'containers/ReportRequestList/useStyles';
import MaterialButton from 'components/MaterialButton';

const styles = require('./AdvancedSearch.module.css');

interface Props {
  optimization: boolean;
  setOptimization: Function;
  marketSurvey: boolean;
  setMarketSurvey: Function;
  inProgress: boolean;
  setInProgress: Function;
  inQA: boolean;
  setInQA: Function;
  done: boolean;
  setDone: Function;
  revised: boolean;
  setRevised: Function;
  rejected: boolean;
  setRejected: Function;
  toDate: String;
  setToDate: Function;
  fromDate: String;
  setFromDate: Function;
  client: String;
  setClient: Function;
  projectMemo: String;
  setProjectMemo: Function;
  country: String;
  setCountry: Function;
  gender: String;
  setGender: Function;
  ageLower: String;
  setAgeLower: Function;
  ageUpper: String;
  setAgeUpper: Function;
  constraint: String[];
  setConstraint: Function;
  resetFilter: Function;
}

const AdvancedSearch: React.FunctionComponent<Props> = props => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Paper className={classes.container}>
      <h4 className={styles.heading}>Advance Filter</h4>
      <Divider />
      <FormControl component="fieldset" className={classes.section}>
        <FormLabel component="legend">Report Type</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.optimization}
                onChange={({ target }) => props.setOptimization(target.checked)}
              />
            }
            label="Optimization"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={props.marketSurvey}
                onChange={({ target }) => props.setMarketSurvey(target.checked)}
              />
            }
            label="Market Survey"
          />
        </FormGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.section}>
        <FormLabel component="legend">Status</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={props.inProgress}
                onChange={({ target }) => props.setInProgress(target.checked)}
              />
            }
            label="In Progress"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={props.inQA}
                onChange={({ target }) => props.setInQA(target.checked)}
              />
            }
            label="In QA"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={props.done}
                onChange={({ target }) => props.setDone(target.checked)}
              />
            }
            label="Done"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={props.revised}
                onChange={({ target }) => props.setRevised(target.checked)}
              />
            }
            label="Revised"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={props.rejected}
                onChange={({ target }) => props.setRejected(target.checked)}
              />
            }
            label="Rejected"
          />
        </FormGroup>
      </FormControl>
      <FormControl className={classes.section}>
        <FormLabel component="legend">Submission Date</FormLabel>
        <TextField
          label="From"
          type="date"
          InputLabelProps={{
            shrink: true
          }}
          value={props.fromDate}
          onChange={({ target }) => props.setFromDate(target.value)}
        />
        <TextField
          label="To"
          type="date"
          InputLabelProps={{
            shrink: true
          }}
          value={props.toDate}
          onChange={({ target }) => props.setToDate(target.value)}
        />
      </FormControl>
      <FormControl className={classes.section}>
        <TextField
          label="Client Name"
          value={props.client}
          onChange={({ target }) => props.setClient(target.value)}
        />
      </FormControl>
      <FormControl className={classes.section}>
        <TextField
          label="Project Memo"
          value={props.projectMemo}
          onChange={({ target }) => props.setProjectMemo(target.value)}
        />
      </FormControl>
      <FormControl className={classes.section}>
        <TextField
          label="Country"
          select
          value={props.country}
          onChange={({ target }) => props.setCountry(target.value)}
        >
          {COUNTRIES.map(item => (
            <MenuItem key={item.code} value={item.code}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
      <FormControl className={classes.section}>
        <TextField
          label="Gender"
          select
          value={props.gender}
          onChange={({ target }) => props.setGender(target.value)}
        >
          {Object(t('gender', { returnObjects: true })).map(item => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
      <FormControl className={classes.section}>
        <FormLabel component="legend">Age Range</FormLabel>
        <TextField
          label="Lower Limit"
          value={props.ageLower}
          onChange={({ target }) => props.setAgeLower(target.value)}
        />
        <TextField
          label="Upper Limit"
          value={props.ageUpper}
          onChange={({ target }) => props.setAgeUpper(target.value)}
        />
      </FormControl>
      <FormControl className={classes.section}>
        <TextField
          label="Constraint(s)"
          select
          SelectProps={{ multiple: true }}
          value={props.constraint}
          onChange={({ target }) => props.setConstraint(target.value)}
        >
          {Object(t('constraintLevelOptions', { returnObjects: true })).map(
            item => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            )
          )}
        </TextField>
      </FormControl>
      <MaterialButton
        onClick={() => props.resetFilter()}
        soft
        teal
        variant="outlined"
        style={{margin: '0 20px'}}
      >
        Reset
      </MaterialButton>
    </Paper>
  );
};

export default AdvancedSearch
