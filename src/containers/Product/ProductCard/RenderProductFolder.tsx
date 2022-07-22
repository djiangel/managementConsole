import * as React from 'react';
import { connect } from 'react-redux';
import RenderProductText from './RenderProductText';
import FormContainer from '../../Form';
import FieldFolderSelect from '../../../components/FieldFolderSelect';
import { MOVE_PRODUCT_FORM } from '../../../constants/formNames';
import { registerField, change, Field } from 'redux-form';
import MaterialButton from 'components/MaterialButton';

const styles = require('./ProductCard.module.css');

const mapDispatchToProps = dispatch => ({
  dispatch
});

const RenderProductFolder = props => {
  let {
    folder,
    folderId,
    folderResults,
    addingFolder,
    setAddingFolder,
    dispatch,
    productId
  } = props;

  const addProductToFolderSubmit = (e, handleSubmit) => {
    dispatch(registerField(MOVE_PRODUCT_FORM, 'productId', 'Field'));
    dispatch(change(MOVE_PRODUCT_FORM, 'productId', productId));
    setAddingFolder(false);
    handleSubmit(e);
  };

  return folderId && folderId != 0 ? (
    <RenderProductText property={folder} />
  ) : addingFolder ? (
    <FormContainer
      formName={MOVE_PRODUCT_FORM}
      render={({ handleSubmit, invalid, submitting, error }) => (
        <form onSubmit={handleSubmit}>
          <Field
            component={FieldFolderSelect}
            key="folder"
            name="folder"
            folderResults={folderResults}
            label="Folder"
          />
          <MaterialButton
            type="submit"
            onClick={e => addProductToFolderSubmit(e, handleSubmit)}
            style={{ width: 140 }}
            soft
            variant="outlined"
          >
            Add Product to Folder
          </MaterialButton>
        </form>
      )}
    />
  ) : (
    <div className={styles.addText} onClick={e => setAddingFolder(true)}>
      Add to Folder
      <img
        src={require('../../../../public/assets/folder/folder.svg')}
        className={styles.addSymbol}
        alt="add-folder"
      />
    </div>
  );
};

export default connect(
  null,
  mapDispatchToProps
)(RenderProductFolder);
