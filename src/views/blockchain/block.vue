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
  import {getList, getDetail, add, update, remove} from "@/api/blockchain/block";
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
              label: "区块高度",
              prop: "number",
              rules: [{
                required: true,
                message: "请输入区块高度",
                trigger: "blur"
              }]
            },
            {
              label: "区块哈希",
              prop: "hash",
              rules: [{
                required: true,
                message: "请输入区块哈希",
                trigger: "blur"
              }]
            },
            {
              label: "父哈希",
              prop: "parentHash",
              rules: [{
                required: true,
                message: "请输入父哈希",
                trigger: "blur"
              }]
            },
            {
              label: "随机值",
              prop: "nonce",
              hide:true,
              rules: [{
                required: true,
                message: "请输入随机值",
                trigger: "blur"
              }]
            },
            {
              label: "叔区块加密值",
              prop: "sha3Uncles",
              hide:true,
              rules: [{
                required: true,
                message: "请输入叔区块加密值",
                trigger: "blur"
              }]
            },
            {
              label: "过滤器",
              prop: "logsBloom",
              hide:true,
              rules: [{
                required: true,
                message: "请输入过滤器",
                trigger: "blur"
              }]
            },
            {
              label: "交易根哈希",
              prop: "transactionsRoot",
              rules: [{
                required: true,
                message: "请输入交易根哈希",
                trigger: "blur"
              }]
            },
            {
              label: "状态根哈希",
              prop: "stateRoot",
              rules: [{
                required: true,
                message: "请输入状态根哈希",
                trigger: "blur"
              }]
            },
            {
              label: "收据根哈希",
              prop: "receiptsRoot",
              rules: [{
                required: true,
                message: "请输入收据根哈希",
                trigger: "blur"
              }]
            },
            {
              label: "作者",
              prop: "author",
              hide:true,
              rules: [{
                required: true,
                message: "请输入作者",
                trigger: "blur"
              }]
            },
            {
              label: "矿工地址",
              prop: "miner",
              rules: [{
                required: true,
                message: "请输入矿工地址",
                trigger: "blur"
              }]
            },
            {
              label: "最大值哈希",
              prop: "mixHash",
              hide:true,
              rules: [{
                required: true,
                message: "请输入最大值哈希",
                trigger: "blur"
              }]
            },
            {
              label: "挖矿难度",
              prop: "difficulty",
              hide:true,
              rules: [{
                required: true,
                message: "请输入挖矿难度",
                trigger: "blur"
              }]
            },
            {
              label: "总难度",
              prop: "totalDifficulty",
              hide:true,
              rules: [{
                required: true,
                message: "请输入总难度",
                trigger: "blur"
              }]
            },
            {
              label: "其他字段",
              prop: "extraData",
              hide:true,
              rules: [{
                required: true,
                message: "请输入其他字段",
                trigger: "blur"
              }]
            },
            {
              label: "区块大小",
              prop: "size",
              rules: [{
                required: true,
                message: "请输入区块大小",
                trigger: "blur"
              }]
            },
            {
              label: "gasLimit",
              prop: "gasLimit",
              rules: [{
                required: true,
                message: "请输入gasLimit",
                trigger: "blur"
              }]
            },
            {
              label: "gasUsed",
              prop: "gasUsed",
              rules: [{
                required: true,
                message: "请输入gasUsed",
                trigger: "blur"
              }]
            },
            {
              label: "时间",
              prop: "timestamp",
              rules: [{
                required: true,
                message: "请输入时间",
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
          addBtn: this.vaildData(this.permission.block_add, false),
          viewBtn: this.vaildData(this.permission.block_view, false),
          delBtn: this.vaildData(this.permission.block_delete, false),
          editBtn: this.vaildData(this.permission.block_edit, false)
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
