<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
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
                   v-if="permission.group_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button size="small" icon="el-icon-check" @click="handleManager(scope.row)" type="text">管理员设置</el-button>
      </template>
    </avue-crud>
    <el-dialog title="管理员配置"
              :visible.sync="box"
              >
      <el-form :model="managerForm">
        <el-form-item label="管理员" :label-width="formLabelWidth">
          <el-select filterable style="width:600px" v-model="managerForm.managers" multiple placeholder="请选择">
            <el-option
              v-for="item in managerList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据管理员" :label-width="formLabelWidth">
          <el-select filterable style="width:600px" v-model="managerForm.dataManagers" multiple placeholder="请选择">
            <el-option
              v-for="item in managerList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="box = false">取 消</el-button>
        <el-button type="primary"
                  @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove, getTree, getUserDict,updateManager} from "@/api/soybean/group";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        groupId: null,
        form: {},
        managerForm: {
          managers: [],
          dataManagers: [],
        },
        formLabelWidth: '120px',
        managerList: [],
        box: false,
        props: {
          label: "name",
          value: "id"
        },
        defaultObj: [],
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          menuWidth: 265,
          tip: false,
          tree: true,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "一级机构名称",
              prop: "topId",
              hide: true,
              display: false,
              type: 'select',
              search: true,
              dicUrl: "/api/bid-soybean/group/selectChildGroup?groupId=0",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请输入一级机构名称",
                trigger: "blur"
              }]
            },
            {
              label: "机构名称",
              prop: "name",
              search: true,
              width: 300,
              rules: [{
                required: true,
                message: "请输入机构名称",
                trigger: "blur"
              }]
            },
            {
              label: "机构全称",
              prop: "fullName",
              rules: [{
                required: true,
                message: "请输入机构全称",
                trigger: "blur"
              }]
            },
            {
              label: "机构类型",
              prop: "groupType",
              search: true,
              type: 'select',
              dicUrl: "/api/bid-system/dict/dictionary?code=group_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入机构类型",
                trigger: "blur"
              }]
            },
            {
              label: "父群组",
              prop: "parentId",
              type: 'tree',
              hide: true,
              dataType: "string",
              // dicUrl: "/api/bid-soybean/group/tree/children",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请输入父群组",
                trigger: "blur"
              }]
            },
            {
              label: "排序",
              prop: "sort",
              hide: true,
              type: "number",
              rules: [{
                required: true,
                message: "请输入群组简介",
                trigger: "blur"
              }]
            },
            {
              label: "机构简介",
              prop: "remarks",
              hide: true,
              rules: [{
                required: true,
                message: "请输入机构简介",
                trigger: "blur"
              }]
            },
            // {
            //   label: "LOGO",
            //   prop: "logo",
            //   rules: [{
            //     required: false,
            //     message: "请输入群LOGO",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "机构创建人",
              prop: "createUser",
              type: 'tree',
              dicUrl: "/api/bid-soybean/user/select?name={{key}}",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请输入机构创建人",
                trigger: "blur"
              }]
            },
            {
              label: "机构管理员",
              prop: "managers",
              hide: true,
              type: 'tree',
              multiple: true,
              dataType: "string",
              filterable: true,
              dicUrl: "/api/bid-soybean/user/select?name={{key}}",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: false,
                message: "请输入机构管理员",
                trigger: "blur"
              }]
            },
            {
              label: "统计管理员",
              prop: "dataManagers",
              hide: true,
              type: 'tree',
              multiple: true,
              dataType: "string",
              filterable: true,
              dicUrl: "/api/bid-soybean/user/select?name={{key}}",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: false,
                message: "请输入群数据管理员",
                trigger: "blur"
              }]
            },
            {
              label: "联系人",
              prop: "contact",
              hide: true,
              rules: [{
                required: false,
                message: "请输入联系人",
                trigger: "blur"
              }]
            },
            {
              label: "联系电话",
              prop: "phone",
              hide: true,
              rules: [{
                required: false,
                message: "请输入联系电话",
                trigger: "blur"
              }]
            },
            {
              label: "公司地址",
              prop: "addressName",
              rules: [{
                required: false,
                message: "请输入公司地址名称",
                trigger: "blur"
              }]
            },
            {
              label: "群LOGO",
              prop: "logo",
              type: 'upload',
              hide:true,
              listType: 'picture-img',
              propsHttp: {
                name : 'name',
                url : 'hash'
              },
              action: '/api/bid-blockchain/ipfs/uploadFile',
              span: 12,
              row: false,
            },
            {
              label: "创建日期",
              prop: "createTime",
              width: 100,
              hide: true,
              type: 'datetime',
              disabled: true,
              addDisplay: false,
              editDisplay: false,              
              format: "yyyy-MM-dd",
              valueFormat: "datetime",
              rules: [{
                required: false,
                message: "请输入创建日期",
                trigger: "blur"
              }]
            },
            {
              label: "更新日期",
              prop: "updateTime",
              hide: true,
              width: 100,
              type: 'datetime',
              disabled: true,
              addDisplay: false,
              editDisplay: false,
              format: "yyyy-MM-dd",
              valueFormat: "datetime",
              rules: [{
                required: false,
                message: "请输入更新日期",
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
          addBtn: this.vaildData(this.permission.group_add, false),
          viewBtn: this.vaildData(this.permission.group_view, false),
          delBtn: this.vaildData(this.permission.group_delete, false),
          editBtn: this.vaildData(this.permission.group_edit, false)
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
      submit() {
        updateManager(this.managerForm).then(() => {
          this.box = false;
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.onLoad(this.page);
        });
      },
      rowSave(row, loading, done) {
        let newRow = {};
        newRow.id = row.id;
        newRow.name = row.name;
        newRow.fullName = row.fullName;
        newRow.groupType = row.groupType;
        newRow.logo = row.logo;
        newRow.sort = row.sort;
        newRow.remarks = row.remarks;
        newRow.createUser = row.createUser;
        newRow.parentId = row.parentId;
        newRow.managers = row.managers;
        newRow.dataManagers = row.dataManagers;
        newRow.contact = row.contact;
        newRow.phone = row.phone;
        newRow.addressName = row.addressName;
        add(newRow).then(() => {
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
        let newRow = {};
        newRow.id = row.id;
        newRow.name = row.name;
        newRow.fullName = row.fullName;
        newRow.groupType = row.groupType;
        newRow.logo = row.logo;
        newRow.sort = row.sort;
        newRow.remarks = row.remarks;
        newRow.createUser = row.createUser;
        newRow.parentId = row.parentId;
        newRow.managers = row.managers;
        newRow.dataManagers = row.dataManagers;
        newRow.contact = row.contact;
        newRow.phone = row.phone;
        newRow.addressName = row.addressName;
        update(newRow).then(() => {
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
      handleManager(row) {
        this.groupId = row.id;
        this.managerForm.managers = [];
        this.managerForm.dataManagers = [];
        getUserDict()
          .then(res => {
            this.managerList = res.data.data;
            return getDetail(row.id);
          })
          .then(res => {
            this.managerForm.id = res.data.data.id;
            const managers = res.data.data.managers;
            if(managers != "" && managers != null){
              this.managerForm.managers = managers.split(",").map(Number);
            }
            const dataManagers = res.data.data.dataManagers
            if(dataManagers != "" && dataManagers != null){
              this.managerForm.dataManagers = dataManagers.split(",").map(Number);
            }
            this.box = true;
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
          this.data = res.data.data;
          getTree().then(res => {
            const data = res.data.data;
            const index = this.$refs.crud.findColumnIndex("parentId");
            this.option.column[index].dicData = data;
          })
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
