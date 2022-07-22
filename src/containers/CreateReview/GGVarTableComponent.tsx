import * as React from "react";
import "react-bootstrap-typeahead/css/Typeahead.css";
import ReferenceFlavor from "./ReferenceFlavorComponent";
import { Typeahead } from "react-bootstrap-typeahead";
import { WithTranslation, withTranslation } from "react-i18next";

const styles = require('./GGVarTableComponent.module.css');

interface Props extends WithTranslation {
  setFieldValue: Function;
  initialValues: any;
  handleBlur: Function;
}

interface State {
  multiple: boolean;
  allowNew: boolean;
  isLoading: boolean;
  options: any;
  selectedReferenceFlav: any;
}

class GGVarTable extends React.Component<Props, State> {
  state = {
    multiple: false,
    allowNew: false,
    isLoading: false,
    options: [],
    selectedReferenceFlav: []
  };

  renderGGVars = () => {
    let { setFieldValue, initialValues, t } = this.props;
    const intensity = [
      { label: '0', value: '0' },
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' }
    ];
    return initialValues.GGVars.map(item => {
      return (
        <tr key={item.flavorAttributeIntensities.ggvar}>
          <td className={styles.flavorAttribute}>
            {t(`ggvar.${item.flavorAttributeIntensities.ggvar}`)}
          </td>
          <td style={{width: '20%'}}>
            <Typeahead
              clearButton
              bsSize="small"
              id={`productReview.${item.flavorAttributeIntensities.ggvar}`}
              options={intensity}
              align="left"
              placeholder="(0-5)"
              name={`productReview.${item.flavorAttributeIntensities.ggvar}`}
              onChange={selected => {
                if (selected.length > 0) {
                  setFieldValue(
                    `productReview.${item.flavorAttributeIntensities.ggvar}`,
                    Number(selected[0].value)
                  );
                }
              }}
              renderMenuItemChildren={option => (
                <div style={{ color: 'black', fontSize: 11 }} id={option.label}>
                  {option.label}
                </div>
              )}
              labelKey="label"
              onBlur={this.props.handleBlur(
                `productReview.${item.flavorAttributeIntensities.ggvar}`
              )}
            />
          </td>
          {item.referenceFlavors ? (
            <td style={{ width: '60%' }}>
              <ReferenceFlavor
                flavor={item.flavorAttributeIntensities.ggvar}
                refFlav={item.referenceFlavors}
                {...this.props}
              />
            </td>
          ) : (
            <td/>
          )}
        </tr>
      );
    });
  };

  render() {
    const { t } = this.props;

    return (
      <table className={styles.container}>
        <thead>
          <tr>
            <th>GGVar</th>
            <th>{t('reviews.intensityScale')}</th>
            <th>{t('reviews.referenceFlavorSentiment')}</th>
          </tr>
        </thead>
        <tbody>{this.renderGGVars()}</tbody>
      </table>
    );
  }
}
export default withTranslation()(GGVarTable);
