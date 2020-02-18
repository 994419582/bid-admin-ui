<template>
  <basic-container>
    <avue-crud :option="option"
               :data="data"
               ref="crud"
               v-model="form"
               :page="page"
               :permission="permissionList"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
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
                   v-if="permission.job_delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
        <el-button
                   size="small"
                   v-if="permission.job_changeStatus"
                   plain
                   @click="handleChangeStatus">启动停止
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button  size="small" icon="el-icon-caret-right" @click="handleRun(scope.row)" type="text">执行</el-button>
        <el-button  size="small" icon="el-icon-caret-right" @click="handleChangeStatus(scope.row)" type="text" >执行</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {
    getList,
    remove,
    update,
    add,
    changeStatus,
    run
  } from "@/api/monitor/task/job";
import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        selectionList: [],
        query: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        option: {
          tip: false,
          border: true,
          index: true,
          selection: true,
          viewBtn: true,
          column: [
            {
              label: "任务编号",
              prop: "id",
              hide:true,
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              rules: [{
                required: true,
                message: "请输入任务编号",
                trigger: "blur"
              }]
            },
            {
              label: "任务名称",
              prop: "jobName",
              search: true,
              rules: [{
                required: true,
                message: "请输入任务名称",
                trigger: "blur"
              }]
            },
            {
              label: "任务组名",
              prop: "jobGroup",
              rules: [{
                message: "请输入任务组名",
                trigger: "blur"
              }]
            },
            {
              label: "方法名称",
              prop: "methodName",
              search: true,
              rules: [{
                required: true,
                message: "请输入方法名称",
                trigger: "blur"
              }]
            },
            {
              label: "方法参数",
              prop: "methodParams",
              rules: [{
                message: "请输入方法参数",
                trigger: "blur"
              }]
            },
            {
              label: "执行表达式",
              prop: "cronExpression",
              rules: [{
                required: true,
                message: "请输入执行表达式",
                trigger: "blur"
              }]
            },
            {
              label: "任务状态",
              prop: "status",
              search: true,
              type: "radio",
              dicData: [
                {
                  label: "正常",
                  value: 0
                },
                {
                  label: "暂停",
                  value: 1
                }
              ],
              rules: [{
                required: true,
                message: "请选择任务状态",
                trigger: "blur"
              }]
            },
            {
              label: "执行策略",
              prop: "misfirePolicy",
              hide:true,
              type: "radio",
              dicData: [
                {
                  label: "默认",
                  value: "0"
                },
                {
                  label: "继续执行",
                  value: "1"
                },
                {
                  label: "等待执行",
                  value: "2"
                },
                {
                  label: "放弃执行",
                  value: "3"
                }
              ],
              rules: [{
                required: true,
                message: "请选择执行策略",
                trigger: "blur"
              }]
            },
            {
              label: "创建时间",
              prop: "createTime",
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              rules: [{
                required: true,
                message: "请输入参数键值",
                trigger: "blur"
              }]
            },
            {
              label: "备注",
              prop: "remark",
              hide:true,
              rules: [{
                message: "请输入备注信息",
                trigger: "blur"
              }]
            }
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.job_add, false),
          viewBtn: this.vaildData(this.permission.job_view, false),
          delBtn: this.vaildData(this.permission.job_delete, false),
          editBtn: this.vaildData(this.permission.job_edit, false)
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
      handleChangeStatus() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        } else if (this.selectionList.length > 1) {
          this.$message.warning("请选择至多一条数据");
          return;
        }
        this.$confirm("确定启动或停止选择数据?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return changeStatus(this.ids);
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
      handleRun(row) {
        this.$confirm("确定执行选择的数据?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return run(row.id);
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
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      onLoad(page, params = {}) {
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
        });
      }
    }
  };

</script>

<style>
</style>
