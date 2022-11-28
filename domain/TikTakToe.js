const {isNumeric} = require('../lib/isNumeric')

class TikTakToe{
  playArea = [
  	[null, null, null],
  	[null, null, null],
  	[null, null, null]
  ]

  players = null
  currentStep = 'x'
  isFinished = false


  constructor(players){
    this.initPlayers(players)
  }

  initPlayers(players){
    if (!players) throw new Error('Wrong players param!')
    if (players.length !== 2) throw new Error('Wrong players count!')
    const randomIndex = Math.floor(Math.random() * 2)
    this.players = randomIndex === 0 ? players : players.reverse()
  }
    
  get playerX(){
    return this.players[0]
  }

  get player0(){
    return this.players[1]
  }

  switchToNextStep(){
    this.currentStep = this.currentStep === 'x' ? '0' : 'x'
  }

  isGameFinished(){
    // diagonals
    if (this.isLineFiled([[0, 0], [1, 1], [2, 2]])) return true
    if (this.isLineFiled([[2, 0], [1, 1], [0, 2]])) return true

    for (const n of [0, 1, 2]){
      // horizontals
      if(this.isLineFiled([[n, 0], [n, 1], [n, 2]])) return true
      
      // verticals
      if(this.isLineFiled([[0, n], [1, n], [2, n]])) return true
    }
    return false
  }

  isLineFiled(line){
    const lineFigures = []
    for (const [x, y] of line){
      const cell = this.playArea[x][y]
      if (!cell) return false
      lineFigures.push(cell)
    }
    return !(lineFigures.includes('x') && lineFigures.includes('0'))
  }

  doStep(x, y, player){
    if (this.isFinished) throw new Error('Game is already finished!')
    const curPlayer = this.currentStep === 'x' ? this.playerX : this.player0
    if (player !== curPlayer) throw new Error(`It's turn of another player!`)
    if (!isNumeric(x) || !isNumeric(y) || x < 0 || x > 3 || y < 0 || y > 3) throw new Error('Wrong step!')
    if (this.playArea[x][y]) throw new Error('Wrong step!')
    this.playArea[x][y] = this.currentStep
    const isFinished = this.isGameFinished()
    const result = {isFinished, x, y}
    if (isFinished) { 
      result.winner = player
      this.isFinished = isFinished
    }
    else this.switchToNextStep()
    return result
  }
}

module.exports = TikTakToe