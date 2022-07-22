import * as React from 'react';
import { upperFirst } from 'lodash';
import { useTranslation } from 'react-i18next';
import FormInputTag from '../../../components/FormInputTag';

const styles = require('./ProductCard.module.css');

interface Props {
  productTags: any[];
}

const RenderProductTag: React.FunctionComponent<Props> = ({ productTags }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.tag}>
      {productTags.length === 0 ? (
        t('general.noTagSelected')
      ) : (
        <FormInputTag
          defaultTags={productTags.map(productTag => ({
            label: productTag.tagByTagId.tag.toLowerCase(),
            id: productTag.tagByTagId.id.toString()
          }))}
          readOnly
          uneditable
        />
      )}
    </div>
  );
};

export default RenderProductTag;
