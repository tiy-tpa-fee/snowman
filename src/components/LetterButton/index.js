import React, { Component } from 'react'

class LetterButton extends Component {

  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChoose: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool
  }

  render () {
    return <button
      className='letter-button'
      onClick={this.props.onChoose}
      disabled={this.props.disabled}>
      {this.props.value}
    </button>
  }
}

export default LetterButton
