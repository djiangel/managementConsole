import * as React from 'react';
import { LinearProgress, Modal, Paper, IconButton } from '../../material/index';
import { useQuery } from 'react-apollo-hooks';
import AllWorkspacesQuery from '../../graphql/queries/AllWorkspacesQuery';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { GROUP_PRODUCER_FORM } from '../../constants/formNames';
import formSubmit from '../../actions/formSubmit';
import FieldTextInput from '../../components/FieldTextInput';
import { connect, formValueSelector } from 'react-redux';
import MaterialButton from '../../components/MaterialButton';
import { Location } from 'history';
import Select from 'react-select';
import withStyles from '@material-ui/core/styles/withStyles';
import AllGroups from './AllGroups';
import { isValid } from 'date-fns';

const styles = require('./GroupWorkspace.module.css');

interface Props {
  submitting: boolean;
  pristine: boolean;
  invalid: boolean;
  handleSubmit: () => void;
  submitted: boolean;
  change: (field: string, value: any) => void;
  producerId: number;
  reset: () => void;
  searchFilter?: any;
  versionNo: any;
  clearFields: any;
  workspaces: any;
  location: Location;
}

const required = value => value ? undefined : 'The Group Name is Required';
const requiredAtLeastOne = value => value && value.length > 0  ? undefined : 'Children must pe selected';

const validate = values => {
  const errors = {};

  if (!(values.selectedChildWorkspaces &&  values.selectedChildWorkspaces.length > 0)) {
    errors['selectedChildWorkspaces'] = "Required";
  }
  
  if (!(values.groupName.length > 0)) {
    errors['groupName'] = "Required";
  }
  ''
  return errors;
}

const GroupWorkspace: React.FunctionComponent<Props> = ({
  submitting,
  handleSubmit,
  invalid,
  pristine,
  submitted,
  change,
}) => {
  const { t } = useTranslation();
  const [selectedChildWorkspaces, setSelectedChildWorkspaces] = React.useState([]);
  const [childWorkspace, setChildWorkspaces] = React.useState([]);
  const [selectedParentWorkspace, setParentWorkspaces] = React.useState([]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [groupReload, setGroupReload] = React.useState(null);
  const allWorkspacesQuery = useQuery(AllWorkspacesQuery);
  const handleParentWorkspaceChange = (selected) => {
      let data = allWorkspacesQuery.data.allProducers.nodes.filter((item) => selected && item.id !== selected.value).map((item) => ({
        value: item.id,
        label: item.name
      }))
      setParentWorkspaces(selected);
      change("selectedParentWorkspace", selected);
      setChildWorkspaces(data);
  }
  const handleChildWorkspace = (selected) => {
    change("selectedChildWorkspaces", selected)
    setSelectedChildWorkspaces(selected)
    change("resetComponentState", handleResetForm)
  }
  if (allWorkspacesQuery.loading) {
    return <LinearProgress />;
  }
  if (allWorkspacesQuery.error) {
    return <div>Error Occured!</div>;
  }

  const handleEditedGroupWorkSpace = (editedNode) => {

    change("oldNode", {...editedNode});
    handleParentWorkspaceChange({value: editedNode.parentProducer.id, label: editedNode.parentProducer.name});
    handleChildWorkspace([...editedNode.childProducers.nodes.map(item => { return {value: item.producerByChildProducerId.id, label: item.producerByChildProducerId.name}})]);
    change("groupName", editedNode.groupName);
    setIsEditing(true);
  }

  const handleResetForm = () => {
    change("oldNode", null);
    handleParentWorkspaceChange(null);
    handleChildWorkspace([]);
    change("groupName", '');
    setIsEditing(false);
  }

  const handleFormSubmit = () => {
    change("groupReloadFunction", groupReload);
    handleSubmit();
  }
 
  return (
    <Paper className={styles.container}>
        <div className={styles.headerContainer}>
          <div className={styles.headerTextContainer}>
            <h5 className={styles.productHeader}>{isEditing ? 'Update Group Workspaces': 'Group Workspaces'}</h5>
            <h3 className={styles.productTitle}>
              Workspaces
            </h3>
          </div>
          </div>
          <div className={styles.sectionHeader}>
            Parent Workspace
          </div>
          <div style={{paddingTop: 15}}>
          <Select
            name="selectedParentWorkspace"
            options={allWorkspacesQuery.data.allProducers.nodes.map(item => ({
                value: item.id,
                label: item.name
              }))}
            isSearchable={ !isEditing }
            isDisabled={ isEditing }
            isClearable
            value={selectedParentWorkspace}
            onChange={handleParentWorkspaceChange}
          />
          </div>
          <div className={styles.sectionHeader}>
            Child Workspaces
          </div>
          <div style={{paddingTop: 15}}>
           <Select
            name="selectedChildWorkspaces"
            labelText="Child Workspaces"
            options={childWorkspace}
            isSearchable
            onChange={handleChildWorkspace}
            value={selectedChildWorkspaces}
            validate={[requiredAtLeastOne]}
            isClearable
            isMulti
          />
          </div>
          <div className={styles.sectionHeader}>
            Group Name
          </div>
          <Field
            name="groupName"
            component={FieldTextInput}
            fullWidth
            placeholder={'Enter Group Name'}
            label={'Group Name'}
            validate={[required]}
          />
          <div style={{paddingTop: 25}}>
          <MaterialButton
            variant="outlined"
            onClick={() => handleFormSubmit()}
            disabled={pristine || submitting}
            soft
            teal
          >
            {isEditing ? 'Update Group Workspace' :'Group Workspaces'}
          </MaterialButton>
          {isEditing ? <MaterialButton
            variant="outlined"
            onClick={() => handleResetForm()}
            disabled={submitting}
            soft
          >
            Cancel Update
          </MaterialButton>: null}
          </div>
          <div style={{paddingTop: 35}}>
            <AllGroups change={change} reload={[groupReload, setGroupReload]} handleEditGroup={handleEditedGroupWorkSpace} />
          </div>
        </Paper>
  );
};

const mapStateToProps = (state, props) => {
  const values = getFormValues(GROUP_PRODUCER_FORM)(state);
  
  const initialValues = {
    remainingGroups: [],
    selectedParentWorkspace: {},
    selectedChildWorkspaces: [],
    groupName: ''
  };
  return values
    ? {
        selectedParentWorkspace: values.selectedParentWorkspace,
        selectedChildWorkspaces: values.selectedChildWorkspaces,
        groupName: values.groupName,
        initialValues
      }
    : {
        initialValues
      };
};

const validation = val => !val || (typeof val === 'object' && val.length === 0);

export default compose<{}>(
  connect(mapStateToProps),
  withStyles(styles, { withTheme: true }),
  reduxForm({
    form: GROUP_PRODUCER_FORM,
    validate,
    onSubmit: (values, dispatch) => {
      dispatch(formSubmit(GROUP_PRODUCER_FORM));
    }
  })
)(GroupWorkspace);
