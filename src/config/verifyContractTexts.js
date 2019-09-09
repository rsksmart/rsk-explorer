const add = (label, description = '', input = {}) => {
  return { label, description, input }
}

export const messages = {
  INVALID_ADDRESS: 'invalid address',
  NOT_CONTRACT: 'Is not a contract',
  CONTRACT_INFO: 'Getting contract information',
  IS_VERIFIED: 'The contract is already verified',
  NOT_SOURCE: 'the source is empty',
  VERIFICATION_ERROR: 'Error verifiying contract',
  VERIFICATION_DONE: 'Contract verification successful',
  WAITING_VERIFICATION: 'Waiting for verifier',
  WAITING_FOR_RESULT: 'Waiting for the verification result',
  VERIFICATION_FAILED: 'Verification failed',
  REQUEST_VERIFICATION: 'Requesting verification',
  SHOW_RESULT: 'Go to contract page',
  VERIFIER_DATA_ERROR: 'Missing contract verifier data'
}

export const formFields = {
  ADDRESS: add('Contract Address'),
  NAME: add('Contract name', `Contract name declared in code, 
  \n e.g. contract MyContract {}
  \n 'MyContract' is the contract name.`),
  SOURCE: add('Source file', '.sol source file of contract'),
  FILES: add('Files', 'If the contract has imports, add each .sol file.'),
  VERSION: add('Compiler', 'Solidtiy version used to compile this contract'),
  OPTIMIZATION: add('Optimization', 'Solidity optimization settings used to compile this contract.'),
  RUNS: add('Optimization runs'),
  EVM: add('EVM version', ''),
  LIBRARIES: add('Contract Libraries', 'If the contract uses external libraries, add them here'),
  LIB_NAME: add('Library name', `The name of the library called by contract`, { placeholder: 'MyLibrary' }),
  LIB_ADDRESS: add('Library Address', 'Address of deployed library', { placeholder: '0x1000000000000000000000000000000000000001' })
}
