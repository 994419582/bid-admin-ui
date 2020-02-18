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
                   v-if="permission.category_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
        <template slot-scope="{row}"
                  slot="siteId">
          <el-tag>{{row.siteName}}</el-tag>
      </template>
      <template slot-scope="{row}"
                slot="parentId">
        <el-tag>{{row.parentName}}</el-tag>
      </template>
      <!--<template slot-scope="{row}"-->
                <!--slot="officeId">-->
        <!--<el-tag>{{row.officeName}}</el-tag>-->
      <!--</template>-->
      <template slot-scope="{row}"
                slot="module">
        <el-tag>{{row.moduleName}}</el-tag>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList,getCateGoryTree, getDetail, add, update, remove} from "@/api/cms/category";
  import {mapGetters} from "vuex";
  const DCData = [
    {
      label: "否",
      value: 0
    },
    {
      label: "是",
      value: 1
    }
  ];

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
          dialogWidth: "60%",
          tree: true,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          defaultExpandAll:true,
          column: [
            {
              label: "栏目名称",
              prop: "name",
              search: true,
              rules: [{
                required: true,
                message: "请输入栏目名称",
                trigger: "blur"
              }]
            },
            {
              label: "上级栏目",
              prop: "parentId",
              type: "tree",
              dicUrl: "/api/bid-cms/category/tree",
              hide: true,
              props: {
                label: "title"
              },
              rules: [{
                required: false,
                message: "请选择上级菜单",
                trigger: "click"
              }]
            },
            {
              label: "所属站点",
              type: "select",
              row: false,
              dicUrl: "/api/bid-cms/site/findList",
              props: {
                label: "name",
                value: "id"
              },
              slot: true,
              prop: "siteId",
              search: true,
              span:12,
              rules: [{
                required: true,
                message: "请输入通知类型",
                trigger: "blur"
              }]
            },
            {
              label: "所属部门",
              prop: "officeId",
              type: "tree",
              dicUrl: "/api/bid-system/dept/tree",
              search:true,
              span:12,
              props: {
                label: "title",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请选择所属部门",
                trigger: "click"
              }]
            },
            {
              label: "栏目模型",
              type: "select",
              row: false,
              dicUrl: "/api/bid-system/dict/dictionary?code=cms_model",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              slot: true,
              prop: "module",
              search: true,
              rules: [{
                required: true,
                message: "请选择栏目模型",
                trigger: "blur"
              }]
            },
            {
              label: "链接",
              prop: "href",
              hide:true,
              tip:"栏目超链接地址",
              rules: [{
                required: false,
                message: "请输入链接",
                trigger: "blur"
              }]
            },
            {
              label: "目标",
              prop: "target",
              hide:true,
              tip:"栏目超链接打开的目标窗口，新窗口打开请填写：_blank",
              rules: [{
                required: false,
                message: "请输入目标",
                trigger: "blur"
              }]
            },
            {
              label: "排序",
              prop: "sort",
              type: "number",
              rules: [{
                required: true,
                message: "请输入排序（升序）",
                trigger: "blur"
              }]
            },
            {
              label: "关键字",
              prop: "keywords",
              tip:"填写描述或者关键字有助于搜索引擎优化",
              hide:true,
              span: 24,
              rules: [{
                required: false,
                message: "请输入关键字",
                trigger: "blur"
              }]
            },

            {
              label: "导航栏显示",
              prop: "inMenu",
              tip:"是否在导航栏显示",
              type: "radio",
              labelWidth :'24%',
              button: true,
              border : true,
              dicData:DCData,
              rules: [{
                required: true,
                message: "请输入是否在导航中显示",
                trigger: "blur"
              }]
            },
            {
              label: "分类页显示",
              prop: "inList",
              tip :"是否在分类页面显示",
              hide:true,
              type: "radio",
              labelWidth :'24%',
              button:true,
              border : true,
              dicData:DCData,
              rules: [{
                required: true,
                message: "请输入是否在分类页中显示列表",
                trigger: "blur"
              }]
            },
            {
              label: "是否允许评论",
              prop: "allowComment",
              hide:true,
              type: "radio",
              labelWidth :'24%',
              button:true,
              border : true,
              dicData:DCData,
              rules: [{
                required: true,
                message: "请输入是否允许评论",
                trigger: "blur"
              }]
            },
            {
              label: "是否需要审核",
              prop: "isAudit",
              hide:true,
              labelWidth :'24%',
              type: "radio",
              button:true,
              border : true,
              dicData:DCData,
              rules: [{
                required: true,
                message: "请输入是否需要审核",
                trigger: "blur"
              }]
            },
            {
              label: "缩略图",
              prop: "image",
              type: 'upload',
              hide:true,
              listType: 'picture-img',
              propsHttp: {
                name : 'name',
                url : 'hash'
              },
              canvasOption: {
                text: 'avue',
                ratio: 0.1
              },
              action: '/api/bid-blockchain/ipfs/uploadFile',
              span: 12,
              row: false,
            },
            {
              label: "栏目描述",
              prop: "description",
              hide:true,
              type:"textarea",
              rules: [{
                required: false,
                message: "请输入描述",
                trigger: "blur"
              }]
            },
          ]
        },
        data :[]
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.category_add, false),
          viewBtn: this.vaildData(this.permission.category_view, false),
          delBtn: this.vaildData(this.permission.category_delete, false),
          editBtn: this.vaildData(this.permission.category_edit, false)
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
          // const data = res.data.data;
          // this.page.total = data.total;
          this.data = res.data.data;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>
