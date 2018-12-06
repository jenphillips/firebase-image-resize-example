import React from 'react'
import PropTypes from 'prop-types'
import { Nav, NavItem } from 'react-bootstrap'
import { capitalize } from 'utilities/capitalize'

export class NavTabMenu extends React.Component {
  constructor () {
    super()
    this.handleSelect = this.handleSelect.bind(this)
  }

  handleSelect (selectedCategory) {
    this.props.callback(selectedCategory)
  }

  render () {
    const navItems = this.props.categories.map((category, index) =>
      <NavItem eventKey={category} key={index}>
        { capitalize(category) }
      </NavItem>
    )

    return (
      <Nav bsStyle="pills" activeKey={this.props.active} onSelect={this.handleSelect}>
        { navItems }
      </Nav>
    )
  }
}

NavTabMenu.propTypes = {
  categories: PropTypes.array,
  callback: PropTypes.func
}

export default NavTabMenu
