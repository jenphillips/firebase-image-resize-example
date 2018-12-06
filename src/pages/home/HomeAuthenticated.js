import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { Switch, Route } from 'react-router'

import AddCategoryForm from 'pages/closet/AddCategoryForm'
import AddGarmentForm from 'pages/closet/AddGarmentForm'
import CapsuleListPage from 'pages/capsules/CapsuleListPage'
import CapsulePage from 'pages/capsule/CapsulePage'
import ClosetPage from 'pages/closet/ClosetPage'

const HomeAuthenticated = () => {
  return (
    <div>
      HomeAuthenticated

      <Switch>
        <Route path='/closet/category/add' component={AddCategoryForm} />
        <Route path='/closet/add' component={AddGarmentForm} />
        <Route path='/closet' component={ClosetPage} />
        <Route path='/capsules/:id' component={CapsulePage} />
        <Route path='/capsules' component={CapsuleListPage} />
      </Switch>
    </div>
  )
}

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
})

export default compose(
  connect(mapStateToProps, null, null, {pure: false}),
  firestoreConnect(props => {
    if (!props.uid) return []
    return [
      {
        collection: 'capsules',
        where: [
          ['userID', '==', props.uid]
        ]
      },
      {
        collection: 'categories',
        where: [
          ['userID', '==', props.uid]
        ]
      },
      {
        collection: 'garments',
        where: [
          ['userID', '==', props.uid]
        ]
      },
      {
        collection: 'images',
        where: [
          ['userID', '==', props.uid]
        ]
      },
      {
        collection: 'outfits',
        where: [
          ['userID', '==', props.uid]
        ]
      }
    ]
  })
)(HomeAuthenticated)
