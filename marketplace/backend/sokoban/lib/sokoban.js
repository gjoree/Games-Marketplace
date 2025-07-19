import Board from './board.js'
import LEVELS from './levels.js'

class Sokoban {
  constructor(level = 0) {
    this.level = level
    const textGrid = LEVELS[this.level]

    const canvas = document.getElementById('canvas')
    canvas.width = 512
    canvas.height = 512

    this.board = new Board(textGrid)
  }
}

let sokoban
let board

function createNewGame(level) {
  $('#dialog').dialog('close')
  $('#canvas').show()
  sokoban = new Sokoban(level)
  board = sokoban.board
  $('#steps-taken').text(board.stepCount)
  $('#box-pushes').text(board.boxPushes)
  $('#level-number').text(sokoban.level + 1)
}

function startFromSavedLevel() {
  fetch('/api/sokoban/progress', {
    method: 'GET',
    credentials: 'include',
  })
    .then((res) => {
      if (!res.ok) throw new Error('Unauthorized or failed to fetch')
      return res.json()
    })
    .then((data) => {
      const level = data.level ?? 0
      createNewGame(level)
    })
    .catch((err) => {
      console.error('Could not load saved level:', err)
      createNewGame(0)
    })
}

document.addEventListener('DOMContentLoaded', () => {
  startFromSavedLevel()

  $('#dialog').dialog({
    autoOpen: false,
    modal: true,
    width: 520,
    height: 600,
    dialogClass: 'no-close',
  })

  $('#reset-level').click(() => {
    createNewGame(sokoban.level)
  })

  $('#skip-level').click(() => {
    if (sokoban.level < 30) {
      createNewGame(sokoban.level + 1)
    }
  })

  $('.reset-game').click(() => {
    createNewGame(0)
  })

  document.addEventListener('keydown', (event) => {
    event.preventDefault()
    switch (event.keyCode) {
      case 37:
        board.movePlayer('left')
        break
      case 38:
        board.movePlayer('up')
        break
      case 39:
        board.movePlayer('right')
        break
      case 40:
        board.movePlayer('down')
        break
    }

    $('#steps-taken').text(board.stepCount)
    $('#box-pushes').text(board.boxPushes)

    if (sokoban.board.gameOver()) {
      const nextLevel = sokoban.level + 1

      fetch('/api/sokoban/complete-level', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          level: nextLevel,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Level complete!', data)
        })
        .catch((err) => {
          console.error('Failed to update user progress', err)
        })

      if (sokoban.level === 29) {
        $('#canvas').hide()
        $('#dialog').dialog('open')
        return
      }

      createNewGame(nextLevel)
    }
  })
})
