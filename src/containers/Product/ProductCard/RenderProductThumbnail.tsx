import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ImageList,
  ImageListItem
} from '../../../material/index';
import { Close as CloseIcon } from '@material-ui/icons';

const styles = require('./ProductCard.module.css');

interface Props {
  imageUrls: string[];
}

interface State {
  showDialog: boolean;
  selectedImage: string;
}

const RenderImageDialog = props => {
  const { showDialog, setDialog, url } = props;

  return (
    <Dialog open={showDialog} onClose={() => setDialog()} maxWidth={false}>
      <DialogTitle className={styles.dialogHeader}>
        <IconButton onClick={() => setDialog()} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <img src={url} alt="Product Images" />
      </DialogContent>
    </Dialog>
  );
};

export default class RenderProductThumbnail extends React.Component<
  Props,
  State
> {
  state = {
    showDialog: false,
    selectedImage: null
  };

  setDialog = () => {
    this.setState({
      showDialog: !this.state.showDialog
    });
  };

  setSelectedImage = url => {
    this.setState({
      selectedImage: url
    });
  };

  render() {
    const { imageUrls } = this.props;

    return (
      <div style={{ padding: '0 5px' }}>
        <div className={styles.thumbnailContainer}>
          <ImageList
            cellHeight={69}
            cols={2}
            spacing={10}
            className={styles.thumbnailGrid}
          >
            {imageUrls.map((url, index) => (
              <ImageListItem key={index} cols={1}>
                <img
                  className={styles.thumbnail}
                  src={url}
                  alt={`image_${index}`}
                  onClick={() => {
                    this.setSelectedImage(url);
                    this.setDialog();
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
        <RenderImageDialog
          showDialog={this.state.showDialog}
          setDialog={this.setDialog}
          url={this.state.selectedImage}
        />
      </div>
    );
  }
}
