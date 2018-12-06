import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import logo from './logo.svg';
import './App.css';

import Header from 'layouts/Header'
import HomeAuthenticated from 'pages/home/HomeAuthenticated'
import HomePublic from 'pages/home/HomePublic'

class App extends Component {
  render() {
    let home
    if (this.props.uid) {
      home = <HomeAuthenticated />
    } else {
      home = <HomePublic />
    }

    return (
      <div className="App">
        <Header />
        { home }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid
})

export default compose(
  connect(mapStateToProps),
  firestoreConnect()
)(App);
