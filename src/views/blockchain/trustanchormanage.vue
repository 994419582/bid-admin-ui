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
      <template slot-scope="scope" slot="menu">
        <el-button icon="el-icon-bank-card" type="text" @click="rowVote(scope.row)" size="small">投票</el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import { contract, signedTransaction } from '@/util/bif';
  import abi from "@/abi/abi";
  import abis from "@/abi";

  import {getList, getDetail, add, update, remove} from "@/api/blockchain/trustanchormanage";
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
          addBtn:false,
          editBtn:false,
          selection: true,
          column: [
            {
              label: "信任锚BID",
              prop: "owner",
              rules: [{
                required: true,
                message: "请输入信任锚地址",
                trigger: "blur"
              }]
            },
            {
              label: "信任锚类型",
              prop: "type",
              rules: [{
                required: true,
                message: "请输入信任锚类型",
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
              label: "所属公司",
              prop: "company",
              rules: [{
                required: true,
                message: "请输入所属公司",
                trigger: "blur"
              }]
            },
            {
              label: "公司网址",
              hide:true,
              prop: "companyUrl",
              rules: [{
                required: true,
                message: "请输入公司网址",
                trigger: "blur"
              }]
            },
            {
              label: "网站地址",
              hide:true,
              prop: "website",
              rules: [{
                required: true,
                message: "请输入信任锚地址",
                trigger: "blur"
              }]
            },
            {
              label: "文档链接",
              prop: "documentUrl",
              rules: [{
                required: true,
                message: "请输入文档链接",
                trigger: "blur"
              }]
            },
            {
              label: "服务链接",
              prop: "serverUrl",
              rules: [{
                required: true,
                message: "请输入服务链接",
                trigger: "blur"
              }]
            },
            {
              label: "服务邮箱",
              prop: "email",
              rules: [{
                required: true,
                message: "请输入服务邮箱",
                trigger: "blur"
              }]
            },
            {
              label: "描述",
              prop: "description",
              rules: [{
                required: true,
                message: "请输入描述",
                trigger: "blur"
              }]
            },
            {
              label: "服务状态",
              prop: "status",
              rules: [{
                required: true,
                message: "请输入服务状态",
                trigger: "blur"
              }]
            },
            {
              label: "获得票数",
              prop: "voteCount",
              rules: [{
                required: true,
                message: "请输入获得票数",
                trigger: "blur"
              }]
            },
            {
              label: "是否为信任锚",
              prop: "active",
              hide:true,
              rules: [{
                required: true,
                message: "请输入是否为信任锚",
                trigger: "blur"
              }]
            },
            {
              label: "获得的激励数",
              prop: "totalBounty",
              hide:true,
              rules: [{
                required: true,
                message: "请输入获得的激励数",
                trigger: "blur"
              }]
            },
            {
              label: "已提取的激励",
              hide:true,
              prop: "extractedBounty",
              rules: [{
                required: true,
                message: "请输入已提取的激励",
                trigger: "blur"
              }]
            },
            {
              label: "上次提取时间",
              hide:true,
              prop: "lastExtractTime",
              rules: [{
                required: true,
                message: "请输入上次提取时间",
                trigger: "blur"
              }]
            },
            {
              label: "创建时间",
              prop: "createTime",
              rules: [{
                required: true,
                message: "请输入创建时间",
                trigger: "blur"
              }]
            },
            {
              label: "修改时间",
              prop: "updateTime",
              rules: [{
                required: true,
                message: "请输入修改时间",
                trigger: "blur"
              }]
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission", "init", "keyObject", "privateKey", "balance", "bif", "chainId"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.trustanchormanage_add, false),
          viewBtn: this.vaildData(this.permission.trustanchormanage_view, false),
          delBtn: this.vaildData(this.permission.trustanchormanage_delete, false),
          editBtn: this.vaildData(this.permission.trustanchormanage_edit, false)
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
      rowVote(row) {
        if (!this.init) {
          this.$message({
            type: "error",
            message: `请先解锁钱包`
          });
          return false;
        }
        let that = this;
        
        this.$confirm("确定给该信任锚投票?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let contractAddress = abis.Trustanchor.address;
            let func = abi.Trustanchor["voteElect"];
            let inputs = [row.owner];
            
            signedTransaction(that.bif, that.chainId, contractAddress, func, inputs).then(rawTx => {
              that.bif.core.sendSignedTransaction(rawTx)
              .once("receipt", function(receipt) {
                console.log(receipt);
              })
              .once("error", (error) => {
                that.$message({
                  type: "error",
                  message: `BIF币不足或该操作不合法！`
                });
                console.log(error);
                
              });
            });

          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
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
    },
    mounted() {

    }
  };
</script>

<style>
</style>
