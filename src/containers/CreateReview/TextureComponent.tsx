import * as React from 'react';
import { Fragment } from 'react';
import { Token, Typeahead } from 'react-bootstrap-typeahead';
import { WithTranslation, withTranslation } from 'react-i18next';
import RadioGroup from '@material-ui/core/RadioGroup';
import MaterialRadio from 'components/MaterialRadio';
import i18next from 'i18next';
import textures from '../../constants/textures';

const styles = require('./ReferenceFlavorComponent.module.css');

interface Props extends WithTranslation {
  values?: any;
  setFieldValue?: Function;
}

const options = textures.map(texture => ({
  label: i18next.t(`textures.${texture.label}`),
  value: texture.label
}));

class Textures extends React.Component<Props> {
  handleSelectedTexture = (texture, sentiment) => {
    const { values, setFieldValue } = this.props;
    const currentTextures = values.productReview.textures
    //this check is to handle custom textures
    if (options.find(tex => texture === tex.value)) {
      const selectedTexture = currentTextures.filter(item => {
        //this check is to change the sentiment of existing textures
        if (item.value === texture) {
          (item.value = texture),
            (item.sentiment = sentiment),
            (item.customOption = false);
          return item;
        } else {
          //Add the texture if it not selected
          return {
            value: texture,
            sentiment: sentiment,
            customOption: false
          };
        }
      });
      setFieldValue('productReview.textures', selectedTexture);
    } else {
      const selectedTexture = currentTextures
        .filter(item => {
          if (item.value == texture) {
            (item.value = texture),
              (item.sentiment = sentiment),
              (item.customOption = true);
            return item;
          } else {
            return {
              value: texture,
              sentiment: sentiment,
              customOption: true
            };
          }
        });
      setFieldValue('productReview.textures', selectedTexture);
    }
  };

  renderTextures = () => {
    const { t, values } = this.props;
    const selectedTextures = values.productReview.textures;

    if (selectedTextures) {
      return selectedTextures.map(item => {
        return (
          <div key={item.value} className={styles.container}>
            <div className={styles.referenceFlavorText}>
              {item.customOption
                ? item.value
                : t(`textures.${item.value}`)}
            </div>
            <div>
              <RadioGroup
                row
                defaultValue={String(item.sentiment)}
                onChange={(e) =>
                  this.handleSelectedTexture(
                    item.value,
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
    const { setFieldValue, values, t } = this.props;
    const selectedTextures = values.productReview.textures;
    return (
      <Fragment>
        <Typeahead
          id="textures"
          bsSize="small"
          allowNew={true}
          options={options}
          placeholder={t('reviews.selectTexture')}
          multiple
          newSelectionPrefix={t('reviews.addTexture')}
          onChange={selected => {
            selected = selected.map(item => {
              const curr = selectedTextures.find(tex => tex.value === item.value || (item.customOption && tex.value === item.label))
              if (curr) {
                return curr
              }
              if (item.customOption) {
                return {
                  value: item.label,
                  sentiment: 0,
                  customOption: true
                };
              } else {
                item.sentiment = 0;
                return item;
              }
            });
            setFieldValue('productReview.textures',
              selected
            );
          }}
          renderToken={(option, props, index) => (
            <Token
              key={index}
              onRemove={props.onRemove}
              className={styles.token}
            >
              {option.customOption
                ? option.label
                : t(`textures.${option.value}`)}
            </Token>
          )}
          renderMenuItemChildren={option => (
            <div
              style={{ color: 'black', fontSize: 11 }}
              id={option.referenceFlavor}
            >
              {/*translation for textures*/}
              {t(`textures.${option.value}`)}
            </div>
          )}
        />
        {this.renderTextures()}
      </Fragment>
    );
  }
}

export default withTranslation()(Textures);