const io = require('socket.io-client')
const socket = io(process.env.WS_URL, { transports: ['websocket'] })

const miningSocket = io(process.env.WS_M_URL, { transports: ['websocket'] })

socket.on('reconnect_attempt', () => {
  socket.io.opts.transports = ['polling', 'websocket']
})

miningSocket.on('reconnect_attempt', () => {
  socket.io.opts.transports = ['polling', 'websocket']
})

export { miningSocket }

export default socket
