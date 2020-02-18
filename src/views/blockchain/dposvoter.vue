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
  import {getList, getDetail, add, update, remove} from "@/api/blockchain/dposvoter";
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
          selection: true,
          addBtn:false,
          delBtn:false,
          editBtn:false,
          column: [

            {
              label: "投票人bid",
              prop: "owner",
              search:true,
              rules: [{
                required: true,
                message: "请输入投票人地址",
                trigger: "blur"
              }]
            },
            {
              label: "抵押bifer",
              prop: "stakeCount",
              rules: [{
                required: true,
                message: "请输入投票人地址",
                trigger: "blur"
              }]
            },
            {
              label: "抵押时间",
              prop: "stakeTime",
              rules: [{
                required: true,
                message: "请输入投票人地址",
                trigger: "blur"
              }]
            },

            {
              label: "是否为代理投票",
              prop: "isProxy",
              rules: [{
                required: true,
                message: "请输入是否为地址投票",
                trigger: "blur"
              }]
            },
            {
              label: "代理票数",
              prop: "proxyVoteCount",
              rules: [{
                required: true,
                message: "请输入收到的代理票数",
                trigger: "blur"
              }]
            },
            {
              label: "代理人bid",
              prop: "proxy",
              search:true,
              rules: [{
                required: true,
                message: "请输入代理人地址",
                trigger: "blur"
              }]
            },
            {
              label: "总投票数",
              prop: "lastVoteCount",
              rules: [{
                required: true,
                message: "请输入投的票数",
                trigger: "blur"
              }]
            },
            {
              label: "投票时间",
              prop: "voteTime",
              rules: [{
                required: true,
                message: "请输入投票时间",
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
          addBtn: this.vaildData(this.permission.dposvoter_add, false),
          viewBtn: this.vaildData(this.permission.dposvoter_view, false),
          delBtn: this.vaildData(this.permission.dposvoter_delete, false),
          editBtn: this.vaildData(this.permission.dposvoter_edit, false)
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
