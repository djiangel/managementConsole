import * as React from 'react';
import { pick } from 'lodash';
import { PRODUCT_CLASS_ATTRIBUTES } from '../../../constants/productClassAttributes';
import { Card, CardHeader, CardContent } from '../../../material/index';
import RenderProductClassAttributes from './RenderProductClassAttributes';
import useStyles from 'containers/ProductCreate/ProductClassAttributes/useStyles';
import { useTranslation } from "react-i18next";

interface Props {
  productClass: string;
}

const ProductClassAttributes: React.FunctionComponent<Props> = ({
  productClass
}) => {
  const currentProductClassAttributes = pick(PRODUCT_CLASS_ATTRIBUTES, [
    productClass
  ])[productClass];
  const classes = useStyles();
  const {t} = useTranslation();

  return (
    <div>
      {currentProductClassAttributes ? (
        <Card className={classes.root}>
          <CardHeader
            classes={{
              title: classes.cardTitle,
              subheader: classes.cardSubheader
            }}
            title={productClass}
            subheader={t('product.defaultAttributes')}
          />
          <CardContent>
            <RenderProductClassAttributes
              productClass={productClass}
              currentProductClassAttributes={currentProductClassAttributes}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default ProductClassAttributes;
