const TikTakToe = require('./domain/TikTakToe')
const playing_rooms = {}
const pending_rooms = {}

module.exports = function(io, socket) {
  socket.join('waitingRoom')
  try {
    socket.on('createRoom', ()=>{
      try {
        const id = (Date.now() + Math.floor(Math.random() * 10000)).toString(16)
        pending_rooms[id] = [socket.id]
        socket.join(id)
        socket.leave('waitingRoom')
        socket.to('waitingRoom').emit('$createRoom', {id})
      }
      catch(err) {
        console.log(err)
        socket.emit('$errGame', 'Something went wrong!')
      }
    })

      
    socket.on('getRoomsList', ()=>{
      socket.emit('$getRoomsList', Object.keys(pending_rooms))
    })

    socket.on('joinRoom', (roomId)=>{
      try {
        if (!roomId) throw new Error('Wrong room id!')
        const room = pending_rooms[roomId];
        if (!room) throw new Error('Room does not exist!')
        const players = room
        if (players.length !== 1) throw new Error('Room is not available for joining!')
        if (players[0] === socket.id) throw new Error('Such player already in room!')
        players.push(socket.id)
        socket.join(roomId)
        delete pending_rooms[roomId]
        const game = new TikTakToe(players)
        playing_rooms[roomId] = game
        socket.leave('waitingRoom')
        io.to('waitingRoom').emit('$joinRoom', roomId)
        io.to(roomId).emit('$gameStarted', {playerX: game.playerX, player0: game.player0, roomId})
      }
      catch (err) {
        console.log(err)
        socket.emit('$errGame', 'Something went wrong!')
      }
    })

    socket.on('doStep', (options={}) => {
      try {
        const {roomId, x, y} = options
        if (!roomId) throw new Error('Wrong room id!')
        const game = playing_rooms[roomId]
        if (!game) throw new Error('Game does not exist!')
        const stepInfo = game.doStep(x, y, socket.id)
        if (stepInfo.isFinished) {
          io.to(roomId).emit("$doStep", {stepInfo})
        } else {
          socket.to(roomId).emit('$doStep', {stepInfo})
        }
      }
      catch (err) {
        console.log(err)
        socket.emit('$errGame', 'Something went wrong!')
      }
    })
  }

    
  catch(err) {
    socket.emit('$errGame', 'Something went wrong!')
    console.log(err)
  }
}