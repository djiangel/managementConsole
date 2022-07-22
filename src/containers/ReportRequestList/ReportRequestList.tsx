import * as React from 'react';
import ReportsTable from 'containers/ReportRequestList/ReportsTable';
import AdvancedSearch from 'containers/ReportRequestList/AdvancedSearch';
import { useState } from 'react';
import { set, isEmpty } from 'lodash';
import { event } from 'react-ga';
import { REPORT_LIST_FILTER_CLOSE, REPORT_LIST_FILTER_OPEN } from 'constants/googleAnalytics/actions';
import { CAT_REPORT_LIST } from 'constants/googleAnalytics/categories';

const sortConstraints = constraints => {
  const order = { Low: '1', Medium: '2', High: '3' };

  return constraints.sort((a, b) => order[a] - order[b]);
};

const ReportRequestList = () => {
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);

  const toggleAdvanceSearch = () => {
    event({
      category: CAT_REPORT_LIST,
      action: showAdvanceSearch ? REPORT_LIST_FILTER_CLOSE : REPORT_LIST_FILTER_OPEN
    });
    setShowAdvanceSearch(!showAdvanceSearch)
  }

  const defaultState = {
    optimization: true,
    marketSurvey: true,
    inProgress: true,
    inQA: true,
    done: true,
    revised: true,
    rejected: true,
    fromDate: '',
    toDate: '',
    client: '',
    projectMemo: '',
    country: '',
    gender: '',
    ageLower: '',
    ageUpper: '',
    constraint: []
  };

  const [state, setState] = useState({
    ...defaultState
  });

  const updateState = (name, value) => setState({ ...state, [name]: value });

  const setOptimization = value => updateState('optimization', value);

  const setMarketSurvey = value => updateState('marketSurvey', value);

  const setInProgress = value => updateState('inProgress', value);

  const setInQA = value => updateState('inQA', value);

  const setDone = value => updateState('done', value);

  const setRevised = value => updateState('revised', value);

  const setRejected = value => updateState('rejected', value);

  const setFromDate = value => updateState('fromDate', value);

  const setToDate = value => updateState('toDate', value);

  const setClient = value => updateState('client', value);

  const setProjectMemo = value => updateState('projectMemo', value);

  const setCountry = value => updateState('country', value);

  const setGender = value => updateState('gender', value);

  const setAgeLower = value => updateState('ageLower', value);

  const setAgeUpper = value => updateState('ageUpper', value);

  const setConstraint = value => updateState('constraint', value);

  const {
    inProgress,
    inQA,
    done,
    revised,
    rejected,
    fromDate,
    toDate,
    client,
    projectMemo,
    country,
    gender,
    ageLower,
    ageUpper,
    constraint
  } = state;

  const getStatusFilter = () => {
    const filter = [];

    if (inProgress) {
      filter.push('In Progress');
    }

    if (inQA) {
      filter.push('In QA');
    }

    if (done) {
      filter.push('Done');
    }

    if (revised) {
      filter.push('Revised');
    }

    if (rejected) {
      filter.push('Rejected');
    }

    if (filter.length === 5) {
      return;
    }

    return { status: { in: filter } };
  };

  const getSubmissionDateFilter = () => {
    const filter = {};

    if (fromDate.length > 0) {
      set(filter, 'greaterThanOrEqualTo', fromDate);
    }

    if (toDate.length > 0) {
      set(filter, 'lessThanOrEqualTo', toDate);
    }

    if (isEmpty(filter)) {
      return;
    }

    return { submittedOn: filter };
  };

  const getClientFilter = () => {
    if (client.length === 0) {
      return;
    }

    return { client: { includesInsensitive: client } };
  };

  const getProjectMemoFilter = () => {
    if (projectMemo.length === 0) {
      return;
    }

    return { projectMemo: { includesInsensitive: projectMemo } };
  };

  const getCountryFilter = () => {
    if (country.length === 0) {
      return;
    }

    return { selectedCountries: { like: country } };
  };

  const getGenderFilter = () => {
    if (gender.length === 0) {
      return;
    }

    return { selectedGenders: { like: gender } };
  };

  const getAgeFilter = () => {
    if (ageLower.length === 0 || ageUpper.length === 0) {
      return;
    }

    return { selectedAges: { like: `${ageLower}-${ageUpper}` } };
  };

  const getConstraintFilter = () => {
    if (constraint.length === 0) {
      return;
    }

    return {
      constraintLevel: { like: sortConstraints(constraint).toString() }
    };
  };

  const resetFilter = () => {
    setState({ ...defaultState });
  };

  const filter = {
    ...getStatusFilter(),
    ...getSubmissionDateFilter(),
    ...getClientFilter(),
    ...getProjectMemoFilter(),
    ...getCountryFilter(),
    ...getGenderFilter(),
    ...getAgeFilter(),
    ...getConstraintFilter()
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {showAdvanceSearch && <AdvancedSearch
        optimization={state.optimization}
        setOptimization={setOptimization}
        marketSurvey={state.marketSurvey}
        inProgress={inProgress}
        setInProgress={setInProgress}
        setMarketSurvey={setMarketSurvey}
        inQA={inQA}
        setInQA={setInQA}
        done={done}
        setDone={setDone}
        revised={revised}
        setRevised={setRevised}
        rejected={rejected}
        setRejected={setRejected}
        toDate={toDate}
        setToDate={setToDate}
        fromDate={fromDate}
        setFromDate={setFromDate}
        client={client}
        setClient={setClient}
        projectMemo={projectMemo}
        setProjectMemo={setProjectMemo}
        country={country}
        setCountry={setCountry}
        gender={gender}
        setGender={setGender}
        ageLower={ageLower}
        setAgeLower={setAgeLower}
        ageUpper={ageUpper}
        setAgeUpper={setAgeUpper}
        constraint={constraint}
        setConstraint={setConstraint}
        resetFilter={resetFilter}
      />}
      <ReportsTable
        optimization={state.optimization}
        marketSurvey={state.marketSurvey}
        filter={isEmpty(filter) ? undefined : filter}
        toggleAdvanceSearch={toggleAdvanceSearch}
      />
    </div>
  );
};

export default ReportRequestList;
