import React, { Component } from 'react'

class Word extends Component {

  static propTypes = {
    value: React.PropTypes.string.isRequired,
    guesses: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  }

  render () {
    return <div
      className='word'>
      {this.props.value.split('').map(letter => {
        return <span key={letter}>
          {this.props.guesses.includes(letter) ? letter : '_'}
        </span>
      })}
    </div>
  }
}

export default Word
