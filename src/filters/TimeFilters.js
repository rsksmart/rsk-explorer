import Vue from 'vue'
import moment from 'moment'
import { isDigits } from './NumberFilters.js'

export const mToSeconds = Vue.filter('m-to-seconds', miliseconds => {
  let seconds = Math.floor(miliseconds / 1000)
  seconds = seconds >= 0 ? seconds : 0
  return seconds
})

export const sAgo = seconds => {
  return (seconds > 60) ? moment.duration(seconds, 'seconds').humanize() : `${seconds}s`
}

export const mSecondsAgo = Vue.filter('m-seconds-ago', miliseconds => {
  return (!miliseconds) ? 0 : sAgo(mToSeconds(miliseconds))
})

export const addAgo = Vue.filter('add-ago', value => {
  if (!value) return value
  return value + ' ago'
})

export const abbreviatedTimeObj = time => {
  if (!isDigits(time)) return { time, suffix: '' }
  time = parseInt(time)
  let suffix = 'ms'
  if (time <= 0) return { time: 0, suffix }
  if (time < 1000) return { time, suffix }
  time = Math.floor(time / 1000)
  if (time < 1) return { time, suffix }
  const ts = {
    s: 60,
    m: 3600,
    h: 86400, // 60*60*24
    d: 2592000, // 60*60*60*24*30
    M: 777600000 // 60*60*60*24*30*300
  }
  suffix = 's'
  let ant = 1
  if (time < 60) return { time, suffix }
  for (const t in ts) {
    const seconds = ts[t]
    suffix = t
    if (time < seconds) {
      time = time / ant
      time = Math.round(time * 100) / 100
      return { time, suffix }
    }
    ant = seconds
  }
  return { time: 0, suffix: 'ms' }
}

export const abbrTime = Vue.filter('abbr-time', time => {
  const obj = abbreviatedTimeObj(time)
  return obj.time + '' + obj.suffix
})

export const sSeconds = Vue.filter('s-seconds', time => {
  if (time < 60) return `${time}s`
  return moment.duration(Math.round(time), 's').humanize()
})

export const formatDate = (timestamp, format = 'YYYY/MM/DD HH:mm:ss Z') => {
  timestamp = Number(timestamp)
  let date = new Date(timestamp)
  date = String(date.toISOString())
  return moment(date).format(format)
}

export const dateFromTs = Vue.filter('date-from-ts', timestamp => formatDate(timestamp))

export const timeFromTs = Vue.filter('time-from-ts', timestamp => formatDate(timestamp, 'HH:mm:ss'))

export const dayFromTs = Vue.filter('day-from-ts', timestamp => formatDate(timestamp, 'YYYY/MM/DD'))

export const dateFromUnixTs = Vue.filter('date-from-unix-ts', time => {
  if (!time) return
  const date = new Date(time * 1000)
  return formatDate(date)
})

export const mToTime = Vue.filter('m-to-time', miliseconds => new Date(parseInt(miliseconds)).toISOString().substr(11, 8))
