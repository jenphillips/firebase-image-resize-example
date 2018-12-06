import React from 'react'
import PropTypes from 'prop-types'

import EditGarmentForm from './EditGarmentForm'
import Garment from 'components/Garment'

export class ClosetGarment extends React.Component {
  static propTypes = {
    garment: PropTypes.object,
    image: PropTypes.object
  }

  render () {
    return (
      <div className='col-xs-12 col-sm-6 col-md-3 col-lg-2'>
        <Garment
          garment={this.props.garment}
          image={this.props.image} >
          <EditGarmentForm
            garment={this.props.garment}
            image={this.props.image} />
        </Garment>
      </div>
    )
  }
}

export default ClosetGarment
