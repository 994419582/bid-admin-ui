import abis from './index'

export function ContractAbi (abis) {
  let myAbi = {}
  for (let i in abis) {
    myAbi[i] = {}
    abis[i].abi.map(item => {
      let name = item.name
      myAbi[i][name] = item
    })
  }
  return myAbi;
}

const abi = ContractAbi(abis);

export default abi
