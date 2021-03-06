<template>
  <el-container>
    <el-aside width="300px">
      <avue-tree :option="treeOption" :data="treeData" @node-click="nodeClick"></avue-tree>
    </el-aside>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
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
                   v-if="permission.usergroup_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </el-container>
</template>

<script>
  import {getList, getDetail, add, update, remove, treeData,getTree} from "@/api/soybean/usergroup";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        treeData:[],
        treeOption:{
          nodeKey:'id',
          expandAll: false,
          height: 550,
          addBtn:false,
          menu:false,
          size:'small',
          formOption:{
            labelWidth:100,
            column:[{
                label:'自定义项',
                prop:'test'
            }],
          },
          props:{
            labelText:'组织架构',
            label:'name',
            value:'id',
            children:'children'
          }
        },
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
              label: "用户名称",
              prop: "userId",
              type: 'tree',
              dicUrl: "/api/bid-soybean/user/select?name={{key}}",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请输入用户名称",
                trigger: "blur"
              }]
            },
            {
              label: "群组名称",
              prop: "groupId",
              type: 'tree',
              // dicUrl: "/api/bid-soybean/group/select",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请输入群组名称",
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
          addBtn: this.vaildData(this.permission.usergroup_add, false),
          viewBtn: this.vaildData(this.permission.usergroup_view, false),
          delBtn: this.vaildData(this.permission.usergroup_delete, false),
          editBtn: false
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
        let newRow = {};
        newRow.groupId = row.groupId;
        newRow.userId = row.userId;
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
        treeData().then(res =>{
          const data = res.data.data;
          data.expanded = false;
          this.treeData = data;
          this.loading = false;
        });
        getTree().then(res => {
          const data = res.data.data;
          const index = this.$refs.crud.findColumnIndex("groupId");
          this.option.column[index].dicData = data;
        })
      },
      nodeClick(data){
        let params = {};
        params.groupId = data.id;
        let page = this.page;
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
