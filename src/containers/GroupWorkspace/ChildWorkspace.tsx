import * as React from 'react';
import { LinearProgress, Modal, Paper, IconButton } from '../../material/index';
import { useQuery } from 'react-apollo-hooks';
import AllWorkspacesQuery from '../../graphql/queries/AllWorkspacesQuery';
import { ApolloConsumer } from 'react-apollo';
import FormInputSelect from 'components/FormInputSelect';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { GROUP_PRODUCER_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import FormInput from 'components/FormInput';
import FieldTextInput from '../../components/FieldTextInput';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import MaterialButton from '../../components/MaterialButton';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import { intersectionWith, startsWith } from 'lodash';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Location } from 'history';
import selectWorkspaceProducerName from '../../selectors/workspaceProducerName';
import Select from 'react-select';

const styles = require('./GroupWorkspace.module.css');

export const ChildWorkspace = ({ values, change }) => {
  const { t } = useTranslation();

  const allWorkspacesQuery = useQuery(AllWorkspacesQuery);
  let data = allWorkspacesQuery.data.allProducers.nodes.filter((item) => item.id !== values.selectedParentWorkspace.value).map((item) => ({
    value: item.id,
    label: item.name
  }))

  if (allWorkspacesQuery.loading) {
    return <LinearProgress />;
  }

  if (allWorkspacesQuery.error) {
    return <div>Error Occured!</div>;
  }

  return (
    <div>
        <Field
            name="selectedChildWorkspace"
            component={Select}
            customLabel
            labelText="Child Workspaces"
            // options={data !== '' ? allWorkspacesQuery.data.allProducers.nodes.filter((item) => item.id !== data).map((item) => ({
            //     value: item.id,
            //     label: item.name
            //   })): allWorkspacesQuery.data.allProducers.nodes.map((item) => ({
            //     value: item.id,
            //     label: item.name
            //   }))}
            options={data}
            isSearchable
            isClearable
            isMulti
            checkbox
          />
      </div>
  );
};

const mapStateToProps = state => ({
  values: getFormValues(GROUP_PRODUCER_FORM)(state)
});

export default connect(mapStateToProps)(ChildWorkspace);

