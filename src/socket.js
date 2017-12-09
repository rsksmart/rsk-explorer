var io = require('socket.io-client')
var socket = io.connect(process.env.WS_URL)
export default socket
