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
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.site_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/cms/site";
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
          width:100,
          column: [
            {
              label: "站点名称",
              prop: "name",
              // row: true,
              // selection: true,
              search: true,
              rules: [{
                required: true,
                message: "请输入站点名称",
                trigger: "blur"
              }]
            },
            {
              label: "站点标题",
              prop: "title",
              search: true,
              rules: [{
                required: true,
                message: "请输入站点标题",
                trigger: "blur"
              }]
            },
            {
              label: "站点域名",
              prop: "domain",
              search: true,
              rules: [{
                required: true,
                message: "请输入站点域名",
                trigger: "blur"
              }]
            },
            {
              label: "关键字",
              prop: "keywords",
              rules: [{
                required: false,
                message: "请输入关键字",
                trigger: "blur"
              }]
            },
            {
              label: "版权信息",
              prop: "copyright",
              // row: true,
              span: 24,

              rules: [{
                required: false,
                message: "请输入版权信息",
                trigger: "blur"
              }]
            },{
              label: 'logo',
              type: 'upload',
              listType: 'picture-img',
              propsHttp: {
                name : 'name',
                url : 'hash'
              },
              action: '/api/bid-blockchain/ipfs/uploadFile',
              tip: '只能上传jpg/png logo，且不超过500kb',
              span: 12,
              row: false,
              prop: 'logo'
            },
            {
              label: "备注",
              prop: "remarks",
              type:"textarea",
              rules: [{
                required: false,
                message: "请输入备注",
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
          addBtn: this.vaildData(this.permission.site_add, false),
          viewBtn: this.vaildData(this.permission.site_view, false),
          delBtn: this.vaildData(this.permission.site_delete, false),
          editBtn: this.vaildData(this.permission.site_edit, false)
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
      //文件上传成功的钩子函数
      // handleSuccess(res, done,loading) {
      //   // loading();
      //   // if (res.code==200){
      //   //   // debugger
      //   //   this.$message({
      //   //     type: 'info',
      //   //     message: '图片上传成功',
      //   //     duration: 6000
      //   //   });
      //   // }else {
      //   //   this.$message({
      //   //     type: 'error',
      //   //     message: '图片上传失败',
      //   //     duration: 6000
      //   //   });
      //   // }
      // },
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
