import * as React from 'react';
import Modal from '../Modal';
import * as moment from 'moment';
import { DatePicker } from 'components/DatePicker/DatePicker';
import { Formik } from 'formik';
import { Moment } from "moment";

interface ExtendPanelTimeModalProps {
  showExtendPanelTime: boolean;
  setShowExtendPanelTime: (a: boolean) => void;
  newPanelEndTime: Moment;
  setNewPanelEndTime: (a: Date) => void;
  handleExtendPanel: (a: moment.Moment) => void;
}

const ExtendPanelTimeModal: React.FunctionComponent<
  ExtendPanelTimeModalProps
> = ({ showExtendPanelTime, setShowExtendPanelTime, handleExtendPanel }) => (
  <Formik
    initialValues={{
      panelEndTime: moment()
    }}
    validate={values => {
      const errors: any = {};
      if (values.panelEndTime.isBefore(moment())) {
        errors.panelEndTime = 'End time must be in the future.';
      }

      return errors;
    }}
    onSubmit={(values, actions) => {
      actions.setSubmitting(true);
      handleExtendPanel(values.panelEndTime);
      setShowExtendPanelTime(false);
      actions.setSubmitting(false);
    }}
    render={props => (
      <Modal
        title="Extend Panel Time"
        open={showExtendPanelTime}
        primaryAction={{
          action: props.handleSubmit,
          disabled: props.isSubmitting || !props.isValid,
          content: 'Extend Panel Time'
        }}
        onClose={() => setShowExtendPanelTime(false)}
      >
        <strong>{props.errors && props.errors.panelEndTime}</strong>
        <DatePicker
          label="New End Date and Time"
          value={props.values.panelEndTime}
          setValue={v => props.setFieldValue('panelEndTime', v)}
        />
      </Modal>
    )}
  />
);

export default ExtendPanelTimeModal;
