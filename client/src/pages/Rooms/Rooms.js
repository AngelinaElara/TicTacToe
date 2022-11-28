import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../../constans/socket'
import { AuthContext } from '../../context/authContext'

const Rooms = () => {
  const className = 'rooms'
  const [roomsList, setRoomsList] = useState([])

  const auth = useContext(AuthContext)

  const navigate = useNavigate()

  const handleNewRoomBtnClick = () => {
    socket.emit('createRoom')
  }

  const onGettingRooms = (rooms) => {
    setRoomsList(rooms)
  }

  const onJoinRoom = (id) => {
    socket.emit('joinRoom', id)
    auth.roomId = id 
  }

  const onGameStarted = ({roomId, playerX}) => { 
    const playerSymbol = playerX === socket.id ? 'x' : '0' 
    navigate(`/game?id=${roomId}&symbol=${playerSymbol}`)
   
  }
 
  useEffect(() => {
    socket.on('$createRoom')
    socket.emit('getRoomsList')
    socket.on('$getRoomsList', onGettingRooms)
    socket.on('joinRoom', onJoinRoom)
    socket.on('$gameStarted', onGameStarted) 

    return () => {
      socket.off('$createRoom')
      socket.off('$getRoomsList', onGettingRooms)
      socket.off('joinRoom', onJoinRoom)
      socket.off('$gameStarted', onGameStarted)
    }
  }, [])
 
  return (
    <>
      <header className='header'>
        <button className='header__button' onClick={() => {auth.logout()}}>Logout</button>
      </header>
      <div className={className}>
        <h2>Rooms</h2>
        <div className={`${className}__btns`}>
          <button className={`${className}__btn`} onClick={handleNewRoomBtnClick}>New room</button>
          {roomsList?.length 
            ? roomsList.map((roomId, index) => {
              return (
                <button 
                  key={index}     
                  className={`${className}__btn`}
                  onClick={() => {onJoinRoom(roomId)}}
                >
                  Room {roomId}
                </button>
              )
            })
            : ''
          }
        </div>
      </div>
    </>
  )
}

export default Rooms
