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
                   v-if="permission.clockln_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/soybean/clockln";
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
              label: "主键",
              prop: "id",
              hide: true,
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false,
              rules: [{
                required: true,
                message: "请输入主键",
                trigger: "blur"
              }]
            },
            {
              label: "用户",
              prop: "userId",
              type: 'select',
              remote: true,
              props: {
                label: "name",
                value: "id"
              },
              dicUrl: "/api/bid-soybean/user/select?name={{key}}",
              rules: [{
                required: true,
                message: "请选择用户",
                trigger: "blur"
              }]
            },
            {
              label: "打卡地址",
              prop: "address",
              type: "textarea",
              rules: [{
                required: true,
                message: "请输入打卡地址",
                trigger: "blur"
              }]
            },
            
            {
              label: "健康状态",
              prop: "healthy",
              type: 'select',
              dicUrl: "/api/bid-system/dict/dictionary?code=healthy",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请选择健康状态",
                trigger: "blur"
              }]
            },
            {
              label: "其他情况",
              prop: "otherhealthy",
              rules: [{
                required: false,
                message: "请输入健康状况其他情况",
                trigger: "blur"
              }]
            },
            {
              label: "体温",
              prop: "temperature",
              rules: [{
                required: true,
                message: "请输入体温",
                trigger: "blur"
              }]
            },
            // {
            //   label: "是否入院",
            //   prop: "hospital",
            //   type: 'select',
            //   dicUrl: "/api/bid-system/dict/dictionary?code=hospital",
            //   props: {
            //     label: "dictValue",
            //     value: "dictKey"
            //   },
            //   rules: [{
            //     required: true,
            //     message: "请选择是否有就诊入院",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "是否确诊",
              prop: "comfirmed",
              type: 'radio',
              dicUrl: "/api/bid-system/dict/dictionary?code=yes_no",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入是否确诊",
                trigger: "blur"
              }]
            },
            {
              label: "是否就诊入院",
              prop: "admitting",
              type: 'radio',
              dicUrl: "/api/bid-system/dict/dictionary?code=yes_no",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入是否就诊入院",
                trigger: "blur"
              }]
            },
            {
              label: "是否武汉",
              prop: "wuhan",
              type: 'radio',
              dicUrl: "/api/bid-system/dict/dictionary?code=wuhan",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入是否接触过武汉人或经过武汉",
                trigger: "blur"
              }]
            },
            {
              label: "是否离京",
              prop: "leave",
              type: 'radio',
              dicUrl: "/api/bid-system/dict/dictionary?code=yes_no",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入是否离京",
                trigger: "blur"
              }]
            },
            {
              label: "离京时间",
              prop: "leavetime",
              type: "date",
              format: "yyyy-MM-dd",
              rules: [{
                required: false,
                message: "请输入离京时间",
                trigger: "blur"
              }]
            },
            
            {
              label: "返京时间",
              prop: "gobacktime",
              type: "date",
              format: "yyyy-MM-dd",
              rules: [{
                required: false,
                message: "请输入返京时间或计划返京时间",
                trigger: "blur"
              }]
            },
            {
              label: "未返京原因",
              prop: "nobackreason",
              type: 'select',
              dicUrl: "/api/bid-system/dict/dictionary?code=nobackreason",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请选择未返京原因",
                trigger: "blur"
              }]
            },
            {
              label: "交通方式",
              prop: "transport",
              type: 'select',
              dicUrl: "/api/bid-system/dict/dictionary?code=transport",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入交通方式",
                trigger: "blur"
              }]
            },
            {
              label: "返京航班/车次",
              prop: "flight",
              rules: [{
                required: false,
                message: "请输入航班/车次",
                trigger: "blur"
              }]
            },
            {
              label: "在岗状态",
              prop: "jobstatus",
              type: 'select',
              dicUrl: "/api/bid-system/dict/dictionary?code=jobstatus",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入在岗状态",
                trigger: "blur"
              }]
            },
            
            // {
            //   label: "未返京原因",
            //   prop: "reason",
            //   rules: [{
            //     required: false,
            //     message: "请输入未返京原因",
            //     trigger: "blur"
            //   }]
            // },
            {
              label: "备注",
              prop: "remarks",
              type: "textarea",
              rules: [{
                required: false,
                message: "请输入备注",
                trigger: "blur"
              }]
            },
            {
              label: "打卡时间",
              prop: "createTime",
              format: "yyyy-MM-dd hh:mm:ss",
              addDisplay: false,
              editDisplay: false,
              viewDisplay: false
            },
            {
              label: "是否隔离",
              prop: "quarantine",
              type: 'radio',
              dicUrl: "/api/bid-system/dict/dictionary?code=quarantine",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入是否在隔离期",
                trigger: "blur"
              }]
            },
            {
              label: "是否在北京",
              prop: "beijing",
              type: 'radio',
              dicUrl: "/api/bid-system/dict/dictionary?code=hbbj",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入是否在北京",
                trigger: "blur"
              }]
            },
            {
              label: "是否经过湖北",
              prop: "hubei",
              type: 'radio',
              dicUrl: "/api/bid-system/dict/dictionary?code=hbbj",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: false,
                message: "请输入是否经过湖北",
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
          addBtn: this.vaildData(this.permission.clockln_add, false),
          viewBtn: this.vaildData(this.permission.clockln_view, false),
          delBtn: this.vaildData(this.permission.clockln_delete, false),
          editBtn: this.vaildData(this.permission.clockln_edit, false)
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
      convertUTCTimeToLocalTime(UTCDateString) {
        if(!UTCDateString){
          return '-';
        }
        function formatFunc(str) {    //格式化显示
          return str > 9 ? str : '0' + str
        }
        var date2 = new Date(UTCDateString);     //这步是关键
        var year = date2.getFullYear();
        var mon = formatFunc(date2.getMonth() + 1);
        var day = formatFunc(date2.getDate());
        // var hour = date2.getHours();
        // var noon = hour >= 12 ? 'PM' : 'AM';
        // hour = hour>=12?hour-12:hour;
        // hour = formatFunc(hour);
        // var min = formatFunc(date2.getMinutes());
        // var dateStr = year+'-'+mon+'-'+day+' '+noon +' '+hour+':'+min;
        var dateStr = year+'-'+mon+'-'+day;
        return dateStr;
      },
      rowSave(row, loading, done) {
        row.gobacktime = this.convertUTCTimeToLocalTime(row.gobacktime);
        let addr = row.address.trim()
        row.address = addr
        if (addr === "" || addr === "null") {
          this.$message({
            type: "fail",
            message: "请输入打卡地址!"
          });
          done();
          return false;
        } else {
        
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
        }
      },
      rowUpdate(row, index, loading, done) {
        row.gobacktime = this.convertUTCTimeToLocalTime(row.gobacktime);

        let addr = row.address.trim()
        row.address = addr
        if (addr === "" || addr === "null") {
          this.$message({
            type: "fail",
            message: "请输入打卡地址!"
          });
          done();
          return false;
        } else {
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
        }
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
            this.page.currentPage--;
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
            this.page.currentPage--;
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
