const io = require('socket.io-client')
const socket = io.connect(process.env.WS_URL)
export default socket
