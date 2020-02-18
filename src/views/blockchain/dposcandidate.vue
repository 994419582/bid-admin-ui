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
  import {getList, getDetail, add, update, remove} from "@/api/blockchain/dposcandidate";
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
          editBtn:false,
          addBtn:false,
          delBtn:false,
          column: [
            {
              label: "候选人BID",
              prop: "owner",
              search:true,
              rules: [{
                required: true,
                message: "请输入候选人BID",
                trigger: "blur"
              }]
            },
            {
              label: "获投票数",
              prop: "voteCount",
              rules: [{
                required: true,
                message: "请输入获投票数",
                trigger: "blur"
              }]
            },
            {
              label: "是否当选",
              prop: "active",
              rules: [{
                required: true,
                message: "请输入是否激活",
                trigger: "blur"
              }]
            },
            {
              label: "超级节点URL",
              prop: "url",
              hide:true,
              rules: [{
                required: true,
                message: "请输入超级节点URL",
                trigger: "blur"
              }]
            },
            {
              label: "节点名称",
              prop: "name",
              search:true,
              rules: [{
                required: true,
                message: "请输入节点名称",
                trigger: "blur"
              }]
            },
            {
              label: "节点IP",
              prop: "ip",
              rules: [{
                required: true,
                message: "请输入超级节点IP",
                trigger: "blur"
              }]
            },
            {
              label: "节点位置",
              prop: "location",
              rules: [{
                required: true,
                message: "请输入超级节点位置",
                trigger: "blur"
              }]
            },
            {
              label: "总激励数",
              prop: "totalBounty",
              rules: [{
                required: true,
                message: "请输入获得的总激励数",
                trigger: "blur"
              }]
            },
            {
              label: "已提取激励数",
              prop: "extractedBounty",
              rules: [{
                required: true,
                message: "请输入已提取激励数",
                trigger: "blur"
              }]
            },
            {
              label: "最后提取时间",
              prop: "lastExtractTime",
              rules: [{
                required: true,
                message: "请输入最后提取时间",
                trigger: "blur"
              }]
            },
            {
              label: "网址",
              prop: "website",
              hide:true,
              rules: [{
                required: true,
                message: "请输入网址",
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
          addBtn: this.vaildData(this.permission.dposcandidate_add, false),
          viewBtn: this.vaildData(this.permission.dposcandidate_view, false),
          delBtn: this.vaildData(this.permission.dposcandidate_delete, false),
          editBtn: this.vaildData(this.permission.dposcandidate_edit, false)
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
