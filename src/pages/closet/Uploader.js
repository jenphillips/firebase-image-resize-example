import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import Dropzone from 'react-dropzone'
import uuidv4 from 'uuid/v4'
import classNames from 'classnames/bind'
import { Button, Alert } from 'react-bootstrap'

import styles from './uploader.module.css'
let cx = classNames.bind(styles)

const VALID_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png', 'image/webp']

export class Uploader extends React.Component {
  static propTypes = {
    uploadPath: PropTypes.string.isRequired,  // Collection in which to store file metadata in Firestore
    onUploadSuccess: PropTypes.func,
    onUploadError: PropTypes.func,
    categorySelected: PropTypes.bool // Add Garment form needs category to be selected before submission
  }

  constructor() {
    super()

    this.state = {
      files: [],
      webDragActive: false,
      webUploaderActive: true,
      computerUploaderActive: false,
      alert: null,
      alertType: null
    }

    this.onDragOver = this.onDragOver.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onComputerDrop = this.onComputerDrop.bind(this)
    this.onWebDrop = this.onWebDrop.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
  }

  uploadFile () {
    if (this.props.categorySelected) {
      this.showAlert('Uploading...', 'info')
      // TODO:  Custom metadata factory can be passed in as a prop
      // if/when need to reuse uploader elsewhere
      let imageMetadataFactory = (uploadRes, firebase, metadata, downloadURL) => {
        const { metadata: { name, fullPath } } = uploadRes
        return {
          name,
          fullPath,
          downloadURL,
          'userID': firebase.auth().currentUser.uid
        }
      }

      // uploadFiles(storagePath, files, dbPath, {options})
      return this.props.firebase.uploadFiles(
        this.props.uploadPath,
        this.state.files,
        this.props.uploadPath,
        {metadataFactory: imageMetadataFactory}
      )
        .then(response => this.props.onUploadSuccess(response))
        .catch(error => this.props.onUploadError(error))
    }
    // If category wasn't selected, don't try to submit; show an alert.
    this.showAlert('Please select a category.', 'danger')
  }

  onComputerDrop (files) {
    this.setState({files: files})
  }

  onWebDrop (event) {
    // TODO:  Add validations
    // - Only accept jpg, png
    // - Warn users if they actually dragged an <a> tag or something else
    event.stopPropagation()
    event.preventDefault()
    this.setState({webDragActive: false})

    const imageURL = event.dataTransfer.getData('URL')
    const imagePreview = document.getElementById('preview');

    imagePreview.src = ''  // Clear image preview

    // NOTE:  This is my personal version of cors-anywhere running on Heroku.
    // https://github.com/Rob--W/cors-anywhere/
    // If/when ever need to scale this, replace this with a Google Cloud function
    // (which requires a paid plan for outbound requests).
    const corsProxyURL = 'https://mighty-springs-74690.herokuapp.com/'

    fetch(corsProxyURL + imageURL)
      .then(res => {
        if(res.ok) {
          return res.blob();
        }
        throw new Error('Network response was not ok.');
      })
      .then(res => {
        if (VALID_FILE_TYPES.includes(res.type)){
          let fileName = uuidv4()
          let file = new File([res], fileName, {type: "image/jpeg"})

          // TODO:  Need to resize here instead of in Firebase function?
          // resizeImage(file)

          const objectURL = URL.createObjectURL(file);
          imagePreview.src = objectURL;

          this.clearAlert()
          this.setState({files: [file]})
        } else {
          throw new Error('Image file must be a JPG, PNG, or GIF.  See help for details.')
        }
      })
      .catch(error => this.showAlert(error.message, 'danger'))
  }

  onDragOver (event) {
    event.stopPropagation()
    event.preventDefault()
    this.setState({webDragActive: true})
  }

  onDragLeave (event) {
    event.stopPropagation()
    event.preventDefault()
    this.setState({webDragActive: false})
  }

  onDropRejected (files) {
    alert('Only .jpg and .png files are supported. Please try again.')
  }

  showAlert (message, type) {
    this.setState({ alert: message, alertType: type })
  }

  clearAlert () {
    this.setState({ alert: null, alertType: null })
  }

  componentDidMount () {
    this.webDropzone.addEventListener('dragenter', this.onDragOver, false);
    this.webDropzone.addEventListener('dragover', this.onDragOver, false);
    this.webDropzone.addEventListener('dragleave', this.onDragLeave, false);
    this.webDropzone.addEventListener('drop', this.onWebDrop, false);
  }

  render () {
    let webDropzoneClassname = cx({
      dropzone: true,
      active: this.state.webDragActive,
    });

    let webUploaderClassname = cx({
      uploader: true,
      active: this.state.webUploaderActive,
    });

    let computerUploaderClassname = cx({
      uploader: true,
      active: this.state.computerUploaderActive,
    });

    return (
      <div className='row'>
        <div className='col-sm-4 col-md-4 col-lg-4'>
          {this.state.alert && <Alert bsStyle={this.state.alertType}>
            <p>{this.state.alert}</p>
          </Alert>}

          <h2>Upload an image</h2>
          <div id='webUploader' className={webUploaderClassname}>
            <h3>From the internet:</h3>
            <div
              id='webDropzone'
              className={webDropzoneClassname}
              ref={elem => this.webDropzone = elem} >
              <p>Drag and drop an image from another browser window here.</p>
            </div>

            <img id='preview' />
          </div>
          <div id='computerUploader' className={computerUploaderClassname}>
            <h3>From my computer:</h3>
            <div>
              <Dropzone
                className='dropzone'
                activeClassName='active'
                accept="image/jpeg,image/jpg,image/png"
                multiple={false}
                onDrop={this.onComputerDrop}
                onDropRejected={this.onDropRejected}>
                <p>Drag and drop a .JPG or .PNG file here, or click to browse.</p>
                </Dropzone>
            </div>
          </div>
        </div>
        <div className='col-sm-4 col-md-4 col-lg-4'>
          <Button
            onClick={this.uploadFile}
            disabled={!this.state.files.length}>
            Submit
          </Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
})

export default compose(
  connect(mapStateToProps),
  firestoreConnect()
)(Uploader)
