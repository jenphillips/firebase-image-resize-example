import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { Link } from 'react-router-dom'

import NavTabMenu from 'components/nav/NavTabMenu'

export class Closet extends React.Component {
  static propTypes = {}

  constructor () {
    super()

    this.showCategory = this.showCategory.bind(this)

    this.state = {
      selectedCategory: 'everything'
    }
  }

  showCategory (category) {
    this.setState({selectedCategory: category})
  }

  render () {
    let garments = []
    if (this.props.garments && this.props.garments.length) {
      garments = this.props.garments.map(garment => {
        if (this.state.selectedCategory == 'everything' ||
          garment.category === this.state.selectedCategory) {
          let image
          if (this.props.images && this.props.images.length) {
            image = this.props.images.find(image => image.id === garment.imageID)
          }
          if (image) {
            return (
              // Closet can render garments with different editing options
              // depending on the page.  For example, from main closet page,
              // user wants to delete garment or edit category; from capsule
              // editor, user wants to add garment to capsule.
              //
              // Pass a specialized garment component with the desired
              // editing options as a render prop to <Closet />.
              // See <ClosetGarment /> for an example.
              this.props.render(garment, image)
            )
          }
        }
      })
    }

    let categories = []
    if (this.props.categories) {
      categories =  ['everything', ...this.props.categories.labels]
    }

    return (
      <div>
        <NavTabMenu
          active={this.state.selectedCategory}
          categories={categories}
          callback={this.showCategory}/>
        { garments }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  categories: state.firestore.ordered.categories ?
    state.firestore.ordered.categories[0] :
    null,
  garments: state.firestore.ordered.garments,
  images: state.firestore.ordered.images
})

export default compose(
  connect(mapStateToProps, null, null, {pure: false}),
  firestoreConnect()
)(Closet)
