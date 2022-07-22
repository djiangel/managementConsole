import * as React from 'react';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Formik } from 'formik';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';
import ProducerByIdQuery from '../../graphql/queries/ProducerByIdQuery';
import { handleStartPanel } from './handleStartPanel';
import { validatePanelForm } from './validatePanelForm';
import PanelCreateForm from './PanelCreateForm';
import selectWorkspaceProducerId from '../../selectors/workspaceProducerId';
import AllTagsQuery from '../../graphql/queries/AllTagsQuery';
import { useTranslation } from 'react-i18next';
import AllWorkspaceGroupQuery from '@graphql/queries/AllWorkspaceGroupQuery';
import { get } from 'lodash';

export function PanelContainer({
  workspaceId,
  panelTagResults,
  producer,
  workspaceGroupResults
}) {
  const { t } = useTranslation();
  let afsWorkspaceBoolean = false;
  if (!workspaceId) {
    return `ERROR: No workspace selected!`;
  } else if (workspaceId == 25) {
    afsWorkspaceBoolean = true;
  }

  const workspaceGroups = get(workspaceGroupResults, 'allParentProducers.nodes', null);

  if (producer.loading) return <div />;

  const reformatTime = value => {
    if (value.minutes() % 15 != 0) {
      value = value.minutes(Math.round(value.minutes() / 15) * 15);
    }

    value =
      !producer.loading &&
      producer.producer &&
      producer.producer.defaultTimezone
        ? momentTZ.tz(value, producer.producer.defaultTimezone)
        : momentTZ.tz(
            value.format('YYYY-MM-DD HH:mm'),
            'YYYY-MM-DD HH:mm',
            momentTZ.tz.guess()
          );

    return value;
  };

  return (
    <div style={{ width: '95%', marginBottom: '2rem' }}>
      <h1>{t('panel.createPanel')}</h1>
      <Formik
        initialValues={{
          products: [],
          name: '',
          startTime: reformatTime(moment()),
          endTime: reformatTime(moment().add('7', 'day')),
          blindPanel: false,
          afsWorkspaceBool: afsWorkspaceBoolean,
          hideReviews: false,
          public: false,
          productSearch: '',
          blindLabels: {},
          panelTags: [],
          showConfirmation: false,
          servingVessels: {},
          behavioralQuestions: {},
          clientNames: {},
          projectNames: {},
          totalCosts: {},
          productionDates: {},
          expirationDates: {}
        }}
        validate={validatePanelForm}
        validateOnBlur={true}
        onSubmit={handleStartPanel}
        render={props => (
          <PanelCreateForm
            {...props}
            producerId={workspaceId}
            panelTagResults={panelTagResults}
            editing={false}
            allowBehavioralQuestions={
              producer.producer && producer.producer.allowBehavioralQuestions
            }
            workspaceGroups={workspaceGroups}
          />
        )}
      />
    </div>
  );
}

type Props = {
  workspaceId: any;
};

const mapStateToProps = state => {
  return {
    workspaceId: selectWorkspaceProducerId(state)
  };
};

export default compose(
  connect(mapStateToProps),
  graphql(ProducerByIdQuery, {
    name: 'producer',
    options: (props: Props) => ({
      variables: {
        id: props.workspaceId
      }
    })
  }),
  graphql(AllTagsQuery, {
    options: (props: Props) => ({
      variables: {
        condition: {
          producerId: props.workspaceId
        }
      }
    }),
    name: 'panelTagResults'
  }),
  graphql(AllWorkspaceGroupQuery, {
    options: (props: Props) => ({
      variables: {
        workspaceId: props.workspaceId
      }
    }),
    name: 'workspaceGroupResults'
  })
)(PanelContainer);
