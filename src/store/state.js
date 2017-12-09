export default function () {
  return {
    APP: process.env.APP,
    date: Date.now(),
    dateInterval: null,
    size: {
      w: 0,
      h: 0
    },
    socketConnected: false,
    socketErrors: []
  }
}
