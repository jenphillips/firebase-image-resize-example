import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

class AuthButton extends Component {
  static propTypes = {
    auth: PropTypes.object,
    firebase: PropTypes.shape({
      login: PropTypes.func.isRequired,
      logout: PropTypes.func.isRequired
    })
  }

  render() {

    let testCredentials = {
      email: 'jenpierce42+test@gmail.com',
      password: '8109751vndaspr78930',
      username: 'User'
    }

    if (!isLoaded(this.props.auth)) {
      return null
    }
    if (isEmpty(this.props.auth)) {
      return (
        <span>
          <button onClick={() => this.props.firebase.login(testCredentials)}>Log In</button>
        </span>
      )
    }
    return <button onClick={() => this.props.firebase.logout()}>Log Out</button>
  }
}

const mapStateToProps = state => ({
  auth: state.firebase.auth
})

export default compose(
  connect(mapStateToProps, null),
  firebaseConnect()
)(AuthButton)
