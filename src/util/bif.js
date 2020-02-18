import Buffer from 'safe-buffer';
var BifTx = require("bifjs-tx").Transaction;
import CryptoJS from 'crypto-js';

const BifCoreAbi = require("bif-core-abi")

import store from '@/store';
import abis from '@/abi';

export function contract(bif) {
         const contract = {};

         for (let key in abis) {
           let abi = abis[key];
           contract[key + "Contract"] = new bif.core.Contract(abi.abi, abi.address);
         }
         return contract;
       }

/**
 * 获取当前gasprice
 *
 * @returns
 */
function getGasPrice(bif) {
  return new Promise(resolve => {
    bif.core.getGasPrice(function(err, result) {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * 获取钱包地址交易的nonce信息
 *
 * @param {address} address 钱包地址
 * @returns
 */
function getNonce(bif, address) {
  return new Promise(resolve => {
    bif.core.getTransactionCount(address, function(err, result) {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * 获取gaslimit
 *
 * @param {string} [obj={to: '', data: ''}] 合约地址 交易数据
 * @returns gaslimit数据
 */
function getGasLimit(bif, obj = {
  to: '',
  data: ''
}) {
  return new Promise(resolve => {
    bif.core.estimateGas(obj, function(err, result) {
      if (err) {
        throw err;
      } else {
        resolve(result);
      }
    });
  })
}

/**
 * 获取当前区块的基本 信息
 *
 * * @export
 * @param {address} walletAddress 钱包地址
 * @param {address} contractAddress 合约地址
 * @param {0x string} signData 签名后逇交易数据
 * @returns gasprice nonce gaslimit组成的数组
 */
function getTransactionBaseData(bif, walletAddress, contractAddress, signData) {
  return Promise.all([getGasPrice(bif), getNonce(bif, walletAddress), getGasLimit(bif, {
    to: contractAddress,
    data: signData
  })]).then(blockData => {
    let baseData = {
      gasPrice: bif.utils.toHex(blockData[0]),
      nonce: bif.utils.toHex(blockData[1]),
      gasLimit: bif.utils.toHex(blockData[2])
    };
    return baseData
  })
}

/**
 * 生成原始交易 json 对象
 *
 * * @export
 * @param {address} contractAddress 合约地址
 * @param {0x string} signData sololitycode encode后的 data 数据
 * @returns {object} 原始交易json对象
 */
async function getRawTxObj(bif, contractAddress, signData, value) {
  let walletAddress = store.getters.keyObject.address;
  value = value || 0;
  return new Promise(resolve => {
    getTransactionBaseData(bif, walletAddress, contractAddress, signData).then(
      blockPriceData => {
        let data = Object.assign(
          {},
          {
            from: walletAddress,
            to: contractAddress,
            value: bif.utils.toHex(value),
            data: signData
          },
          blockPriceData
        );
        resolve(data);
      }
    );
  });
}

/**
 * 私钥签名原始交易
 *
 * * @export
 * @param {obj} rawTxObj 原始交易的json对象
 * @returns {ox string} 私钥签名后的原始交易 十六进制
 */
function getRawTx(rawTxObj, chainId) {
  let tx = new BifTx(rawTxObj, {'chain':{'chainId':chainId, 'networkId':chainId, 'genesis': {}, 'hardforks': {}, 'bootstrapNodes': {}}});
  let pk = store.getters.privateKey;
  if (pk.startsWith('0x')) {
    pk = pk.slice(2);
  }

  let privateKey = new Buffer.Buffer(pk, 'hex');
  tx.sign(privateKey);
  let serializedTx = tx.serialize();
  return '0x' + serializedTx.toString('hex');
}

/**
 * 生成 sendRawTransaction 中data
 * @param {object} func bid中具体abi的json对象
 * @param {array} inputs 需要传递的参数，默认为空
 * @returns
 */
function getRawTxData(func, inputs = []) {
  let types = func.inputs.map(function (input) {
    return input.type;
  });
  var fullFuncName = func.name + '(' + types.join() + ')';
  var funcSig = CryptoJS.SHA3(fullFuncName, {
    outputLength: 256
  }).toString(CryptoJS.enc.Hex).slice(0, 8);
  
  return '0x' + funcSig + BifCoreAbi.AbiCoder().encodeParameters(types, inputs).substring(2);
}

/**
 * 发送未签名的交易
 *
 * @export
 * @param {address} contractAddress 调用的合约地址
 * @param {ox string} signData 原始交易json对象
 * @returns 交易的hash
 */
export function signedTransaction(bif, chainId, contractAddress, func, inputs) {
         return new Promise((resolve, reject) => {
           let signData = getRawTxData(func, inputs);
           getRawTxObj(bif, contractAddress, signData).then(rawTxObj => {
             let rawTx = getRawTx(rawTxObj, chainId);
             resolve(rawTx);
           });
         });
       }

/**
 * 发送未签名的交易
 *
 * @export
 * @param {address} contractAddress 调用的合约地址
 * @param {ox string} signData 原始交易json对象
 * @returns 交易的hash
 */
export function signedTransactionValue(bif, chainId, contractAddress, func, inputs, value) {
  return new Promise((resolve, reject) => {
    let signData = getRawTxData(func, inputs)
    getRawTxObj(bif, contractAddress, signData, value).then(rawTxObj => {
      let rawTx = getRawTx(rawTxObj, chainId);
      resolve(rawTx);
    });
  })
}
