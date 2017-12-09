export default function (socket) {
  return store => {
    socket.on('data', data => {
      let action = data.action
      action = 'socket' + action.charAt(0).toUpperCase() + action.slice(1)
      console.log(action)
      if (store._actions[action]) {
        store.dispatch(action, data.data)
      } else {
        console.info('Unknown action received: ' + action)
      }
    })
    socket.on('open', () => {
      socket.emit('ready')
      store.dispatch('connectionUpdate', socket.connected)
    })
    socket.on('disconnect', () => {
      store.dispatch('connectionUpdate', socket.connected)
    })

    socket.on('error', error => {
      store.dispatch('socketError', error)
    })
    // emits from client -> commit('SOCKET_EMIT',{event, data} )
    store.subscribe(mutation => {
      if (mutation.type === 'SOCKET_EMIT' && mutation.payload.event) {
        socket.emit(mutation.payload.event, mutation.payload.data)
      }
    })
  }
}
