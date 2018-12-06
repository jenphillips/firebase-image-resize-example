import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { Button, Modal } from 'react-bootstrap'

import { capitalize } from 'utilities/capitalize'

export class AddCategoryForm extends React.Component {
  static propTypes = {
    user: PropTypes.object
  }

  constructor () {
    super()

    this.state = {
      newCategory: '',
      warning: ''
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.updateCategories = this.updateCategories.bind(this)
  }

  onChange (event) {
    event.preventDefault()
    this.setState({newCategory: event.target.value})
  }

  onSubmit (event) {
    event.preventDefault()

    const newCategory = this.state.newCategory.toLowerCase()
    if (this.props.categories.labels.includes(newCategory)) {
      this.setState({
        warning: 'That category already exists.'
      })
    } else {
      this.setState({ newCategory: '' })
      this.updateCategories([...this.props.categories.labels, newCategory])
    }
  }

  onDelete (categoryToDelete) {
    let categoryIsEmpty = true
    for (const g of this.props.garments) {
      if (g.category === categoryToDelete) {
        categoryIsEmpty = false
        break
      }
    }

    if (categoryIsEmpty){
      this.updateCategories(this.props.categories.labels.filter(label => (
        label !== categoryToDelete
      )))
    } else {
      this.setState({
        warning: 'Sorry, only empty categories can be deleted.  ' +
        'Please recategorize any clothing items in this category and try again.'
      })
    }
  }

  updateCategories (newCategoryLabels) {
    return this.props.firestore.set({ collection: 'categories', doc: this.props.categories.id },
      {labels: newCategoryLabels, userID: this.props.uid}, { merge: true })
      .then(function() {
        console.log("Document successfully written!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  }

  // TODO:  Seed account with a few default categories when they sign up.
  render () {
    if (this.props.categories) {
      return (
        <div>
          <div>
            { this.props.categories.labels.map((label, index) => (
                <p key={index}>
                  { capitalize(label) }
                  <Button onClick={ () => {this.onDelete(label)} }>x</Button>
                </p>
              )
            )}
          </div>
          <form onSubmit={this.onSubmit}>
            <input
              type='text'
              value={this.state.newCategory}
              placeholder='Enter new category...'
              onChange={this.onChange} />
            <button type='submit'>
              Submit
            </button>
          </form>

          <Modal show={!!this.state.warning.length}>
            <Modal.Body>
              <p>{ this.state.warning }</p>
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle='primary' onClick={() => this.setState({ warning: '' })}>
                Okay
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )
    } else {
      return "Loading..."
    }
  }
}

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  categories: state.firestore.ordered.categories ?
    state.firestore.ordered.categories[0] :
    null,
  garments: state.firestore.ordered.garments
})

export default compose(
  connect(mapStateToProps),
  firestoreConnect()
)(AddCategoryForm)
