import React, { Component } from 'react'
import _ from 'lodash'
import LetterButton from './LetterButton'
import Snowman from './Snowman'
import Word from './Word'

// ALPHABET is an array of 26 letters, 'a' through 'z', i.e. ['a', 'b', 'c', ...'z']
const ALPHABET = _.range(26).map(i => String.fromCharCode(i + 97))

// WORDS is an array of 1024 different seven letter words
const WORDS = require('raw!../wordList.txt').trim().split('\n')

class App extends Component {

  constructor () {
    super()
    // TODO
    this.state = {
    }
  }

  choose (letter) {
    // TODO
    console.log('You clicked', letter)
  }

  get points () {
    // TODO
    return 0
  }

  render () {
    return <div className='app'>
      <main>
        <Snowman step={this.points} size={400} />
        {/* TODO */}
        <Word value='SNOWMAN' guesses={['E', 'M', 'O']} />
        <div className='keyboard'>
          {/* TODO */}
          <LetterButton
            value='A'
            onChoose={() => this.choose('A')}
            disabled={false} />
        </div>
      </main>
      <footer>It's like hangman, but, um... backwards or something.</footer>
    </div>
  }
}

export default App
