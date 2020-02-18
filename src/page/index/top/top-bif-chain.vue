<template>
  <span>
    <i class="el-icon-paperclip"
       @click="handleBIfChain"></i>
    <el-dialog title="设置链地址"
               :visible.sync="box"
               width="30%"
               append-to-body>
      <el-form :model="form"
               ref="form"
               label-width="80px">
        <el-form-item label="链地址"
                      prop="chainUrl"
                      :rules="[{ required: true, message: '链地址不能为空'}]">
                <el-input v-model="form.chainUrl"
                  placeholder="请输入链地址"></el-input>
        </el-form-item>
        <el-form-item label="链ID"
            prop="chainId"
            :rules="[{ required: true, message: '链ID不能为空'}]">
                <el-input v-model="form.chainId"
                  placeholder="请输入链ID"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleSetBIfChain">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
const Bif = require("bif-main")
import { mapGetters } from "vuex";
export default {
  name: "top-lock",
  data() {
    return {
      box: false,
      form: {
        chainUrl: "http://36.112.25.14:5320",
        chainId: 444,
      }
    };
  },
  created() {},
  mounted() {},
  props: [],
  methods: {
    handleSetBIfChain() {
      let that = this;
      that.$refs["form"].validate(valid => {
        if (valid) {

          let bif = new Bif(that.form.chainUrl)
          bif.core.getCoinbase().then(r => {
            if (r) {
              that.$store.dispatch('UPDATE_BIF', bif);
              that.$store.dispatch('UPDATE_CHAINID', Number(that.form.chainId));
              that.$message({
                type: "success",
                message: "Bif链连接成功!"
              });
              that.box = false;
            } else {
              that.$message({
                type: "fail",
                message: "Bif链连接失败!"
              });
            }
          }).catch(e => {
            that.$message({
              type: "fail",
              message: "Bif链连接失败!"
            });
          })
        }
      });
    },
    handleBIfChain() {
      this.box = true;
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
</style>
