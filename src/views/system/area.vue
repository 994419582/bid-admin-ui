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
                   v-if="permission.area_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/system/area";
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
              label: "父id",
              prop: "pid",
              rules: [{
                required: true,
                message: "请输入父id",
                trigger: "blur"
              }]
            },
            {
              label: "简称",
              prop: "shortName",
              rules: [{
                required: true,
                message: "请输入简称",
                trigger: "blur"
              }]
            },
            {
              label: "名称",
              prop: "name",
              rules: [{
                required: true,
                message: "请输入名称",
                trigger: "blur"
              }]
            },
            {
              label: "全称",
              prop: "mergerName",
              rules: [{
                required: true,
                message: "请输入全称",
                trigger: "blur"
              }]
            },
            {
              label: "层级 0 1 2 省市区县",
              prop: "level",
              rules: [{
                required: true,
                message: "请输入层级 0 1 2 省市区县",
                trigger: "blur"
              }]
            },
            {
              label: "拼音",
              prop: "pinyin",
              rules: [{
                required: true,
                message: "请输入拼音",
                trigger: "blur"
              }]
            },
            {
              label: "长途区号",
              prop: "phoneCode",
              rules: [{
                required: true,
                message: "请输入长途区号",
                trigger: "blur"
              }]
            },
            {
              label: "邮编",
              prop: "zipCode",
              rules: [{
                required: true,
                message: "请输入邮编",
                trigger: "blur"
              }]
            },
            {
              label: "首字母",
              prop: "first",
              rules: [{
                required: true,
                message: "请输入首字母",
                trigger: "blur"
              }]
            },
            {
              label: "经度",
              prop: "lng",
              rules: [{
                required: true,
                message: "请输入经度",
                trigger: "blur"
              }]
            },
            {
              label: "纬度",
              prop: "lat",
              rules: [{
                required: true,
                message: "请输入纬度",
                trigger: "blur"
              }]
            },
            {
              label: "地区编号",
              prop: "areaCode",
              rules: [{
                required: true,
                message: "请输入地区编号",
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
          addBtn: this.vaildData(this.permission.area_add, false),
          viewBtn: this.vaildData(this.permission.area_view, false),
          delBtn: this.vaildData(this.permission.area_delete, false),
          editBtn: this.vaildData(this.permission.area_edit, false)
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
