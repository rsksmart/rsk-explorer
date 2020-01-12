const io = require('socket.io-client')
const socket = io(process.env.WS_URL, { transports: ['websocket'] })
socket.on('reconnect_attempt', () => {
  socket.io.opts.transports = ['polling', 'websocket']
})
export default socket
