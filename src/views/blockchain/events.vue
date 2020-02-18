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
  import {getList, getDetail, add, update, remove} from "@/api/blockchain/events";
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
          addBtn:false,
          editBtn:false,
          selection: true,
          column: [
            {
              label: "交易hash",
              prop: "transactionHash",
              rules: [{
                required: true,
                message: "请输入交易hash",
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
              label: "区块hash",
              prop: "blockHash",
              rules: [{
                required: true,
                message: "请输入区块hash",
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
              label: "gas",
              prop: "cumulativeGasUsed",
              rules: [{
                required: true,
                message: "请输入gas",
                trigger: "blur"
              }]
            },
            {
              label: "gas使用量",
              prop: "gasUsed",
              rules: [{
                required: true,
                message: "请输入gas使用量",
                trigger: "blur"
              }]
            },
            {
              label: "合约地址",
              prop: "contractAddress",
              hide:true,
              rules: [{
                required: true,
                message: "请输入合约地址",
                trigger: "blur"
              }]
            },
            {
              label: "收据根哈希",
              prop: "root",
              rules: [{
                required: true,
                message: "请输入收据根哈希",
                trigger: "blur"
              }]
            },
            {
              label: "发送者",
              prop: "txfrom",
              rules: [{
                required: true,
                message: "请输入发送者",
                trigger: "blur"
              }]
            },
            {
              label: "接受者",
              prop: "txto",
              rules: [{
                required: true,
                message: "请输入接受者",
                trigger: "blur"
              }]
            },
            {
              label: "交易事件",
              prop: "events",
              hide:true,
              rules: [{
                required: true,
                message: "请输入交易事件",
                trigger: "blur"
              }]
            },
            {
              label: "log布隆过滤",
              prop: "logsBloom",
              hide:true,
              rules: [{
                required: true,
                message: "请输入log布隆过滤",
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
          addBtn: this.vaildData(this.permission.events_add, false),
          viewBtn: this.vaildData(this.permission.events_view, false),
          delBtn: this.vaildData(this.permission.events_delete, false),
          editBtn: this.vaildData(this.permission.events_edit, false)
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
