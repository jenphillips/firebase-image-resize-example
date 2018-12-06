import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { Link, Redirect } from 'react-router-dom'
import Select from 'react-select'

import Uploader from './Uploader'
import { capitalize } from 'utilities/capitalize'

export class AddGarmentForm extends React.Component {
  static propTypes = {}

  constructor () {
    super()

    this.state = {
      selectedCategory: null,  // An object for React Select in form { value: <str>, label: <str> }
      alert: null,
      alertType: null,
      submitComplete: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.onUploadSuccess = this.onUploadSuccess.bind(this)
    this.onUploadError = this.onUploadError.bind(this)
  }

  handleChange (option) {
    this.setState({ selectedCategory: option })
  }

  onUploadSuccess (response) {
    this.props.firestore.add({ collection: 'garments' }, {
      userID: this.props.uid,
      imageID: response[0].id,
      category: this.state.selectedCategory.value
    })

    this.setState({submitComplete: true})
  }

  onUploadError (error) {
    console.log(error)
  }

  render () {
    if (this.state.submitComplete) {
      return <Redirect to='/closet' />
    } else {
      let options = []
      if (this.props.categories) {
        options = this.props.categories.labels.map(cat => ({
          value: cat, label: capitalize(cat)
        }))
      }

      return (
        <div>
          <p>{this.state.alert}</p>
          <Link to="/closet">&lt; Back to My Closet</Link>
          <h1>Add Garment</h1>
          <Select
            value={this.state.selectedCategory}
            onChange={this.handleChange}
            options={options} />
          <Link to="/closet/category/add">Add a Category</Link>
          <Uploader
            uploadPath='images'
            onUploadSuccess={this.onUploadSuccess}
            onUploadError={this.onUploadError}
            categorySelected={this.state.selectedCategory !== null} />
        </div>
      )
    }
  }
}

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  categories: state.firestore.ordered.categories ?
    state.firestore.ordered.categories[0] :
    null,
})

export default compose(
  connect(mapStateToProps, null),
  firestoreConnect()
)(AddGarmentForm)
