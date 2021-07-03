import chai from 'chai'

export function mochaGlobalSetup() {
  chai.use(require('chai-like'))
  chai.use(require('chai-things'))
}
