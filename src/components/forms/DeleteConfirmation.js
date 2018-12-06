import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'react-bootstrap'

export class DeleteConfirmation extends React.Component {
  static propTypes = {
    active: PropTypes.bool,
    message: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
  }

  render () {
    return (
      <Modal show={this.props.active}>
        <Modal.Body>
          <h4>{ this.props.message }</h4>
          { this.props.children }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onCancel}>Cancel</Button>
          <Button bsStyle="primary" onClick={this.props.onSubmit}>Delete</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default DeleteConfirmation
