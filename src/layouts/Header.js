import React from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { connect } from 'react-redux'

import AuthButton from "components/auth/AuthButton"

export class Header extends React.Component {
  render () {
    let greeting = (this.props.profile.username === undefined) ? 'Welcome!' : `Welcome, ${this.props.profile.username}! `

    return (
      <Navbar inverse staticTop>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">ClosetChart</Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to='/closet' exact={true}>
              <NavItem eventKey={2}>
                My Closet
              </NavItem>
            </LinkContainer>
          </Nav>
          <Navbar.Text>
            { greeting }
            <AuthButton />
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

const mapStateToProps = (state) => ({
  profile: state.firebase.profile
})

// {pure: false} is a workaround that allows LinkContainer active state
// to render correctly.  See also:
// https://github.com/react-bootstrap/react-router-bootstrap/issues/152
export default connect(mapStateToProps, null, null, {pure: false})(Header)
