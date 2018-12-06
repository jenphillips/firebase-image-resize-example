import React from 'react'
import PropTypes from 'prop-types'
import styles from './formbutton.module.css'

// Invisible borders & background.
// Takes a glyphicon for display (no text label).
const FormButton = props => {
  return (
    <button
      className={styles.formButton}
      onClick={props.onClick} >
      <span className={`glyphicon glyphicon-${props.icon}`}></span>
    </button>
  )
}

FormButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.string
}

export default FormButton
