export const isStrictAddress = address => {
  return /^0x[0-9a-f]{40}$/i.test(address)
}

export const isAddress = address => /^(0x)?[0-9a-f]{40}$/i.test(address)

export const isTx = tx => {
  if (!/^(0x)?[0-9a-f]{64}$/i.test(tx)) {
    // check if it has the basic requirements of an address
    return false
  } else if (/^(0x)?[0-9a-f]{64}$/.test(tx) || /^(0x)?[0-9A-F]{64}$/.test(tx)) {
    // If it's all small caps or all all caps, return true
    return true
  } else {
    // Otherwise check each case
    return false
  }
}
