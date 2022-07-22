import React, { useState } from 'react';
import { Field } from 'redux-form';
import { withTranslation } from 'react-i18next';
import { useQuery } from 'react-apollo-hooks';
import LinearProgress from '@material-ui/core/LinearProgress';
import styles from './AddUserToWorkspaceContainer.module.css';
import FieldTextInput from '../../components/FieldTextInput';
import MaterialButton from '../../components/MaterialButton';
import AllWorkspacesQuery from '../../graphql/queries/AllWorkspacesQuery';
import FormInputSelect from '../../components/FormInputSelect';
import FormInput from '../../components/FormInput';

const AddUserToWorkspaceContainer = ({
  handleSubmit,
  submitting,
  pristine,
  invalid,
  t
}) => {
  const { loading, error, data } = useQuery(AllWorkspacesQuery);
  const [selectedOption, setSelectedOption] = useState(null);

  const getData = () => {
    return data.allProducers.nodes.map(node => {
      return {
        value: node.id,
        label: node.name
      };
    });
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <h4>Can't load workspaces!</h4>;
  }

  return (
    <div>
      <div className={styles.sectionContainer}>
        <Field
          name="email"
          component={FieldTextInput}
          fullWidth
          label={t('users.email')}
          required
        />
        <Field
          name="producerId"
          component={FormInput}
          inputComponent={FormInputSelect}
          key="producerId"
          className={styles.inputSelect}
          options={!loading && data && data.allProducers ? getData() : null}
          hideSelectedOptions={false}
          placeholder={t('workspace.selectProducerName')}
          closeMenuOnSelect={true}
          required
          value={val => val.value}
        />
      </div>

      <div className={styles.buttonContainer}>
        <MaterialButton
          variant="outlined"
          disabled={pristine || invalid || submitting}
          onClick={handleSubmit}
          soft
          teal
        >
          Submit
        </MaterialButton>
      </div>
    </div>
  );
};

export default withTranslation()(AddUserToWorkspaceContainer);
