import * as React from 'react';
import { ErrorComponent } from './ErrorComponent';
import { WithTranslation, withTranslation } from 'react-i18next';
import FormSectionHeader from 'components/FormSectionHeader';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

interface Props extends WithTranslation {
  setFieldValue: Function;
  errors: any;
  touched: any;
  values: any;
}

class PQ extends React.Component<Props> {
  render() {
    const { setFieldValue, values, t } = this.props;
    const pqValues = [1, 2, 3, 4, 5, 6, 7];

    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}
        >
          <FormSectionHeader text={`${t('reviews.perceivedQuality')}*`} />
          <RadioGroup
            row
            value={values.productReview.perceivedQuality}
            onChange={e =>
              setFieldValue('productReview.perceivedQuality', (e.target as HTMLInputElement).value)
            }
            style={{marginLeft: 20}}
          >
            {pqValues.map(value => (
              <FormControlLabel
                control={<Radio color="secondary" />}
                label={value}
                value={value.toString()}
                key={value}
                style={{marginBottom: 0}}
              />
            ))}
          </RadioGroup>
        </div>
        <ErrorComponent {...this.props} errorType="perceivedQuality" />
      </div>
    );
  }
}

export default withTranslation()(PQ);
