import React, { Component } from 'react'

class Button extends Component {

  _reset = () => {
    console.log('well it knows I clicked')
    this.props.reset()
  }

  render () {
    return (
      <div className='buttonHolder'>
        <button onClick={this._reset}
          type='button'>Play Again</button>
      </div>
    )
  }
}

export default Button
