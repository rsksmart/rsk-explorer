import { expect } from 'chai'
import {
  mToSeconds,
  sAgo,
  mSecondsAgo,
  addAgo,
  abbreviatedTimeObj,
  abbrTime,
  sSeconds,
  mToTime,
  dateFromTs
} from '../../../src/filters/TimeFilters'

const humanTest = [
  [1, '1s'],
  [59, '59s'],
  [61, 'a minute'],
  [120, '2 minutes'],
  ['3600', 'an hour']
]

const hTest = (method, t) => {
  t = t || humanTest
  for (const [test, expected] of t) {
    it(`${test} should be ${expected}`, () => {
      expect(method(test)).to.be.equal(expected)
    })
  }
}

describe.only('# TimeFilters', function () {
  describe('mToSeconds', function () {
    it('should be 0', () => {
      expect(mToSeconds(undefined)).to.be.equal(0)
      expect(mToSeconds(null)).to.be.equal(0)
      expect(mToSeconds(0)).to.be.equal(0)
    })

    it('should return seconds', () => {
      expect(mToSeconds(1000)).to.be.equal(1)
    })
  })

  describe('sAgo', function () {
    hTest(sAgo)
  })

  describe('mSecondsAgo', function () {
    hTest(mSecondsAgo, humanTest.map(([a, b]) => [parseInt(a) * 1000, b]))
  })

  describe('addAgo', function () {
    it('should add "ago"', () => {
      expect(addAgo('x')).to.be.equal('x ago')
      expect(addAgo(5)).to.be.equal('5 ago')
    })
    it('should return undefined', () => {
      expect(addAgo(undefined)).to.be.equal(undefined)
    })
    it('should return null', () => {
      expect(addAgo(null)).to.be.equal(null)
    })
  })

  describe('abbreviatedTimeObj', function () {
    const test = [
      [1000, 1, 's'],
      [60 * 1000, 1, 'm'],
      [60 * 60 * 1000, 1, 'h']
    ]
    for (const [value, time, suffix] of test) {
      it(`${value} should return ${JSON.stringify({ time, suffix })}`, () => {
        const res = abbreviatedTimeObj(value)
        expect(res).to.be.an('object')
        expect(res).has.ownProperty('time')
        expect(res).has.ownProperty('suffix')
        expect(res.suffix).to.be.equal(suffix)
        expect(res.time).to.be.equal(time)
      })
    }
  })
  describe('abbrTime', function () {
    it('should return a string from time object', () => {
      const { time, suffix } = abbreviatedTimeObj(1000)
      expect(abbrTime(1000)).to.be.equal(`${time}${suffix}`)
    })
  })

  describe('sSeconds', function () {
    hTest(sSeconds)
  })

  describe.skip('dateFromTs', function () {
    it('', () => {
      expect(dateFromTs(new Date('2020-12-05').getTime())).to.be.equal('2020-12-05T00:00:00.000Z')
    })
  })
  describe('timeFromTs', function () { })
  describe('dayFromTs', function () { })
  describe('dateFromUnixTs', function () { })
  describe('mToTime', function () {
    const cases = [
      [1000, '00:00:01'],
      [1500, '00:00:01'],
      [1600, '00:00:01'],
      [2000, '00:00:02'],
      ['60000', '00:01:00'],
      ['3600000', '01:00:00'],
      ['61000', '00:01:01']
    ]
    for (const [t, expected] of cases) {
      it(`${t} should return ${expected}`, () => {
        expect(mToTime(t)).to.be.equal(expected)
      })
    }
  })
})
