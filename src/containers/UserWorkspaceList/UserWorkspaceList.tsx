import * as React from 'react';
import { useState } from 'react';
import FieldTextInput from '../../components/FieldTextInput';
import MaterialButton from '../../components/MaterialButton';
import Result from './Result';
import { useTranslation } from 'react-i18next'

let styles = require('./UserWorkspaceList.module.css');

const UserWorkspaceList = () => {
  const [email, setEmail] = useState('');
  const [showResult, setShowResult] = useState(false);
  const {t} = useTranslation();

  return (
    <div>
      <div className={styles.sectionContainer}>
        <FieldTextInput
          label={t('users.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.buttonContainer}>
        <MaterialButton
          variant="outlined"
          onClick={()=>setShowResult(true)}
          soft
          teal
        >
          {t('admin.viewWorkspaces')}
        </MaterialButton>
      </div>

      {showResult && <Result email={email}/>}
    </div>
  );
}

export default UserWorkspaceList;