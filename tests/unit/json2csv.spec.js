import { json2Csv } from '../../src/lib/js/json2csv'
import { expect } from 'chai'

const test = [
  [{ a: 1, b: 2, c: 'test', d: null, e: undefined }, '"a","b","c","d","e"\n"1","2","test","null","undefined"'],
  [{ a: 1, b: 2, c: 'test' }, '"a","c"\n"1","test"', ['a', 'c']],
  [{ a: 1, o: { oo: { b: 2 } } }, '"a","o"\n"1","{\'oo\':{\'b\':2}}"'],
  [{ a: { o: undefined } }, '"a"\n"{\'o\':\'undefined\'}"']
]

const errors = [
  [undefined],
  [null],
  [[]]
]

describe('json2csv', function () {
  for (const [t, expected, keys] of test) {
    it('should return csv', () => {
      expect(json2Csv(t, { keys })).to.be.deep.equal(expected)
    })
  }

  for (const [t, keys] of errors) {
    it('should throw an error', () => {
      expect(() => json2Csv(t, { keys })).to.Throw()
    })
  }

  it('should exclude titles', () => {
    expect(json2Csv({ a: 1, b: 2, c: 3 }, { excludeTitles: true })).to.be.deep.equal('"1","2","3"')
  })
})
