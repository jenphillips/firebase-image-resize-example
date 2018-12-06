import React from 'react'
import PropTypes from 'prop-types'

import styles from './garment.module.css'

export class Garment extends React.Component {
  static propTypes = {
    image: PropTypes.object
  }

  render () {
    return (
        <div className={styles.garment}>
          <img src={this.props.image.downloadURL} />

          { this.props.children }
        </div>
    )
  }
}

export default Garment
