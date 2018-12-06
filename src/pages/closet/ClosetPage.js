import React from 'react'
import { Link } from 'react-router-dom'

import Closet from './Closet'
import ClosetGarment from './ClosetGarment'

export class ClosetPage extends React.Component {
  render () {
    let garment
    return (
      <div>
        <h1>Closet</h1>
        <Link to='/closet/add'>Add Garment</Link>
        <Closet
          render={(garment, image) => (
            <ClosetGarment key={garment.id} garment={garment} image={image} />
          )} />
      </div>
    )
  }
}

export default ClosetPage

