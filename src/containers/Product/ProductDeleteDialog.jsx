import React from 'react';
import * as PropTypes from 'prop-types';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '../../material/index';
import { event } from 'react-ga';
import { EDIT_PRODUCT_DELETE } from '../../constants/googleAnalytics/actions';
import { CAT_EDIT_PRODUCT } from '../../constants/googleAnalytics/categories';

export default function ProductDeleteDialog(props) {
  const { open, toggleDialog, productId, handleDeleteProduct } = props;

  return (
    <div>
      <Dialog open={open} onClose={toggleDialog}>
        <DialogTitle>Delete Product?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleted products cannot be restored by Gastrograph. If a product is
            deleted, <strong>product reviews</strong> will not be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              event({
                category: CAT_EDIT_PRODUCT,
                action: EDIT_PRODUCT_DELETE,
                label: productId.toString()
              });
              handleDeleteProduct(productId);
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

ProductDeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDialog: PropTypes.func.isRequired,
  productId: PropTypes.number.isRequired,
  handleDeleteProduct: PropTypes.func.isRequired
};
