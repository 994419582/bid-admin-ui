<template>
  <span>
    <i class="el-icon-wallet"
       @click="handleWallet"></i>
    <el-dialog title="钱包"
               :visible.sync="box"
               width="30%"
               append-to-body>

      <div class="wallet-wrap">
        <h1 class="title" align="center">选择一种方式打开钱包</h1>

        <div class="content">
          <div class="private-key" v-if="isPrivateKey">
            <el-input v-model.trim="unlockPrivateKey" placeholder="粘贴/输入您的私钥"></el-input>
          </div>
        </div>
        <div class="wallet-footer">
          <div class="err-msg">{{ errMsg }}</div>
          <div v-if="isPrivateKey" class="btn"><el-button type="primary" @click="unlockByPrivateKey">解锁钱包</el-button></div>
          <div v-if="!isPrivateKey" class="key-store-pass">
            <label class="key-store-btn">
              <input id="keystoreFile" ref="keystoreFile" class="import-file-default" type="file" @change="importKeyStore">
              <div class="el-button import-btn">
                选择密钥库文件
              </div>
            </label>
            <div v-show="keyObject">
              <div class="wallet-password">
                <el-input v-model="unlockKeyStorePwd" placeholder="请输入密码" type="password" />
              </div>
              <div class="btn"><el-button type="primary" @click="unlockByKeyStore">解锁钱包</el-button></div>
            </div>
          </div>
        </div>
        <div class="wallet-switch" @click="togglePrivateKey">
          <div class="btn-wallet-switch" :class="{'active': isPrivateKey}">私钥</div>
          <div class="btn-wallet-switch" :class="{'active': !isPrivateKey}">密钥库</div>
        </div>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "top-lock",
  data() {
    return {
      box: false,

      keyObject: null,
      privateKey: '',
      unlockKeyStorePwd: '',
      unlockPrivateKey: 'd37df84af4156fe9ab65a5642418cd7bd9e9371acb5ae1bd282d1d473bcb1f13',

      isPrivateKey: true,
      errMsg: ''
    }
  },
  created() {},
  mounted() {},
  props: [],
  methods: {
    handleWallet() {
      this.box = true;
      if (!this.bif.core) {
        this.errMsg = '请先进行Bif链的连接！';
        return;
      } else {
        this.errMsg = '';
      }
    },
    togglePrivateKey() {
      this.keyObject = null;
      this.errMsg = '';
      this.unlockKeyStorePwd = '';
      this.isPrivateKey = !this.isPrivateKey;
    },
    updateVuexWalletData (walletData) {
      this.$store.dispatch('SET_WALLET', walletData)
    },
    importKeyStore () {
      let fileReader = new FileReader();
      let file = this.$refs.keystoreFile.files[0];
      if (file) {
        fileReader.readAsText(file);
      }
      let that = this;

      fileReader.onload = function () {
        try {
          let keyObject = JSON.parse(this.result);
          that.keyObject = keyObject;
        } catch (error) {
          that.errMsg = '这不是有效的钱包文件';
        }
      }
    },

    unlockByKeyStore () {
      if (!this.bif.core) {
        this.errMsg = '请先进行Bif链的连接！';
        return;
      } else {
        this.errMsg = '';
      }

      if (!this.unlockKeyStorePwd) {
        this.unlockKeyStorePwd = '';
      } else if (this.unlockKeyStorePwd.length === 0) {
        this.unlockKeyStorePwd = '';
      }
      
      try {
        let wallet = this.bif.core.accounts.decrypt(this.keyObject, this.unlockKeyStorePwd);
        this.unlockSuccess(wallet);
      } catch (e) {
        this.errMsg = '请输入正确密码';
      }
    },
// did:bid:([0-9a-fA-F]){24}
    unlockByPrivateKey () {

      if (!this.bif.core) {
        this.errMsg = '请先进行Bif链的连接！';
        return;
      } else {
        this.errMsg = '';
      }

      let privateKey = this.unlockPrivateKey;
      let reg = /^(0x)?[0-9a-f]{64}$/i;
      if (reg.test(privateKey)) {
        this.unlockLoading = true;
        privateKey = privateKey.startsWith('0x') ? privateKey : '0x'+privateKey;
        try {
          let wallet = this.bif.core.accounts.privateKeyToAccount(privateKey);
          this.privateKey = privateKey;
          this.keyObject = {
            address: wallet.address
          }
          this.unlockSuccess(wallet);
        } catch (e) {
          this.unlockLoading = false;
          this.errMsg = '请输入正确密钥';
          console.log(e);
          
        }
      } else {
        this.errMsg = '请输入正确密钥';
      }
    },

    unlockSuccess (wallet) {
      this.privateKey = wallet.privateKey;

      this.bif.core.getBalance(this.keyObject.address, (e, d) => {
        let walletData = {
          keyObject: this.keyObject,
          privateKey: this.privateKey,
          balance: this.bif.utils.fromWei(d)
        }
        this.updateVuexWalletData(walletData);
        this.success(walletData);

        this.unlockLoading = false;
        this.box = false;
        this.$message({
          type: "success",
          message: "钱包打开成功!"
        });
        // this.unlockPrivateKey = '';
      })
    },
    
    success (data) {
      this.$emit('unlockWalletSuccess', data);
    },
  },
  components: {},
	computed: {
    ...mapGetters(['bif'])
	}
};
</script>

<style lang="scss" scoped>
.wallet-wrap {
  position: relative;
  padding: 0 30px;
  .title {
    margin: 0 auto;
    line-height: 80px;
    text-align: center;
    font-size: 24px;
  }
  .content {
    min-height: 40px;
    padding: 20px;
    background: #f0f0f0;
    border-radius: 20px;
    .private-key {
      border-radius: 20px;
      .el-input .el-input__inner {
        border-radius: 20px;
      }
    }
    .key-store {
      border-radius: 20px;
    }
  }
  .wallet-footer {
    position: relative;
    width: 100%;
    min-height: 20px;
    padding-bottom: 20px;
    .err-msg {
      position: absolute;
      top: -20px;
      left: 50%;
      right: 50%;
      width: 200px;
      height: 12px;
      margin-top: -6px;
      margin-left: -100px;
      text-align: center;
      line-height: 12px;
      font-size: 12px;
      color: #e54040;
    }
    .btn {
      width: 160px;
      margin: 30px auto 0 auto;
      .el-button {
        width: 160px;
        border-radius: 20px;
        background-color: rgb(3, 137, 234);
        color: #fff;
      }
    }
    .key-store-pass {
      .key-store-btn {
        display: block;
        width: 160px;
        margin: 30px auto 0 auto;
        .import-file-default {
          display: none;
        }
        .import-btn {
          width: 160px;
          border-radius: 20px;
          background-color: rgb(3, 137, 234);
          color: #fff;
        }
      }
      .wallet-password {
        padding: 20px 0 30px 0;
        border-top: 1px solid rgba(7, 17, 27, 0.1);
      }
      .el-input .el-input__inner {
        border-radius: 20px;
      }
      .btn {
        width: 160px;
        margin: 0 auto;
        .el-button {
          width: 160px;
          background-color: rgb(3, 137, 234);
        }
      }
    }
  }
  .wallet-switch {
    position: absolute;
    padding: 1px;
    top: -35px;
    right: 30px;
    width: 160px;
    height: 40px;
    background: #fff;
    border-radius: 20px;
    border: 1px solid blue;
    font-size: 0;
    .btn-wallet-switch {
      display: inline-block;
      width: 80px;
      height: 40px;
      border-radius: 18px;
      text-align: center;
      font-size: 16px;
      line-height: 36px;
      cursor: pointer;
      &.active {
        background: rgb(3, 137, 234);
        color: #fff;
      }
    }
  }
}
</style>
