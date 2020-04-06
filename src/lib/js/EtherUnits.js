import BigNumber from 'bignumber.js'

export class EtherUnits {
  constructor () {
    this.unitMap = {
      wei: '1',
      kwei: '1000',
      ada: '1000',
      femtoether: '1000',
      mwei: '1000000',
      babbage: '1000000',
      picoether: '1000000',
      gwei: '1000000000',
      shannon: '1000000000',
      nanoether: '1000000000',
      nano: '1000000000',
      szabo: '1000000000000',
      microether: '1000000000000',
      micro: '1000000000000',
      finney: '1000000000000000',
      milliether: '1000000000000000',
      milli: '1000000000000000',
      ether: '1000000000000000000',
      kether: '1000000000000000000000',
      grand: '1000000000000000000000',
      einstein: '1000000000000000000000',
      mether: '1000000000000000000000000',
      gether: '1000000000000000000000000000',
      tether: '1000000000000000000000000000000'
    }
  }

  getValueOfUnit (unit) {
    unit = unit ? unit.toLowerCase() : 'ether'
    const unitValue = this.unitMap[unit]
    if (unitValue === undefined) {
      // eslint-disable-next-line
      console.log('ERROR')
    }
    return new BigNumber(unitValue, 10)
  }

  fiatToWei (number, pricePerEther) {
    const returnValue = new BigNumber(String(number))
      .div(pricePerEther)
      .times(this.getValueOfUnit('ether'))
      .round(0)
    return returnValue.toString(10)
  }

  toFiat (number, unit, multi) {
    const returnValue = new BigNumber(this.toEther(number, unit))
      .times(multi)
      .round(5)
    return returnValue.toString(10)
  }

  toEther (number, unit) {
    const returnValue = new BigNumber(this.toWei(number, unit)).div(
      this.getValueOfUnit('ether')
    )
    return returnValue.toString(10)
  }

  toWei (number, unit) {
    const returnValue = new BigNumber(String(number)).times(
      this.getValueOfUnit(unit)
    )
    return returnValue.toString(10)
  }
}

const ethUnits = new EtherUnits()
export default ethUnits
