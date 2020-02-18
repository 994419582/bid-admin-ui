const ora = require('ora');
const chalk = require('chalk');

const host = "39.100.208.235";
const user = "root";
const pass = "Teleinfo123*()";
const path = "/root/bid-admin-ui/";

const spinnerUpload = ora(`  正在上传文件至：${host + path}`);

let client = require('scp2');

client.scp('./dist/', {
  host: host,
  username: user,
  password: pass,
  path: path
}, function (err) {
  spinnerUpload.stop();
  if (err) {
    console.log(chalk.red(`  上传至：${host}出错,error is:`));
    console.log(chalk.red(err));
  } else {
    console.log(chalk.cyan(`  上传文件至${host}成功！`));
  }
});
