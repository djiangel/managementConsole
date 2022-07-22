import * as React from 'react';
import FieldTextInput from '../../components/FieldTextInput';
import { Field } from 'redux-form';
import MaterialButton from '../../components/MaterialButton';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../styles/theme';
import BootstrapTable from 'react-bootstrap-table-next';

const styles = require('./HeavyUser.module.css');

const UserInfo = ({ data }) => {
  const { t } = useTranslation();
  if (!data.user) return <div>User Not Found!</div>;
  if (!data.user.isHeavyUser) return <div>User is not a heavy user yet!</div>;

  const columns = [
    {
      dataField: 'id',
      text: 'Heavy User ID',
      sort: true,
      hidden: true
    },
    {
      dataField: 'tag',
      sort: true,
      text: "Tag"
    },
    {
      dataField: 'categories',
      sort: true,
      text: t('product.productCategory')
    },
    {
      dataField: 'features',
      text: t('product.productFeature'),
      sort: true
    },
    {
      dataField: 'componentBases',
      text: t('product.productComponentBase'),
      sort: true
    },
    {
      dataField: 'componentOthers',
      text: t('product.productComponentOther'),
      sort: true
    }
  ];

  const tableData = data.user.heavyUsersByUserId.nodes.map(node => ({
    id: node.id,
    tag: node.tag,
    categories: node.categories && node.categories.join(','),
    features: node.features && node.features.join(','),
    componentBases: node.componentBases && node.componentBases.join(','),
    componentOthers: node.componentOthers && node.componentOthers.join(',')
  }));

  return (
    <div>
      <BootstrapTable
        keyField="id"
        bordered={false}
        columns={columns}
        data={tableData}
        rowStyle={(_, index) => ({
          backgroundColor: index % 2 ? 'white' : COLORS.PALE_GREY
        })}
        rowClasses={styles.tableRow}
        headerClasses={styles.tableHeader}
        bootstrap4
      />
    </div>
  );
};

const HeavyUserInfo = ({
  handleSubmit,
  submitting,
  pristine,
  invalid,
  data
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className={styles.sectionContainer}>
        <Field
          name="email"
          component={FieldTextInput}
          fullWidth
          label={t('users.email')}
        />
        <Field
          name="username"
          component={FieldTextInput}
          fullWidth
          label={t('users.username')}
        />

        <div className={styles.buttonContainer}>
          <MaterialButton
            variant="outlined"
            disabled={pristine || invalid || submitting}
            onClick={handleSubmit}
            soft
            teal
          >
            Load User Info
          </MaterialButton>
        </div>

        {data && !submitting ? <UserInfo data={data} /> : <div />}
      </div>
    </div>
  );
};

export default HeavyUserInfo;
