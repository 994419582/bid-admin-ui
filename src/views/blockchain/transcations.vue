<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/blockchain/transcations";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          editBtn:false,
          addBtn:false,
          selection: true,
          column: [
            {
              label: "交易哈希",
              prop: "hash",
              rules: [{
                required: true,
                message: "请输入交易哈希",
                trigger: "blur"
              }]
            },
            {
              label: "交易nonce",
              prop: "nonce",
              rules: [{
                required: true,
                message: "请输入交易nonce",
                trigger: "blur"
              }]
            },
            {
              label: "区块哈希",
              prop: "blockHash",
              rules: [{
                required: true,
                message: "请输入区块哈希",
                trigger: "blur"
              }]
            },
            {
              label: "区块高度",
              prop: "blockNumber",
              rules: [{
                required: true,
                message: "请输入区块高度",
                trigger: "blur"
              }]
            },
            {
              label: "交易索引",
              prop: "transactionIndex",
              rules: [{
                required: true,
                message: "请输入交易索引",
                trigger: "blur"
              }]
            },
            {
              label: "发送人",
              prop: "txfrom",
              rules: [{
                required: true,
                message: "请输入发送人",
                trigger: "blur"
              }]
            },
            {
              label: "接收人",
              prop: "txto",
              rules: [{
                required: true,
                message: "请输入接收人",
                trigger: "blur"
              }]
            },
            {
              label: "交易值",
              prop: "txvalue",
              rules: [{
                required: true,
                message: "请输入交易值",
                trigger: "blur"
              }]
            },
            {
              label: "gasPrice",
              prop: "gasPrice",
              rules: [{
                required: true,
                message: "请输入gasPrice",
                trigger: "blur"
              }]
            },
            {
              label: "gas",
              prop: "gas",
              rules: [{
                required: true,
                message: "请输入gas",
                trigger: "blur"
              }]
            },
            {
              label: "输入参数",
              prop: "txinput",
              hide:true,
              rules: [{
                required: true,
                message: "请输入输入参数",
                trigger: "blur"
              }]
            },
            {
              label: "交易创建时间",
              prop: "creates",
              hide:true,
              rules: [{
                required: true,
                message: "请输入交易创建时间",
                trigger: "blur"
              }]
            },
            {
              label: "用户公钥",
              prop: "publicKey",
              hide:true,
              rules: [{
                required: true,
                message: "请输入用户公钥",
                trigger: "blur"
              }]
            },
            {
              label: "其他字段",
              prop: "raw",
              hide:true,
              rules: [{
                required: true,
                message: "请输入其他字段",
                trigger: "blur"
              }]
            },
            {
              label: "签名字段r",
              prop: "r",
              hide:true,
              rules: [{
                required: true,
                message: "请输入签名字段r",
                trigger: "blur"
              }]
            },
            {
              label: "签名字段s",
              prop: "s",
              hide:true,
              rules: [{
                required: true,
                message: "请输入签名字段s",
                trigger: "blur"
              }]
            },
            {
              label: "签名字段v",
              prop: "v",
              hide:true,
              rules: [{
                required: true,
                message: "请输入签名字段v",
                trigger: "blur"
              }]
            },
            {
              label: "创建日期",
              prop: "createDate",
              rules: [{
                required: true,
                message: "请输入创建日期",
                trigger: "blur"
              }]
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.transcations_add, false),
          viewBtn: this.vaildData(this.permission.transcations_view, false),
          delBtn: this.vaildData(this.permission.transcations_delete, false),
          editBtn: this.vaildData(this.permission.transcations_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowSave(row, loading, done) {
        add(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowUpdate(row, index, loading, done) {
        update(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          done();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params) {
        this.query = params;
        this.onLoad(this.page, params);
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
