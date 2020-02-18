<template>
  <basic-container>
    <el-aside style="float: left" width="16%">
      <avue-tree :option="treeOption" :data="treeData"  @node-click="nodeClick" >
z
      </avue-tree>
    </el-aside>
    <el-main  style="width: 82%;float: right;display: block;border: #9B9B9B" >
      <avue-crud id="article" :option="option"
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
                 @on-load="AllLoad">
        <template slot="menuLeft">
          <el-button type="danger"
                     size="small"
                     icon="el-icon-delete"
                     plain
                     v-if="permission.article_delete"
                     @click="handleDelete">删 除
          </el-button>
        </template>
        <template slot="menu" slot-scope="scope">
          <el-button size="small" icon="el-icon-search" @click="lookComment(scope.row)" type="text">评论</el-button>
        </template>
    </avue-crud>
    </el-main>

  </basic-container>
</template>

<script>
  import {getList,getCateGoryTree, getDetail, add, update, remove} from "@/api/cms/article";
  import {mapGetters} from "vuex";
  const DCData = [
    {
      label: "否",
      value: "0"
    },
    {
      label: "是",
      value: "1"
    }
  ];
  const DCStatus = [
    {
      label: "审核",
      value: 0
    },
    {
      label: "发布",
      value: 1
    }
  ];
  export default {
    data: function () {
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
        treeOption: {
          nodeKey: 'id',
          addBtn: false,
          menu: false,
          size: 'small',
          props: {
            labelText: "标题",
            label: "title",
            value: "value",
            key:'key',
            children: "children"
          },

        },
        data: [{
          allowComment:1,
          status:1,
        }],
        option:{},
        treeData: [],
        optionHref:{
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "栏目名称",
              prop: "categoryId",
              search: true,
              type: "tree",
              dicUrl: "/api/bid-cms/category/tree?module=0",
              // dicData:this.treeData,
              hide: false,
              props: {
                label: "title"
              },
              rules: [{
                required: true,
                message: "请选择上级菜单",
                trigger: "click"
              }]
            },
            {
              label: "名称",
              prop: "title",
              search: true,
              width:"300px",
              rules: [{
                required: true,
                message: "请输入标题",
                trigger: "blur"
              }]
            },

            {
              label: "标题颜色",
              prop: "color",
              type :"color",
              hide: true,
              rules: [{
                required: false,
                message: "请输入标题颜色",
                trigger: "blur"
              }]
            },
            {
              label: "链接地址",
              prop: "link",
              hide: false,
              rules: [{
                required: true,
                message: "请输入文章链接",
                trigger: "blur"
              }]
            },
            {
              label: "链接图片",
              prop: "image",
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
              label: "发布状态",
              prop: "status",
              type: "radio",
              button: true,
              hide:false,
              border : true,
              dicData:DCStatus,
              rules: [{
                required: false,
                message: "请输入权重，越大越靠前",
                trigger: "blur"
              }]
            },
            {
              label: "更新时间",
              prop: "updateTime",
              display:false,
              width:'200px',
              rules: [{
                required: true,
                message: "请输入踩的数量",
                trigger: "blur"
              }]
            },
          ]
        },
        optionArticle: {
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "栏目名称",
              prop: "categoryId",
              search: true,
              type: "tree",
              dicUrl: "/api/bid-cms/category/tree?module=0",
              // dicData:this.treeData,
              hide: true,
              props: {
                label: "title"
              },
              rules: [{
                required: true,
                message: "请选择上级菜单",
                trigger: "click"
              }]
            },
            {
              label: "标题",
              prop: "title",
              search: true,
              width:"300px",
              rules: [{
                required: true,
                message: "请输入标题",
                trigger: "blur"
              }]
            },
            {
              label: "文章链接",
              prop: "link",
              hide: true,
              display:false,
              rules: [{
                required: true,
                message: "请输入文章链接",
                trigger: "blur"
              }]
            },

            {
              label: "关键字",
              prop: "keywords",
              type :"textarea",
              hide: true,
              rules: [{
                required: false,
                message: "请输入关键字",
                trigger: "blur"
              }]
            },

            {
              label: "摘要",
              prop: "description",
              type :"textarea",
              hide: true,
              rules: [{
                required: false,
                message: "请输入描述、摘要",
                trigger: "blur"
              }]
            },
            {
              label: "文章图片1",
              prop: "color",
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
              label: "文章图片2",
              prop: "image",
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
              label: "正文内容",
              prop: "content",
              hide :true,
              type:"text",
              component:"ueditor",
              options: {
                action: "/api/bid-blockchain/ipfs/uploadFile",
                props: {
                  // res: 'name',
                  url: 'hash'
                },
                // action: 'http://www.baidu.com/api/bid-blockchain/ipfs/uploadFile',
              },
              row:true,
              span:24,
              rules: [{
                required: true,
                message: "请输入正文内容",
                trigger: "blur"
              }]
            },
            {
              label: "附件链接",
              prop: "relation",
              hide :true,
              type: 'input',
              display:false,
            },
            {
              label: "文章来源",
              prop: "copyfrom",
              hide :true,
              rules: [{
                required: false,
                message: "请输入文章来源",
                trigger: "blur"
              }]
            },
            {
              label: "权重",
              prop: "weight",
              type :"number",
              rules: [{
                required: false,
                message: "请输入权重，越大越靠前",
                trigger: "blur"
              }]
            },
            {
              label: "权重期限",
              prop: "weightDate",
              hide: true,
              type: "date",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
            },
            {
              label: "发布时间",
              prop: "createTime",
              hide: true,
              type: "date",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
            },
            {
              label: "发布状态",
              prop: "status",
              type: "radio",
              button: true,
              hide:true,
              border : true,
              dicData:DCStatus,
              rules: [{
                required: false,
                message: "请输入权重，越大越靠前",
                trigger: "blur"
              }]
            },
            {
              label: "文章推荐",
              prop: "posid",
              border:true,
              dicData:DCData,
              type :"radio",
              rules: [{
                required: false,
                message: "请输入推荐位，多选",
                trigger: "blur"
              }]
            },

            {
              label: "允许评论",
              prop: "allowComment",
              hide :true,
              type: "radio",
              button: true,
              border : true,
              dicData:DCData,
              rules: [{
                required: false,
                message: "请输入允许评论",
                trigger: "blur"
              }]
            },


            {
              label: "点击数",
              prop: "hits",
              editView: false,
              display:false,
              rules: [{
                required: true,
                message: "请输入点击数",
                trigger: "blur"
              }]
            },
            {
              label: "点赞数",
              prop: "tops",
              display:false,
              rules: [{
                required: true,
                message: "请输入点赞数",
                trigger: "blur"
              }]
            },
            {
              label: "踩数量",
              prop: "stepons",
              display:false,
              rules: [{
                required: true,
                message: "请输入踩的数量",
                trigger: "blur"
              }]
            },
            {
              label: "更新时间",
              prop: "updateTime",
              display:false,
              width:'200px',
              rules: [{
                required: true,
                message: "请输入踩的数量",
                trigger: "blur"
              }]
            },
          ]
        },
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.article_add, false),
          viewBtn: this.vaildData(this.permission.article_view, false),
          delBtn: this.vaildData(this.permission.article_delete, false),
          editBtn: this.vaildData(this.permission.article_edit, false)
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
      // uploadBefore(file,done,loading){
      //   if (file.size>5242880){
      //     this.$message.error("该文件大约5M，不能上传")
      //     loading()
      //   }
      // },
      lookComment(row){
        this.$router.push({
          path:"/cms/comment",
          query:{
            contentId:row.id,
            title:row.title
          }
        })
      },
      nodeClick(data){
          if (data.key ==2){
            this.option=this.optionHref
          }else {
            this.option=this.optionArticle
          }
          // this.data.categoryId=data.id
          this.query={"categoryId":data.id}
          this.onLoad(this.page)
      },
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
            let data=res.data.data
            data.content=(data.content)
            data.posid=data.posid.split(",")
            this.form = data;
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
      },
      AllLoad(page, params = {}){
        this.option=this.optionArticle
        this.loading = true;
        getCateGoryTree().then(res =>{
          this.treeData=res.data.data;
        });
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    },
    created: function(){
      this.AllLoad()
    }
  };
</script>

<style>
</style>
