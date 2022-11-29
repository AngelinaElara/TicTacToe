const http = require('http')
const express = require('express')
const {Server} = require('socket.io')
const realTimeApp = require('./realTimeApp')

const PORT = 5002
// const HOST = '198.244.206.92'
const HOST = 'localhost'

const app = express()
const server = http.createServer(app)
const path = require('path')
const io = new Server(server)

app.use(express.json({extended: true}))

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
  })
}

io.on("connection", socket => realTimeApp(io, socket))

server.listen(PORT, HOST, ()=>{
    console.log(`HTTP server is working on ${HOST}:${PORT}!`)
}) 