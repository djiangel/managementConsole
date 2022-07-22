import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { withTranslation } from 'react-i18next';
import styles from './FieldImageInput.module.css';
import fetch from 'isomorphic-fetch';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import MaterialButton from '../MaterialButton';
import PhotoCameraRounded from '@material-ui/icons/PhotoCameraRounded';

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

class FieldImageInput extends Component {
  constructor(props) {
    super(props);

    // State management for multiple file upload in future
    this.state = {
      files:
        props.defaultImages && props.defaultImages.length
          ? props.defaultImages.map(image => ({
              source: image.url,
              options: { type: 'local' }
            }))
          : [],
      useWebcam: false
    };
  }

  files = {
    toBeAdded: [],
    toBeRemoved: []
  };

  // Does not support multiple file upload for now
  handleFilesUpdate = () => this.props.input.onChange(this.files);

  openWebcamDialog = () =>
    this.setState({
      ...this.state,
      useWebcam: true
    });

  closeWebcamDialog = () =>
    this.setState({
      ...this.state,
      useWebcam: false
    });

  render() {
    const { defaultImages, t, ...rest } = this.props;

    return (
      <div className={styles.imageUploadContainer}>
        <MaterialButton onClick={this.openWebcamDialog}>
          Use Webcam
          <PhotoCameraRounded style={{ marginLeft: 5 }} />
        </MaterialButton>
        <text className={styles.text}>OR</text>
        <FilePond
          {...rest}
          ref={ref => (this.pond = ref)}
          files={this.state.files}
          allowFileEncode
          server={{
            // Setting this to null as we are not directly uploading the files using filepond
            process: null,
            // Overwriting default load function to enable loading of images via url
            load: (url, load, error) => {
              // Add a dummy query string for CORS to work (see: https://github.com/pqina/filepond/issues/371)
              fetch(`${url}?response`, {
                // headers: {
                //   "Accept": 'image/webp,image/apng,image/*,*/*;q=0.8',
                //   "Connection": 'keep-alive',
                //   "Accept-Encoding" : "gzip, deflate, br",
                //   "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
                //   // "Content-Type": 'image',
                //   "Sec-Fetch-Dest": 'image',
                //   // "Sec-Fetch-Mode": 'no-cors',
                //   // "Sec-Fetch-Site": 'cross-site',
                //   // "X-Content-Type-Options": 'nosniff'
                // },
                // credentials: "include",
              })
                .then(res => res.blob())
                .then(load)
                .catch(error);
            }
          }}
          instantUpload={false}
          labelIdle={t('product.imagePlaceholder')}
          allowMultiple
          allowFileTypeValidation
          allowFileSizeValidation={false}
          acceptedFileTypes={['image/jpg', 'image/jpeg', 'image/png']}
          onremovefile={file => {
            // Only existing files that are already uploaded should be pushed into this array
            if (file.file.constructor === Blob) {
              const imageId = defaultImages.find(
                image => image.url === file.serverId
              ).id;
              this.files.toBeRemoved.push({ file, imageId });
            }
          }}
          onupdatefiles={files => {
            this.setState({
              files: files.map(file => file.file),
              useWebcam: false
            });

            // Assign files to be added only to newly added files
            this.files.toBeAdded = files.filter(
              file => file.file instanceof File
            );
            this.handleFilesUpdate();
          }}
          maxFileSize="100MB"
        />
        <Dialog open={this.state.useWebcam}>
          <DialogContent>
            <Webcam
              videoConstraints={{ width: 180, height: 180 }}
              audio={false}
              screenshotFormat="image/jpeg"
              ref={ref => (this.webcam = ref)}
            />
          </DialogContent>
          <DialogActions>
            <MaterialButton
              color="secondary"
              onClick={() =>
                this.pond.addFile(dataURLtoFile(this.webcam.getScreenshot()))
              }
            >
              Take Picture
            </MaterialButton>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

// Converts image dataURL to JavaScript File object
// Name of file object will be epoch date/time the file is created
function dataURLtoFile(dataurl) {
  const date = new Date();
  var arr = dataurl.split(','),
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], date.getTime().toString(), { type: 'image/jpeg' });
}

export default withTranslation()(FieldImageInput);
