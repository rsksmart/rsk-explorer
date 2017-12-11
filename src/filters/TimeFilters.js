import Vue from 'vue'
import * as moment from 'moment'
import { isDigits } from './NumberFilters.js'

export const tSecondsAgo = Vue.filter('t-seconds-ago', timestamp => {
  let time = moment(timestamp).format('s')
  return sAgo(time)
})

export const mSecondsAgo = Vue.filter('m-seconds-ago', miliseconds => {
  let seconds = mToSeconds(miliseconds)
  return sAgo(seconds)
})

export const mToSeconds = Vue.filter('m-to-seconds', miliseconds => {
  let seconds = Math.floor(miliseconds / 1000)
  seconds = seconds >= 0 ? seconds : 0
  return seconds
})

const sAgo = time => {
  if (time > 60) {
    time = moment.duration(time, 'seconds').humanize()
  } else {
    time += 's'
  }
  return time
}

export const abbreviatedTimeObj = time => {
  if (!isDigits(time)) return { time, suffix: '' }
  time = parseInt(time)
  let suffix = 'ms'
  if (time <= 0) return { time: 0, suffix }
  if (time < 1000) return { time, suffix }
  time = Math.floor(time / 1000)
  if (time < 1) return { time, suffix }
  let ts = {
    s: 60,
    m: 3600,
    h: 86400, // 60*60*24
    d: 2592000, // 60*60*60*24*30
    M: 777600000 // 60*60*60*24*30*300
  }
  suffix = 's'
  let ant = 1
  if (time < 60) return { time, suffix }
  for (let t in ts) {
    let seconds = ts[t]
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
  let obj = abbreviatedTimeObj(time)
  return obj.time + '' + obj.suffix
})

export const abbrTimeSeconds = Vue.filter('abbr-time-seconds', time => {
  if (time < 900) return '0s'
  let obj = abbreviatedTimeObj(time)
  return obj.time + '' + obj.suffix
})

export const sSeconds = Vue.filter('s-seconds', time => {
  if (time < 60) return parseFloat(time).toFixed(2) + 's'
  return moment.duration(Math.round(time), 's').humanize()
})

export const dateFromTs = Vue.filter('date-from-ts', timestamp => {
  timestamp = Number(timestamp)
  let date = new Date(timestamp)
  let datetime =
    date.getDate() +
    '/' +
    (date.getMonth() + 1) +
    '/' +
    date.getFullYear() +
    '-' +
    date.getHours() +
    ':' +
    date.getMinutes() +
    ':' +
    date.getSeconds()
  return datetime
})

export const miliseconds = Vue.filter('miliseconds', time => {
  time = parseInt(time)
  if (time === 0) return time
  if (time < 1000) return time + 'ms'
  let seconds = Math.floor(time / 1000)
  return sAgo(seconds)
})
