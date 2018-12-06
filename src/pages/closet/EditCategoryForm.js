import React from 'react'
import PropTypes from 'prop-types'
import { firestoreConnect } from 'react-redux-firebase'
import { connect } from 'react-redux'
import { compose } from 'redux'
import Select from 'react-select'

import FormButton from 'components/forms/FormButton'
import { capitalize } from 'utilities/capitalize'

export class EditCategoryForm extends React.Component {
  static propTypes = {
    garment: PropTypes.object
  }

  constructor (props) {
    super(props)

    this.state = {
      active: false,
      selectedCategory: {value: props.garment.category, label: capitalize(props.garment.category)}
    }

    this.onSelect = this.onSelect.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSelect (selectedOption) {
    this.setState({selectedCategory: selectedOption})
  }

  onSubmit () {
    this.setState({active: false})

    const newCategory = this.state.selectedCategory.value

    return this.props.firestore.set({ collection: 'garments', doc: this.props.garment.id },
      {category: newCategory}, { merge: true })
      .then(function() {
        console.log("Document successfully written!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  }

  render () {
    let displayCategory = <span>
      <p>{capitalize(this.state.selectedCategory.label)}</p>
      <FormButton
        onClick={() => this.setState({active: true})}
        icon='pencil' />
    </span>

    let options = []
    if (this.props.categories) {
      options = this.props.categories.labels.map(cat => ({
        value: cat, label: capitalize(cat)
      }))
    }

    let editCategory = <span>
      <Select
        options={options}
        value={this.state.selectedCategory}
        onChange={this.onSelect}
      />
      <button onClick={this.onSubmit}>
        Submit
      </button>
      <button onClick={() => this.setState({active: false})}>
        Cancel
      </button>
    </span>

    return (
      <div>
        { this.state.active ? editCategory : displayCategory }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  categories: state.firestore.ordered.categories ?
    state.firestore.ordered.categories[0] :
    null,
})

export default compose(
  connect(mapStateToProps),
  firestoreConnect()
)(EditCategoryForm)
