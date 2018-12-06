import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'

import FormButton from 'components/forms/FormButton'
import EditCategoryForm from './EditCategoryForm'
import styles from './editgarmentform.module.css'

import {
  deleteImage,
  deleteGarment,
  deleteGarmentFromAllCapsules,
  deleteOutfitsWithGarment } from 'shared/deleteMethods'

export class EditGarmentForm extends React.Component {
  static propTypes = {
    garment: PropTypes.object,
    image: PropTypes.object
  }

  constructor () {
    super()

    this.handleDelete = this.handleDelete.bind(this)
  }

  handleDelete () {
    const capsulesWithGarment = this.props.capsules.filter(capsule =>
      capsule.garments.includes(this.props.garment.id))

    deleteOutfitsWithGarment(
      this.props.firestore,
      this.props.garment.id,
      this.props.outfits)
      .then(() => {
        return deleteGarmentFromAllCapsules(
          this.props.firestore,
          this.props.garment.id,
          capsulesWithGarment
        )
      })
      .then(() => {
        return deleteImage(
          this.props.firebase,
          this.props.image
        )
      })
      .then(() => {
        return deleteGarment(
          this.props.firestore,
          this.props.garment.id
        )
      })
      .then(() => {
        console.log('delete complete')
      })
      .catch(error => {
        console.error("An error occurred: ", error);
      })
  }

  render() {
    // TODO:  Add delete confirmation w/outfits link
    return (
      <div className={styles.form}>
        <div className='pull-left'>
          <EditCategoryForm
            garment={this.props.garment} />
        </div>
        <div className='pull-right'>
          <FormButton
            onClick={this.handleDelete}
            icon='remove' />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  capsules: state.firestore.ordered.capsules,
  outfits: state.firestore.ordered.outfits
})

export default compose(
  connect(mapStateToProps),
  firestoreConnect()
)(EditGarmentForm)
