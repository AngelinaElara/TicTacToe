import { useState, useEffect, useContext } from 'react'
import {useSearchParams, NavLink} from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { socket } from '../../constans/socket'
import Swal from 'sweetalert2'

const Game = () => {
  const squaresArray = [
    {x: 0, y: 0, symbol: null},
    {x: 0, y: 1, symbol: null},
    {x: 0, y: 2, symbol: null},
    {x: 1, y: 0, symbol: null},
    {x: 1, y: 1, symbol: null},
    {x: 1, y: 2, symbol: null},
    {x: 2, y: 0, symbol: null},
    {x: 2, y: 1, symbol: null},
    {x: 2, y: 2, symbol: null},
  ]
  const [squareArray, setSquareArray] = useState(squaresArray)
  const [roomId, setRoomId] = useState('')
  
  const [searchParams, setSearchParams] = useSearchParams()

  const auth = useContext(AuthContext)

  const className = 'game'

  const currRoomId = searchParams.get('id')
  const playerSymbol = searchParams.get('symbol')

  useEffect(() => {
    setRoomId(currRoomId)
    socket.on('$doStep', onParams)
  }, [])

  const onParams = ({stepInfo}) => {
    const {x, y, winner} = stepInfo

    let newSymbol = playerSymbol === 'x' ? '0' : 'x'

    // After a win, it does not allow the last character to change
    if (winner === socket.id) {
      newSymbol = playerSymbol 
    }
    
    setSquareArray(square => square.map(square=> square.x === x && square.y === y  ? {...square, symbol: newSymbol} : square))
    auth.stepSymbol = playerSymbol

    if (winner === socket.id) {
      Swal.fire({text:'Congratulations! You are winner'})
    }
  }
  
  const onStep = (roomId, x, y) => {
    socket.emit('doStep', {roomId, x, y})
  } 

  const switchStep = () => {
    return auth.stepSymbol = auth.stepSymbol === 'x' ? '0' : 'x'
  }

  const onXorY = (e) => {
    console.log(auth.stepSymbol)
   
    if(playerSymbol !== auth.stepSymbol){
      return alert(`Now it's another player's turn`)
    }

    if (playerSymbol === 'x') {
      e.target.classList.add('cross')
    } else if (playerSymbol === '0') {
      e.target.classList.add('circle')
    }

    switchStep()
  }
  
  return (
    <>
      <div className='link'>
        <NavLink to='/rooms'>Rooms</NavLink>
      </div>
      <div className={`${className}`}>
        <h1>{ `You are playing with the symbol ${playerSymbol}` }</h1>
        <div className={`${className}__board`}>
          {squareArray.map((square, index) => {
            return (
              <button 
                className={square.symbol === 'x' 
                  ? `${className}__square cross`
                  : square.symbol === '0' ? `${className}__square circle` : `${className}__square`
                }
                onClick={(e) => {onStep(roomId, square.x, square.y); onXorY(e)}}
                key={index}
              >
                {/* {console.log({x: square.x, y: square.y, symbol: square.symbol})} */}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Game