import io from 'socket.io-client'
const MODE = 'production'
let socket

if (MODE === 'production'){
  socket = io('ws://45.83.123.102:5002')
}
else socket = io()

export {socket} 