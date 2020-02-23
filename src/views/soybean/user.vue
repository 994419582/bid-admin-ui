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
                   v-if="permission.user_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/soybean/user";
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
          column: [
            {
              label: "主键",
              prop: "id",
              rules: [{
                required: true,
                message: "请输入主键",
                trigger: "blur"
              }]
            },
            {
              label: "微信ID",
              prop: "wechatId",
              rules: [{
                required: true,
                message: "请输入微信ID",
                trigger: "blur"
              }]
            },
            {
              label: "微信昵称",
              prop: "nickname",
              rules: [{
                required: true,
                message: "请输入微信昵称",
                trigger: "blur"
              }]
            },
            {
              label: "姓名",
              prop: "name",
              rules: [{
                required: true,
                message: "请输入姓名",
                trigger: "blur"
              }]
            },
            {
              label: "联系电话",
              prop: "phone",
              rules: [{
                required: true,
                message: "请输入联系电话",
                trigger: "blur"
              }]
            },
            {
              label: "证件类型ID",
              prop: "idType",
              rules: [{
                required: true,
                message: "请输入证件类型ID",
                trigger: "blur"
              }]
            },
            {
              label: "证件号码",
              prop: "idNumber",
              rules: [{
                required: true,
                message: "请输入证件号码",
                trigger: "blur"
              }]
            },
            {
              label: "备注",
              prop: "remarks",
              rules: [{
                required: true,
                message: "请输入备注",
                trigger: "blur"
              }]
            },
            {
              label: "性别",
              prop: "gender",
              rules: [{
                required: true,
                message: "请输入性别",
                trigger: "blur"
              }]
            },
            {
              label: "国家",
              prop: "country",
              rules: [{
                required: true,
                message: "请输入国家",
                trigger: "blur"
              }]
            },
            {
              label: "省",
              prop: "province",
              rules: [{
                required: true,
                message: "请输入省",
                trigger: "blur"
              }]
            },
            {
              label: "市",
              prop: "city",
              rules: [{
                required: true,
                message: "请输入市",
                trigger: "blur"
              }]
            },
            {
              label: "头像",
              prop: "avatarUrl",
              rules: [{
                required: true,
                message: "请输入头像",
                trigger: "blur"
              }]
            },
            {
              label: "居家观察地址",
              prop: "homeId",
              rules: [{
                required: true,
                message: "请输入居家观察地址",
                trigger: "blur"
              }]
            },
            {
              label: "居住地址",
              prop: "homeAddress",
              rules: [{
                required: true,
                message: "请输入居住地址",
                trigger: "blur"
              }]
            },
            {
              label: "详细地址",
              prop: "detailAddress",
              rules: [{
                required: true,
                message: "请输入详细地址",
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
          addBtn: this.vaildData(this.permission.user_add, false),
          viewBtn: this.vaildData(this.permission.user_view, false),
          delBtn: this.vaildData(this.permission.user_delete, false),
          editBtn: this.vaildData(this.permission.user_edit, false)
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