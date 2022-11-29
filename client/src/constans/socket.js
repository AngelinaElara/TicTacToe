import io from 'socket.io-client'
const MODE = 'production'
let socket

if (MODE === 'production'){
  socket = io('ws://198.244.206.92:5002')
}
else socket = io()

export {socket} 