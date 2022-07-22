import * as React from 'react';
import { Fragment } from 'react';
import { Token, Typeahead } from 'react-bootstrap-typeahead';
import { WithTranslation, withTranslation } from 'react-i18next';
import RadioGroup from '@material-ui/core/RadioGroup';
import MaterialRadio from 'components/MaterialRadio';

const styles = require('./ReferenceFlavorComponent.module.css');

interface Props extends WithTranslation {
  refFlav: any;
  values?: any;
  flavor: string;
  setFieldValue?: Function;
}

class ReferenceFlavor extends React.Component<Props> {
  handleSelectedReferenceFlavor = (refFlavor, sentiment) => {
    let { refFlav, values, flavor, setFieldValue } = this.props;
    //this check is to handle custom reference flavors
    if (
      refFlav.indexOf(refFlav.find(fla => fla.referenceFlavor === refFlavor)) >
      -1
    ) {
      let selectedFlav = this.props.values.productReview.referenceFlavors[
        `${flavor}`
      ].filter(item => {
        //this check is to change the sentiment of existing reference flavor
        if (item.referenceFlavor === refFlavor) {
          (item.referenceFlavor = refFlavor),
            (item.sentiment = sentiment),
            (item.custom = false);
          return item;
        } else {
          //Add the reference flavor if it not selected
          return {
            referenceFlavor: refFlavor,
            sentiment: sentiment,
            custom: false
          };
        }
      });
      setFieldValue('productReview.referenceFlavors', {
        ...values.productReview.referenceFlavors,
        [`${flavor}`]: [...selectedFlav]
      });
    } else {
      let selectedFlav = this.props.values.productReview.referenceFlavors[
        `${flavor}`
      ].filter(item => {
        if (item.referenceFlavor == refFlavor) {
          (item.referenceFlavor = refFlavor),
            (item.sentiment = sentiment),
            (item.custom = true);
          return item;
        } else {
          return {
            referenceFlavor: refFlavor,
            sentiment: sentiment,
            custom: true
          };
        }
      });
      setFieldValue('productReview.referenceFlavors', {
        ...values.productReview.referenceFlavors,
        [`${flavor}`]: [...selectedFlav]
      });
    }
  };

  renderReferenceFlavor = () => {
    const { flavor, t } = this.props;
    let selectedReferenceFlav = this.props.values.productReview
      .referenceFlavors[`${this.props.flavor}`];

    if (selectedReferenceFlav) {
      return selectedReferenceFlav.map(item => {
        return (
          <div key={item.referenceFlavor} className={styles.container}>
            <div className={styles.referenceFlavorText}>
              {item.custom
              ? item.referenceFlavor
              : t(`referenceFlavors.${flavor}.${item.referenceFlavor}`)}
            </div>
            <div>
              <RadioGroup
                row
                defaultValue={String(item.sentiment)}
                onChange={(e) =>
                  this.handleSelectedReferenceFlavor(
                    item.referenceFlavor,
                    Number((e.target as HTMLInputElement).value)
                  )
                }
              >
                <MaterialRadio
                  label={t('reviews.neutral')}
                  value="0"
                  key="Neutral"
                />
                <MaterialRadio
                  label={t('reviews.positive')}
                  value="1"
                  key="Positive"
                />
                <MaterialRadio
                  label={t('reviews.negative')}
                  value="-1"
                  key="Negative"
                />
              </RadioGroup>
            </div>
          </div>
        );
      });
    }
  };

  render() {
    let { setFieldValue, values, refFlav, flavor, t } = this.props;
    const selectedFlav = values.productReview.referenceFlavors[flavor]
    return (
      <Fragment>
        <Typeahead
          id={flavor}
          labelKey="referenceFlavor"
          bsSize="small"
          allowNew={true}
          options={refFlav}
          placeholder={t('reviews.selectReferenceFlavor')}
          multiple
          newSelectionPrefix={t('reviews.addReferenceFlavor')}
          onChange={selected => {
            selected = selected.map(item => {
              const curr = selectedFlav && selectedFlav.find(tex => tex.referenceFlavor === item.referenceFlavor || (item.customOption && tex.referenceFlavor === item.label))
              if (curr) {
                return curr
              }
              if (item.customOption) {
                return {
                  referenceFlavor: item.referenceFlavor,
                  sentiment: 0,
                  custom: 'true'
                };
              } else {
                item.sentiment = 0;
                return item;
              }
            });
            setFieldValue('productReview.referenceFlavors', {
              ...values.productReview.referenceFlavors,
              [`${flavor}`]: [...selected]
            });
          }}
          renderToken={(option, props, index) => (
            <Token
              key={index}
              onRemove={props.onRemove}
              className={styles.token}
            >
              {option.customOption
              ? option.referenceFlavor
              : t(`referenceFlavors.${flavor}.${option.referenceFlavor}`)}
            </Token>
          )}
          renderMenuItemChildren={option => (
            <div
              style={{ color: 'black', fontSize: 11 }}
              id={option.referenceFlavor}
            >
              {/*translation for referenceFlavor*/}
              {t(`referenceFlavors.${flavor}.${option.referenceFlavor}`)}
            </div>
          )}
        />
        {this.renderReferenceFlavor()}
      </Fragment>
    );
  }
}

export default withTranslation()(ReferenceFlavor);
