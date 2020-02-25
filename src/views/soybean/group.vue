<template>
  <el-container>
    <el-aside width="300px">
      <avue-tree :option="treeOption" :data="treeData" @node-click="nodeClick"></avue-tree>
    </el-aside>
    <el-main>
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
      </avue-crud>
    </el-main>
  </el-container>
</template>

<script>
  import {getList, getDetail, add, update, remove, treeData, getChildren} from "@/api/soybean/group";
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
          viewBtn: true,
          selection: true,
          height: 550,
          column: [
            {
              label: "群组名称",
              prop: "name",
              width: 200,
              rules: [{
                required: true,
                message: "请输入群组名",
                trigger: "blur"
              }]
            },
            {
              label: "群组全称",
              prop: "fullName",
              width: 300,
              hide: true,
              rules: [{
                required: true,
                message: "请输入群组名全称",
                trigger: "blur"
              }]
            },
            {
              label: "群组类型",
              prop: "groupType",
              type: 'select',
              dicUrl: "/api/bid-system/dict/dictionary?code=group_type",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入群组类型",
                trigger: "blur"
              }]
            },
            {
              label: "群组人数",
              prop: "userAccount",
              rules: [{
                required: true,
                message: "请输入群人数",
                trigger: "blur"
              }]
            },
            {
              label: "群管理员",
              prop: "managers",
              type: 'select',
              multiple: true,
              dataType: "string",
              dicUrl: "/api/bid-soybean/user/select",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: false,
                message: "请输入群管理员",
                trigger: "blur"
              }]
            },
            {
              label: "父群组",
              prop: "parentGroups",
              type: 'tree',
              multiple: true,
              hide: true,
              dataType: "string",
              dicUrl: "/api/bid-soybean/group/tree/children",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: false,
                message: "请输入父群组",
                trigger: "blur"
              }]
            },
            {
              label: "群组Logo",
              prop: "logo",
              rules: [{
                required: false,
                message: "请输入群logo",
                trigger: "blur"
              }]
            },
            {
              label: "群创建人",
              prop: "createUser",
              type: 'select',
              dicUrl: "/api/bid-soybean/user/select",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: false,
                message: "请输入群创建人",
                trigger: "blur"
              }]
            },
            {
              label: "群更新人",
              prop: "updateUser",
              type: 'select',
              addDisplay: false,
              editDisplay: false,
              dicUrl: "/api/bid-soybean/user/select",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: false,
                message: "请输入群创建人",
                trigger: "blur"
              }]
            },
            {
              label: "创建日期",
              prop: "createTime",
              width: 100,
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
            // {
            //   label: "群状态",
            //   prop: "status",
            //   type: 'radio',
            //   dicUrl: "/api/bid-system/dict/dictionary?code=status",
            //   props: {
            //     label: "dictValue",
            //     value: "dictKey"
            //   },
            //   rules: [{
            //     required: true,
            //     message: "请输入状态",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "需要审批",
            //   prop: "approval",
            //   type: 'radio',
            //   dicUrl: "/api/bid-system/dict/dictionary?code=approval",
            //   props: {
            //     label: "dictValue",
            //     value: "dictKey"
            //   },
            //   rules: [{
            //     required: true,
            //     message: "请输入是否需要审批",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "公司地址ID",
            //   prop: "addressId",
            //   rules: [{
            //     required: false,
            //     message: "请输入公司地址ID（只有公司和社区需要）",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "公司地址",
            //   prop: "addressName",
            //   rules: [{
            //     required: false,
            //     message: "请输入公司地址名称",
            //     trigger: "blur"
            //   }]
            // },
            // {
            //   label: "详细地址",s
            //   prop: "detailAddress",
            //   rules: [{
            //     required: false,
            //     message: "请输入详细地址",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "备注",
              prop: "remarks",
              span: 24,
              minRows: 3,
              type: "textarea",
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
        getChildren(1).then(res =>{
          const data = res.data.data;
          console.log(data);
          this.data = data;
          this.selectionClear();
        });
        treeData().then(res =>{
          const data = res.data.data;
          data.expanded = false;
          this.treeData = data;
          this.loading = false;
        });
      },
      nodeClick(data){
        this.loading = true;
        getChildren(data.id).then(res =>{
          const data = res.data.data;
          console.log(data);
          this.data = data;
          this.selectionClear();
          this.loading = false;
        });
      }
    }
  };
</script>

<style>
</style>
