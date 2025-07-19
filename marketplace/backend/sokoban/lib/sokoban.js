import Board from './board.js'
import LEVELS from './levels.js'

const user = JSON.parse(localStorage.getItem('user'))
const userId = 2

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

document.addEventListener('DOMContentLoaded', () => {
  let sokoban
  let board

  function startFromSavedLevel() {
    const user = JSON.parse(localStorage.getItem('user'))
    const userId = 2 // hardcoded for testing, replace with user.token in production

    fetch(`/api/sokoban/progress/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const level = data.level ?? 0
        createNewGame(level)
      })
      .catch((err) => {
        console.error('Could not load saved level:', err)
        createNewGame(0) // fallback
      })
  }

  document.addEventListener('DOMContentLoaded', () => {
    startFromSavedLevel()
  })

  $('#dialog').dialog({
    autoOpen: false,
    modal: true,
    width: 520,
    height: 600,
    dialogClass: 'no-close',
  })

  function createNewGame(level) {
    $('#dialog').dialog('close')
    $('#canvas').show()
    sokoban = new Sokoban(level)
    board = sokoban.board
    $('#steps-taken').text(board.stepCount)
    $('#box-pushes').text(board.boxPushes)
    $('#level').text(sokoban.level + 1)
    $('#select-level').val(sokoban.level + 1)
  }

  $('#reset-level').click((event) => {
    createNewGame(sokoban.level)
  })

  $('#skip-level').click((event) => {
    if (sokoban.level < 30) {
      createNewGame(sokoban.level + 1)
    }
  })

  $('.reset-game').click((event) => {
    createNewGame(0)
  })

  $('#select-level').change((event) => {
    const level = $('#select-level').val()
    createNewGame(parseInt(level - 1))
  })

  document.addEventListener('keydown', () => {
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
      const user = JSON.parse(localStorage.getItem('user'))
      const userId = 2 //hardcoded for testing, replace with user.token in production
      console.log(userId)
      const nextLevel = sokoban.level + 1

      if (userId) {
        fetch('/api/sokoban/complete-level', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
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
      }

      if (sokoban.level === 29) {
        $('#canvas').hide()
        $('#dialog').dialog('open')
        return
      }

      createNewGame(nextLevel)
    }
  })
})
