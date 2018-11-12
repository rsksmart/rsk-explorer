export default function (socket) {
  return store => {
    socket.on('data', res => {
      if (res) {
        let action = res.action
        let data = res.data
        if (action) {
          action = 'socket' + action.charAt(0).toUpperCase() + action.slice(1)
          if (store._actions[action]) {
            store.dispatch(action, data)
            store.dispatch('setDateInterval')
          } else {
            if (res.req && res.req.key) {
              store.dispatch('socketData', res)
            } else {
              // eslint-disable-next-line
              console.info('Unknown action received: ' + action)
            }
          }
        }
      }
    })
    socket.on('open', data => {
      socket.emit('ready')
      store.dispatch('connectionUpdate', socket.connected)
      store.dispatch('init', data)
    })
    socket.on('disconnect', () => {
      store.dispatch('connectionUpdate', socket.connected)
    })

    socket.on('Error', error => {
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
