const add = (label, description = '') => { return { label, description } }

export const messages = {
  INVALID_ADDRESS: 'invalid address',
  NOT_CONTRACT: 'Is not a contract',
  IS_VERIFIED: 'The contract is already verified',
  NOT_SOURCE: 'the source is empty',
  VERIFICATION_ERROR: 'Error verifiying contract',
  VERIFICATION_DONE: 'Contract verification successful',
  WAITING_VERIFICATION: 'Waiting for verifier',
  WAITING_FOR_RESULT: 'Waiting for the verification result',
  VERIFICATION_FAILED: 'Verification failed'
}

export const formFields = {
  ADDRESS: add('Contract Address'),
  NAME: add('Contract name', 'Name of the contract in code'),
  SOURCE: add('Source file', '.sol source file of contract'),
  FILES: add('Files', 'If contract has imports, add .sol files'),
  VERSION: add('Compiler', 'Compiler version used in deployment'),
  OPTIMIZATION: add('Optimization Enabled', 'Optimization used on compilation'),
  RUNS: add('Optimization runs'),
  EVM: add('EVM version', ''),
  LIBRARIES: add('Contract Libraries', '...'),
  LIB_NAME: add('Library name'),
  LIB_ADDRESS: add('Library Address')
}
