import * as React from 'react';
import { Field } from 'redux-form';
import MaterialButton from '../../components/MaterialButton';
import { useTranslation } from 'react-i18next';
import FormInputSelect from '../../components/FormInputSelect';
import FormInput from '../../components/FormInput';
import AllProductCategoriesQuery from '../../graphql/queries/AllProductCategoriesQuery';
import AllProductFeaturesQuery from '../../graphql/queries/AllProductFeaturesQuery';
import AllProductComponentBasesQuery from '../../graphql/queries/AllProductComponentBasesQuery';
import AllProductComponentOthersQuery from '../../graphql/queries/AllProductComponentOthersQuery';
import { useQuery } from 'react-apollo-hooks';
import { LinearProgress } from '../../material/index';
import DescriptionIcon from '@material-ui/icons/Description';
import CSVReader from 'react-csv-reader';
import FieldTextInput from '../../components/FieldTextInput';

const styles = require('./HeavyUserTag.module.css');

const HeavyUserTag = ({
  handleSubmit,
  submitting,
  pristine,
  invalid,
  producerId,
  change,
  notFoundUsers
}) => {
  const { t } = useTranslation();
  const [error, setError] = React.useState(false);

  const allProductCategoriesQuery = useQuery(AllProductCategoriesQuery, {
    variables: {
      condition: {
        producerId: producerId
      }
    }
  });
  const allProductFeaturesQuery = useQuery(AllProductFeaturesQuery, {
    variables: {
      condition: {
        producerId: producerId
      }
    }
  });
  const allProductComponentBasesQuery = useQuery(
    AllProductComponentBasesQuery,
    {
      variables: {
        condition: {
          producerId: producerId
        }
      }
    }
  );
  const allProductComponentOthersQuery = useQuery(
    AllProductComponentOthersQuery,
    {
      variables: {
        condition: {
          producerId: producerId
        }
      }
    }
  );

  if (
    allProductCategoriesQuery.loading ||
    allProductComponentBasesQuery.loading ||
    allProductFeaturesQuery.loading ||
    allProductComponentOthersQuery.loading
  ) {
    return <LinearProgress />;
  }

  return (
    <div style={{ width: '100%' }}>
      <div className={styles.sectionContainer}>
        <div className={styles.sampleFileContainer}>
          <a
            href={require('../../../public/assets/heavy_users_sample.csv')}
            download="heavy_users_sample"
          >
            <DescriptionIcon />
            <u>Sample CSV File</u>
          </a>
        </div>

        {error && (
          <div className={styles.fileError}>
            File is not in the right format!
          </div>
        )}

        <Field
          name="usersFromCsv"
          component={CSVReader}
          onFileLoaded={(data, fileInfo) => {
            if (!data[0].user) {
              change('usersFromCsv', []);
              setError(true);
            } else {
              setError(false);
              change('usersFromCsv', data);
            }
          }}
          parserOptions={{
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            transformHeader: header => header.toLowerCase().replace(/\W/g, '_')
          }}
        />

        <Field
          name="tag"
          component={FieldTextInput}
          fullWidth
          label={t('admin.tag')}
          required
        />

        <Field
          name="categories"
          component={FormInput}
          inputComponent={FormInputSelect}
          key="categories"
          labelText={t('product.productCategory')}
          options={allProductCategoriesQuery.data.productCategories.nodes.map(
            item => ({
              value: item.id,
              label: item.name
            })
          )}
          isSearchable
          isClearable
          isMulti
          placeholder={t('product.productCategory')}
          customLabel
          checkbox
        />
        <Field
          name="features"
          component={FormInput}
          inputComponent={FormInputSelect}
          key="features"
          labelText={t('product.productFeature')}
          options={allProductFeaturesQuery.data.productFeatures.nodes.map(
            item => ({
              value: item.id,
              label: item.name
            })
          )}
          isSearchable
          isClearable
          isMulti
          placeholder={t('product.productFeature')}
          customLabel
          checkbox
        />
        <Field
          name="componentBases"
          component={FormInput}
          inputComponent={FormInputSelect}
          key="componentBases"
          labelText={t('product.productComponentBase')}
          options={allProductComponentBasesQuery.data.productComponentBases.nodes.map(
            item => ({
              value: item.id,
              label: item.name
            })
          )}
          isSearchable
          isClearable
          isMulti
          placeholder={t('product.productComponentBase')}
          customLabel
          checkbox
        />
        <Field
          name="componentOthers"
          component={FormInput}
          inputComponent={FormInputSelect}
          key="componentOthers"
          labelText={t('product.productComponentOther')}
          options={allProductComponentOthersQuery.data.productComponentOthers.nodes.map(
            item => ({
              value: item.id,
              label: item.name
            })
          )}
          isSearchable
          isClearable
          isMulti
          placeholder={t('product.productComponentOther')}
          customLabel
          checkbox
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
      {notFoundUsers &&
        notFoundUsers.length > 0 && (
          <div>
            <div>These following users are not found:</div>
            <table className={styles.notFoundTable}>
              {notFoundUsers.map((user, i) => (
                <tr>
                  <td>{i + 1}</td>
                  <td>{user}</td>
                </tr>
              ))}
            </table>
          </div>
        )}
    </div>
  );
};

export default HeavyUserTag;
