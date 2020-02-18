const fs = require('fs');
const path = require('path')


const jsonPath = './src/abijson'
const dirPath = './src/api'
let netWork = 1025

console.log('读取的文件路径是：' + jsonPath)


function getAbis(files) {
  return new Promise((resolve, reject) => {
    let abis = {}
    fs.readdir(jsonPath, (err, files) => {
      if (err) {
        reject(err)
      }
      files.map(file => {
        if (path.extname(file) != '.json') {
          return false;
        }
        let filePath = path.resolve(jsonPath, file);
        let data = fs.readFileSync(filePath)
        let fileData = JSON.parse(data);
        console.log(typeof fileData)
        // 当abi文件中的networks中只有一个网络端口（节点）使用唯一的端口号
        let netWorks = Object.keys(fileData.networks)

        netWork = netWorks.length === 1 ? netWorks[0] : netWork
        let abiName = path.basename(file, '.json');
        console.log(netWork)
        console.log(fileData.networks)
        console.log(fileData.networks[netWork])
        abis[abiName] = {
          address: fileData.networks[netWork].address,
          abi: fileData.abi
        }
      })
      abis = JSON.stringify(abis).replace(/\"/g, '\'')
      let abisString = `const abis = ${abis}
      export default abis;`
      // abis = abisString.splice(2,-1)
      resolve(abisString)
    })
  })
}

let abiFileName = './src/abi/index.js';
getAbis(jsonPath).then(abis => {
  let fileContent = abis
  fs.writeFile(abiFileName, fileContent, (e) => {
    if (!e) {
      console.log(`abi文件生成结束,写入路径：${jsonPath + abiFileName}`)
    }
  })
}).catch(err => {
  console.error(`写入文件失败：error is <br/>${err}`)
})
