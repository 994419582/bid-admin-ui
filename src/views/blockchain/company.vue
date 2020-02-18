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
        <el-button icon="el-icon-bank-card" type="text" @click="rowRegister(scope.row)" v-if="scope.row.status!=1" size="small">同意</el-button>
      </template>
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.company_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import { contract, signedTransaction } from '@/util/bif';
  import abi from "@/abi/abi";
  import abis from "@/abi";

  import {getList, getDetail, add, update, remove} from "@/api/blockchain/company";
  import {mapGetters} from "vuex";
  import {validateEmail,isvalidatemobile} from '@/util/validate';

  export default {
    data() {
      const validatePhone = (rule, value, callback) => {
        if (isvalidatemobile(value)[0]) {
          callback(new Error(isvalidatemobile(value)[1]));
        } else {
          callback();
        }
      };
      const validateEmails = (rule, value, callback) => {
        debugger
        if (!validateEmail(value)) {
          callback(new Error("邮箱格式不对"));
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
          addBtn: false,
          editBtn: false,
          delBtn: false,
          viewBtn: true,
          selection: true,
          column: [
            {
              label: "企业名称",
              prop: "companyName",
              search:true,
              rules: [{
                required: true,
                message: "请输入企业名称",
                trigger: "blur"
              }]
            },
            {
              label: "营业年限",
              prop: "businessYear",
              type: "select",
              dicUrl: "/api/bid-system/dict/dictionary?code=businessYear",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              slot: true,
              rules: [{
                required: true,
                message: "请输入营业年限",
                trigger: "blur"
              }]
            },
            {
              label: "公司规模",
              prop: "companyPerson",
              type: "select",
              dicUrl: "/api/bid-system/dict/dictionary?code=companyPerson",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              slot: true,
              rules: [{
                required: true,
                message: "请输入公司规模",
                trigger: "blur"
              }]
            },
            {
              label: "主要行业",
              prop: "industriy",
              type: "select",
              row: true,
              dicUrl: "/api/bid-system/dict/dictionary?code=industriy",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              slot: true,
              rules: [{
                required: true,
                message: "请输入主要行业",
                trigger: "blur"
              }]
            },
            {
              label: "主营业务",
              prop: "work",
              rules: [{
                required: true,
                message: "请输入主营业务",
                trigger: "blur"
              }]
            },
            {
              label: "公司网址",
              prop: "companyUrl",
              hide:true,
              rules: [{
                required: true,
                message: "请输入公司网址",
                trigger: "blur"
              }]
            },
            {
              label: "国家/地区",
              prop: "country",
              type: 'select',
              props: {
                label: 'name',
                value: 'id'
              },
              cascaderItem: ['region' ],
              typeslot: true,
              cascaderChange: true,
              // dicUrl: `/api/bid-system/area/country`,
              dicUrl: `/api/bid-system/area/country`,
              rules: [
                {
                  required: true,
                  message: '请选择国家地区',
                  trigger: 'blur'
                }
              ]
            },
            {
              label: "地区",
              prop: "region",
              hide:true,
              type: 'select',
              props: {
                label: 'name',
                value: 'id'
              },
              defaultIndex: 0,
              dicFlag: false,
              dicUrl: `/api/bid-system/area/region?id={{key}}`,
              rules: [
                {
                  required: true,
                  message: '请选择国家地区',
                  trigger: 'blur'
                }
              ]
            },
            {
              label: "街道地址",
              prop: "address",
              hide:true,
              rules: [{
                required: false,
                message: "请输入街道地址",
                trigger: "blur"
              }]
            },
            {
              label: "联系电话",
              prop: "phone",
              hide:true,
              rules: [{
                required: false,
                // message: "请输入联系电话",
                trigger: "blur",
                validator:validatePhone,
              }]
            },
            {
              label: "营业执照",
              prop: "businessLicense",
              hide:true,
              type: 'upload',
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
              row:true,
              span:24,
              tip:"上传营业执照照片；照片上的所有信息清晰可见，内容真实有效，不得做任何修改；",
              rules: [{
                required: true,
                message: "请输入营业执照",
                trigger: "blur"
              }]
            },
            {
              label: "统一社会信用代码",
              prop: "number",
              hide:true,
              rules: [{
                required: true,
                message: "请输入统一社会信用代码",
                trigger: "blur"
              }]
            },
            {
              label: "营业期至",
              prop: "businessDate",
              hide:true,
              type: "date",
              format: "yyyy-MM-dd hh:mm:ss",
              valueFormat: "yyyy-MM-dd hh:mm:ss",
              rules: [{
                required: true,
                message: "请输入营业期至",
                trigger: "blur"
              }]
            },
            {
              label: "信任锚BID",
              prop: "bid",
              hide:true,
              rules: [{
                required: true,
                message: "请输入信任锚BID",
                trigger: "blur"
              }]
            },
            {
              label: "信任锚名称",
              prop: "trustName",
              search:true,
              rules: [{
                required: true,
                message: "请输入信任锚名称",
                trigger: "blur"
              }]
            },
            {
              label: "信任锚网址",
              prop: "website",
              hide:true,
              rules: [{
                required: true,
                message: "请输入信任锚网址",
                trigger: "blur"
              }]
            },
            {
              label: "服务文档链接",
              prop: "documentUrl",
              hide:true,
              rules: [{
                required: true,
                message: "请输入服务文档链接",
                trigger: "blur"
              }]
            },
            {
              label: "服务链接",
              prop: "serverUrl",
              hide:true,
              rules: [{
                required: true,
                message: "请输入服务链接",
                trigger: "blur"
              }]
            },
            {
              label: "服务邮箱",
              prop: "email",
              hide:true,
              rules: [{
                required: true,
                // message: "请输入服务邮箱",
                trigger: "blur",
                validator:validateEmails,
              }]
            },
            {
              label: "信任描述",
              prop: "description",
              type:"textarea",
              row:true,
              span:24,
              hide:true,
              rules: [{
                required: true,
                message: "请输入信任描述",
                trigger: "blur"
              }]
            },
            {
              label: "状态",
              prop: "status",
              type:"text",
              hide:true
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
          // addBtn: this.vaildData(this.permission.company_add, false),
          // viewBtn: this.vaildData(this.permission.company_view, false),
          // delBtn: this.vaildData(this.permission.company_delete, false),
          // editBtn: this.vaildData(this.permission.company_edit, false)
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
      // validateName (rule, value, callback){
      //   var myReg=/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
      //   if(myReg.test(value)){
      //     callback();
      //   }else{
      //     callback(new Error('邮箱格式不对'));
      //   }
      // },
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
      },
      rowRegister(row) {
        if (!this.init) {
          this.$message({
            type: "error",
            message: `请先解锁钱包`
          });
          return false;
        }
        let that = this;
        
        this.$confirm("确定同意信任锚上链?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let contractAddress = abis.Trustanchor.address;
            let func = abi.Trustanchor["registerTrustAnchor"];
            // anchor,anchortype,anchorname,company,companyurl,website,documenturl,email,desc
            let inputs = [row.bid, 10, row.trustName, row.companyName, row.companyUrl, row.website, row.documentUrl, row.email, row.description];

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

            row.status = 1;
            update(row).then(() => {
              that.onLoad(this.page);
              that.$message({
                type: "success",
                message: "操作成功!"
              });
            }, error => {
              done();
              console.log(error);
            });

          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      }
    }
  };
</script>

<style>
</style>
