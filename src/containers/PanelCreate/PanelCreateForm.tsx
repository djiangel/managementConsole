import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Checkbox,
  FormGroup
} from '../../material/index';
import ProductSearchQuery from '@graphql/queries/ProductSearchQuery';
import { DatePicker } from 'components/DatePicker/DatePicker';
import FormikTextField from '../../components/FormikTextInput';
import AutoComplete from './AutoComplete';
import * as _ from 'lodash';
import PanelProductTable from './PanelProductTable';
import { ConfirmationModal } from './ConfirmationModal';
import { Field } from 'formik';
import * as moment from 'moment';
import { useTranslation } from 'react-i18next';
import FormInput from '../../components/FormInput';
import FormInputTag from '../../components/FormInputTag';
import { RouteLeavingGuard } from '../../guards/RouteLeavingGuard/RouteLeavingGuard';
import history from 'constants/routerHistory';
import MaterialButton from 'components/MaterialButton';
import * as momentTZ from 'moment-timezone';
import { FormControl, Radio, RadioGroup } from '@material-ui/core';
import { useState } from 'react';
import ProductGroupSearchQuery from "@graphql/queries/ProductGroupSearchQuery";
const styles = require('./PanelCreate.module.css');

interface Props {
  handleSubmit: Function;
  values: any;
  setFieldValue: Function;
  errors: any;
  isValid: boolean;
  isSubmitting: boolean;
  producerId: number;
  editing: boolean;
  panelTagResults: any;
  dirty: boolean;
  handleDeletePanel?: Function;
  isEditPanel?: boolean;
  allowBehavioralQuestions: boolean;
  workspaceGroups?: any[];
}

const PanelCreateForm: React.FunctionComponent<Props> = ({
  handleSubmit,
  values,
  setFieldValue,
  errors,
  isValid,
  isSubmitting,
  producerId,
  editing,
  panelTagResults,
  dirty,
  handleDeletePanel,
  isEditPanel,
  allowBehavioralQuestions,
  workspaceGroups
}) => {
  const { t } = useTranslation();
  const [selectedGroupId, setSelectedGroupId] = useState('0');

  let inAFSWorkspace = false;
  if (producerId == 25) {
    inAFSWorkspace = true;
  }

  return (
    <React.Fragment>
      <RouteLeavingGuard
        when={dirty && !values.showConfirmation}
        navigate={path => history.push(path)}
        shouldBlockNavigation={location => {
          return !!dirty;
        }}
      />
      <Card className={styles.leftCard}>
        <CardHeader title={t('panel.configurations')} />
        <CardContent>
          <FormGroup>
            <Field
              component={FormikTextField}
              name="name"
              label={t('panel.panelName')}
            />

            <br />
            {/* <small style={{ marginBottom: '1rem' }}>{t('panel.optional')}</small> */}
            <Field
              name="panelTag"
              labelText={t('panel.panelTag')}
              component={FormInput}
              inputComponent={FormInputTag}
              customLabel
              placeholder="Click to select or add"
              allowDeleteFromEmptyInput={false}
              suggestions={
                panelTagResults &&
                panelTagResults.tags &&
                panelTagResults.tags.nodes.map(e => ({
                  label: e.tag.toLowerCase(),
                  id: '' + e.id
                }))
              }
              input={{
                value: values.panelTags,
                onChange: e => {
                  setFieldValue('panelTags', e);
                }
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.blindPanel}
                  onChange={e => setFieldValue('blindPanel', e.target.checked)}
                  color="secondary"
                />
              }
              label={t('panel.blindPanel')}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.hideReviews}
                  onChange={e => {
                    setFieldValue('hideReviews', e.target.checked);
                    if (e.target.checked) {
                      setFieldValue('blindPanel', e.target.checked);
                    }
                  }}
                  color="secondary"
                />
              }
              label={t('panel.hideReviewHistory')}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.public}
                  onChange={e => setFieldValue('public', e.target.checked)}
                  color="secondary"
                />
              }
              label={t('panel.publicPanel')}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.texture}
                  onChange={e => setFieldValue('texture', e.target.checked)}
                  color="secondary"
                />
              }
              label={t('panel.mandatoryTexture')}
            />
          </FormGroup>
        </CardContent>
      </Card>

      <Card className={styles.rightCard}>
        <CardHeader
          title={t('panel.dateTime')}
          subheader={t('panel.setPanelTime')}
        />
        <CardContent>
          <div className={styles.dateContainer}>
            <DatePicker
              label={t('panel.startDate')}
              value={values.startTime}
              setValue={d => setFieldValue('startTime', d)}
              onTimezoneChange={tz =>
                setFieldValue(
                  'endTime',
                  momentTZ.tz(
                    values.endTime.format('YYYY-MM-DD HH:mm'),
                    'YYYY-MM-DD HH:mm',
                    tz
                  )
                )
              }
            />
            <DatePicker
              label={t('panel.endDate')}
              value={values.endTime}
              setValue={d => setFieldValue('endTime', d)}
            />
          </div>
          <span className={styles.error}>{errors.startTime}</span>
        </CardContent>
      </Card>

      {workspaceGroups && workspaceGroups.length > 0 && (
        <Card className={styles.card}>
          <CardHeader
            title="Use Workspace Groups"
            subheader="Select a workspace group to include products from all workspaces within the group"
          />
          <CardContent>
            <RadioGroup
              row
              value={selectedGroupId}
              onChange={(_, value) => setSelectedGroupId(value)}
            >
              <FormControlLabel
                control={<Radio />}
                label="None"
                value="0" // Use ID 0 as None
              />
              {workspaceGroups.map(group => (
                <FormControlLabel
                  key={group.id}
                  value={group.id.toString()}
                  control={<Radio />}
                  label={group.groupName}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      <Card className={styles.card}>
        <CardHeader title={t('panel.searchProduct')} />
        <CardContent>
          <AutoComplete
            query={selectedGroupId === '0' ? ProductSearchQuery : ProductGroupSearchQuery}
            onClick={p => {
              setFieldValue('products', values.products.concat(p));
            }}
            products={values.products || []}
            producerId={producerId}
            groupId={selectedGroupId !== '0' && parseInt(selectedGroupId)}
          />
          <PanelProductTable
            data={values.products}
            onClickRow={p => {
              setFieldValue(
                'products',
                values.products.filter(x => x.name !== p.name)
              );
              values.blindLabels = _.pickBy(values.blindLabels, function(
                value,
                key
              ) {
                if (key != p.id) {
                  return { key: value };
                }
              });

              setFieldValue(
                'products',
                values.products.filter(x => x.name !== p.name)
              );
              values.servingVessels = _.pickBy(values.servingVessels, function(
                value,
                key
              ) {
                if (key != p.id) {
                  return { key: value };
                }
              });

              setFieldValue(
                'products',
                values.products.filter(x => x.name !== p.name)
              );
              values.clientNames = _.pickBy(values.clientNames, function(
                value,
                key
              ) {
                if (key != p.id) {
                  return { key: value };
                }
              });

              setFieldValue(
                'products',
                values.products.filter(x => x.name !== p.name)
              );
              values.behavioralQuestions = _.pickBy(
                values.behavioralQuestions,
                function(value, key) {
                  if (key != p.id) {
                    return { key: value };
                  }
                }
              );

              setFieldValue(
                'products',
                values.products.filter(x => x.name !== p.name)
              );
              values.projectNames = _.pickBy(values.projectNames, function(
                value,
                key
              ) {
                if (key != p.id) {
                  return { key: value };
                }
              });

              setFieldValue(
                'products',
                values.products.filter(x => x.name !== p.name)
              );
              values.totalCosts = _.pickBy(values.totalCosts, function(
                value,
                key
              ) {
                if (key != p.id) {
                  return { key: value };
                }
              });
              setFieldValue(
                'products',
                values.products.filter(x => x.name !== p.name)
              );
              values.expirationDates = _.pickBy(
                values.expirationDates,
                function(value, key) {
                  if (key != p.id) {
                    return { key: value };
                  }
                }
              );
              setFieldValue(
                'products',
                values.products.filter(x => x.name !== p.name)
              );
              values.productionDates = _.pickBy(
                values.productionDates,
                function(value, key) {
                  if (key != p.id) {
                    return { key: value };
                  }
                }
              );
            }}
            onRowDragged={(removeIndex, draggedItem, index) => {
              const newProds = [];
              values.products.forEach(function(item) {
                newProds.push(item);
              });
              newProds.splice(removeIndex, 1);
              newProds.splice(index, 0, draggedItem);
              setFieldValue('products', newProds);
            }}
            blindPanel={values.blindPanel || values.hideReviews}
            setBlindLabel={(val, product) => {
              setFieldValue(`blindLabels.${product}`, val);
            }}
            afsWorkspaceBool={inAFSWorkspace}
            setServingVessel={(val, product) => {
              setFieldValue(`servingVessels.${product}`, val);
            }}
            setBehavioralQuestions={(val, product) => {
              setFieldValue(`behavioralQuestions.${product}`, val);
            }}
            setClientName={(val, product) => {
              setFieldValue(`clientNames.${product}`, val);
            }}
            setProjectName={(val, product) => {
              setFieldValue(`projectNames.${product}`, val);
            }}
            setTotalCost={(val, product) => {
              setFieldValue(`totalCosts.${product}`, val);
            }}
            setProductionDate={(val, product) => {
              setFieldValue(`productionDates.${product}`, val);
            }}
            setExpirationDate={(val, product) => {
              setFieldValue(`expirationDates.${product}`, val);
            }}
            blindLabels={values.blindLabels}
            servingVessels={values.servingVessels}
            clientNames={values.clientNames}
            projectNames={values.projectNames}
            totalCosts={values.totalCosts}
            productionDates={values.productionDates}
            expirationDates={values.expirationDates}
            behavioralQuestions={values.behavioralQuestions}
            editable={true}
            allowBehavioralQuestions={allowBehavioralQuestions}
            editing={editing}
          />

          <span className={styles.error}>{errors.blindLabel}</span>
          <span className={styles.error}>{errors.products}</span>
        </CardContent>
      </Card>

      <div className={styles.submitBtn}>
        <MaterialButton
          onClick={() => setFieldValue('showConfirmation', true)}
          disabled={isSubmitting || !isValid}
          variant="outlined"
          soft
          teal
        >
          {editing
            ? t('panel.updatePanel')
            : values.startTime.isBetween(
                moment().subtract('10', 'minutes'),
                moment().add('10', 'minutes')
              )
              ? t('panel.beginPanel')
              : t('panel.schedulePanel')}
        </MaterialButton>
        {isEditPanel && (
          <MaterialButton
            color="secondary"
            variant="outlined"
            soft
            onClick={() => handleDeletePanel()}
          >
            Delete Panel
          </MaterialButton>
        )}
      </div>
      <ConfirmationModal
        inAFSWorkspace={inAFSWorkspace}
        values={values}
        handleSubmit={handleSubmit}
        setFieldValue={setFieldValue}
        isSubmitting={isSubmitting}
        open={values.showConfirmation}
        onClose={() => setFieldValue('showConfirmation', false)}
        editing={editing}
        allowBehavioralQuestions={allowBehavioralQuestions}
      />
    </React.Fragment>
  );
};

export default PanelCreateForm
