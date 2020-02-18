<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               v-model="form"
               ref="crud"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @span-method="span"
               @on-load="onLoad">
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
  import {getList,getStats, getDetail, add, update, remove} from "@/api/cms/category";
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
        option: {
          tip: false,
          border: true,
          index: true,
          menu:false,
          addBtn:false,
          defaultExpandAll:true,
          column: [
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
              label: "上级栏目",
              prop: "parentName",
              rules: [{
                required: false,
                message: "请选择上级菜单",
                trigger: "click"
              }]
            },
            {
              label: "所属栏目",
              prop: "id",
              type: "tree",
              search: true,
              dicUrl: "/api/bid-cms/category/tree",
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
              label: "信息量",
              prop: "cnt",
              hide:false,
              rules: [{
                required: false,
                message: "请输入链接",
                trigger: "blur"
              }]
            },
            {
              label: "点击量",
              prop: "hits",
              hide:false,
              rules: [{
                required: false,
                message: "请输入链接",
                trigger: "blur"
              }]
            },
            {
              label: "点赞量",
              prop: "tops",
              hide:false,
              rules: [{
                required: false,
                message: "请输入链接",
                trigger: "blur"
              }]
            },
            {
              label: "踩的量",
              prop: "stepons",
              hide:false,
              rules: [{
                required: false,
                message: "请输入链接",
                trigger: "blur"
              }]
            },
            {
              label: "最后更新日期",
              prop: "updateTime",
              display:false,
              width:'200px',
              rules: [{
                required: true,
                message: "请输入踩的数量",
                trigger: "blur"
              }]
            },
            {
              label: "归属机构",
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
              label: "开始时间",
              prop: "beginDate",
              hide: true,
              search:true,
              type: "date",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
            },
            {
              label: "结束时间",
              prop: "endDate",
              hide: true,
              search:true,
              type: "date",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
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
      span(row,column,rowIndex,columnIndex){

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
        getStats(Object.assign(params, this.query)).then(res => {
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
