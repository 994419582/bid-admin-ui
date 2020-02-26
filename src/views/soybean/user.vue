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
  import {isvalidatemobile} from '@/util/validate';

  export default {
    data() {
      const validatePhone = (rule, value, callback) => {
        if (isvalidatemobile(value)[0]) {
          callback(new Error(isvalidatemobile(value)[1]));
        } else {
          callback();
        }
      };
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
              label: "微信ID",
              prop: "wechatId",
              editDisplay: false,
              rules: [{
                required: true,
                message: "请输入微信ID",
                trigger: "blur"
              }]
            },
            {
              label: "微信昵称",
              prop: "nickname",
              editDisplay: false,
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
              rules: [{required: true, validator: validatePhone, trigger: 'blur'}]
            },
            {
              label: "证件类型",
              prop: "idType",
              type: "select",
              dicUrl: "/api/bid-system/dict/dictionary?code=id_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              hide: true,
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
              prop: "remarks"
            },
            {
              label: "性别",
              prop: "gender",
              type: "select",
              dicUrl: "/api/bid-system/dict/dictionary?code=sex",
              props: {
                label: "dictValue",
                value: "dictKey"
              }
            },
            {
              label: "头像",
              prop: "avatarUrl",
              editDisplay: false,
            },
            {
              label: "居住地址",
              prop: "homeAddress",
              type:"textarea",
              row:true,
              span:24,
              rules: [{
                required: true,
                message: "请输入居住地址",
                trigger: "blur"
              }],
              overHidden: true
            },
            {
              label: "详细地址",
              prop: "detailAddress",
              type:"textarea",
              row:true,
              span:24,
              rules: [{
                required: true,
                message: "请输入详细地址",
                trigger: "blur"
              }],
              overHidden: true
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

          if (data.records.length === 0 && this.page.currentPage != 1) {
            this.page.currentPage = this.page.currentPage - 1;
            this.onLoad(this.page, params);
          }
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
