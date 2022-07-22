import * as React from 'react';
import { useState } from 'react';
import { StyledContainerDiv } from './StyledComponents';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import InfoIcon from '@material-ui/icons/Info';
import FieldTextInput from '../FieldTextInput';
import { Field } from 'redux-form';
import useStyles from 'components/FormInput/useStyles';

const styles = require('./FormInput.module.css');

interface Props {
  chromeless: boolean;
  className?: string;
  required: boolean;
  descriptionText?: string;
  input?: any; // for compatibility with redux-form
  inputComponent: any;
  multiline?: boolean;
  style: any;
  labelText: string;
  customLabel: boolean;
  modalText?: string;
}

const OthersTextField = props => {
  return (
    <Field
      className={styles.otherField}
      name={`${props.name}.input`}
      component={FieldTextInput}
      placeholder={`Other ${props.placeholder}`}
    />
  );
};

const FormInput: React.FunctionComponent<Props> = ({
  chromeless,
  descriptionText,
  className,
  required,
  input,
  inputComponent,
  multiline,
  style,
  labelText,
  customLabel,
  modalText,
  ...rest
}) => {
  const InputComponent = inputComponent || (multiline ? 'textarea' : 'input');
  const classes = useStyles();

  const [showModal, setShowModal] = useState(false);

  return (
    <StyledContainerDiv
      chromeless={chromeless}
      className={className}
      multiline={multiline}
      style={style}
    >
      <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            className={styles.modal}
          >
            <div className={styles.modalContainer}>
              <h3>{labelText}</h3>
              {modalText && modalText.split('\n').map(line => <p>{line}</p>)}
            </div>
          </Modal>

      <div className={styles.formContainer}>
        {customLabel ? (
          <div>
            <FormLabel
              className={classes.root}
              component="label"
              required={required}
            >
              {labelText}
            </FormLabel>
            {modalText && (<IconButton onClick={() => setShowModal(true)} >
              <InfoIcon color="primary" />
            </IconButton>
            )}
          </div>
        ) : null}
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div style={{flex: 1}}>
            <InputComponent
              className={styles.input}
              labelText={!customLabel && labelText}
              required={required}
              {...input}
              {...rest}
            />
            {descriptionText && (
              <div className="descriptionText">{descriptionText}</div>
            )}
          </div>

          {input.value.value === 'Others' ||
          (Array.isArray(input.value) &&
            input.value.some(option => option.value === 'Others')) ? (
            <OthersTextField name={`custom_${input.name}`} placeholder={labelText} />
          ) : null}
        </div>
      </div>
    </StyledContainerDiv>
  );
};

FormInput.displayName = 'FormInput';

export default FormInput;
