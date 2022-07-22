import * as React from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import { Check as CheckIcon } from '@material-ui/icons';
import i18next from 'i18next';
import { COLORS } from '../../styles/theme';
import { useState } from 'react';
import MaterialButton from 'components/MaterialButton';
import { useTranslation } from 'react-i18next';
import graphqlClient from '../../consumers/graphqlClient';
import UpdateUserProfileMutation from '../../graphql/mutations/UpdateUserProfile';
import selectViewerUserId from '../../selectors/viewerUserId';
import ViewerQuery from '../../graphql/queries/ViewerQuery';

const styles = require('./LanguageSelection.module.css');

interface Props {
  viewerUserId: number;
}

const languages = [
  { label: 'English', unicode: 'en' },
  { label: '中文 (简体)', unicode: 'zh' },
  { label: '日本語', unicode: 'ja' }
];

const LanguageSelection: React.FunctionComponent<Props> = ({
  viewerUserId
}) => {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18next.language);

  return (
    <Paper className={styles.container}>
      <h5 className={styles.languageSettingHeader}>
        {t('languages.languageSetting')}
      </h5>
      <h3 className={styles.selectLanguageHeader}>
        {t('languages.selectLanguage')}
      </h3>
      <div className={styles.languagesContainer}>
        {languages.map(language => (
          <div key={language.unicode} className={styles.languageContainer}>
            <span
              className={
                currentLanguage === language.unicode
                  ? styles.languageSelected
                  : styles.languageUnselected
              }
              onClick={() => setCurrentLanguage(language.unicode)}
            >
              {language.label}
            </span>
            {currentLanguage === language.unicode && (
              <CheckIcon fontSize="small" htmlColor={COLORS.AQUA_MARINE} />
            )}
          </div>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <MaterialButton
          color="secondary"
          variant="contained"
          size="large"
          onClick={() => {
            i18next.changeLanguage(currentLanguage).then(() =>
              graphqlClient.mutate({
                mutation: UpdateUserProfileMutation,
                variables: {
                  id: viewerUserId,
                  userPatch: {
                    interfaceLanguage: currentLanguage
                  }
                },
                refetchQueries: [
                  {
                    query: ViewerQuery
                  }
                ]
              })
            );
          }}
        >
          {t('languages.saveSetting')}
        </MaterialButton>
      </div>
    </Paper>
  );
};

const mapStateToProps = state => ({
  viewerUserId: selectViewerUserId(state)
});

export default connect(mapStateToProps)(LanguageSelection);
