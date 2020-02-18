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
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.comment_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button size="small" icon="el-icon-edit"  @click.stop="handleEdit(scope.row,scope.index) " type="text">审核</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, update, remove} from "@/api/cms/comment";
  import {mapGetters} from "vuex";
  const DCStatus = [
    {
      label: "审核中",
      value: 0
    },
    {
      label: "已发布",
      value: 1
    }
  ];
  export default {
    data() {
      return {
        title:this.$route.params.title,
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
              label: "栏目名称",
              prop: "categoryId",
              search:true,
              type: "tree",
              dicUrl: "/api/bid-cms/category/tree?module=0",
              hide: true,
              props: {
                label: "title"
              },
              readonly:true,
              disabled:true,
              rules: [{
                required: false,
                message: "请输入栏目ID",
                trigger: "blur"
              }]
            },
            {
              label: "文章标题",
              prop: "title",
              search:true,
              readonly:true,
              rules: [{
                required: false,
                message: "请输入栏目内容的标题",
                trigger: "blur"
              }]
            },
            {
              label: "评论",
              prop: "content",
              readonly:true,
              overHidden:true,
              type:"textarea",
              row:true,
              span:24,
              rules: [{
                required: false,
                message: "请输入评论",
                trigger: "blur"
              }]
            },
            {
              label: "评论人",
              prop: "name",
              readonly:true,
              rules: [{
                required: false,
                message: "请输入评论人名称",
                trigger: "blur"
              }]
            },
            {
              label: "评论IP",
              prop: "ip",
              readonly:true,
              rules: [{
                required: false,
                message: "请输入评论IP",
                trigger: "blur"
              }]
            },
            {
              label: "评论时间",
              prop: "createtime",
              readonly:true,
              rules: [{
                required: false,
                message: "请输入创建时间",
                trigger: "blur"
              }]
            },
            {
              label: "评论状态",
              prop: "status",
              type: "radio",
              button: true,
              hide:false,
              border : true,
              search:true,
              dicData:DCStatus,
              rules: [{
                required: true,
                message: "请输入权重，越大越靠前",
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
          viewBtn: this.vaildData(this.permission.comment_view, false),
          delBtn: this.vaildData(this.permission.comment_delete, false),
          editBtn: this.vaildData(this.permission.comment_edit, false)
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
      handleEdit(row,index){
        this.$refs.crud.rowEdit(row, index);

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
        this.query=this.$route.query
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
