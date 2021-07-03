export const externalLibraries = {
  fields: {},
  formatFields: ({ fields, data }) => {
    for (const fieldName in data) {
      fields[fieldName] = { type: 'address', trim: 'auto' }
    }
    return fields
  }
}

export const compilationSettings = {
  fields: {
    contractName: null,
    compilerVersion: null,
    evmVersion: null,
    optimization: null
  }
}

export const constructorArguments = {
  fields: {
    encoded: {
      renderAs: 'big-field'
    },
    decoded: null
  }
}
