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
                   v-if="permission.quarantine_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/soybean/quarantine";
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
                message: "请输入",
                trigger: "blur"
              }]
            },
            {
              label: "用户",
              prop: "userId",
              type: 'select',
              dicUrl: "/api/bid-soybean/user/select",
              props: {
                label: "name",
                value: "id"
              },
              rules: [{
                required: true,
                message: "请输入",
                trigger: "blur"
              }]
            },
            {
              label: "是否返回",
              prop: "otherCity",
              type: 'select',
              dicUrl: "/api/bid-system/dict/dictionary?code=back",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入是否从其他城市返回",
                trigger: "blur"
              }]
            },
            {
              label: "隔离开始",
              prop: "startTime",
              type: 'date',
              format: "yyyy-MM-dd",
              pickerOptions: {
                disabledDate(time) {
                  return time.getTime() > Date.now();
                }
              },
              rules: [{
                required: true,
                message: "请输入开始观察时间",
                trigger: "blur"
              }]
            },
            {
              label: "当前地点",
              prop: "address",
              type: "textarea",
              rules: [{
                required: true,
                message: "请输入当前地点",
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
            {
              label: "发热",
              prop: "fever",
              type: 'radio',
              dicUrl: "/api/bid-system/dict/dictionary?code=fever",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入发热",
                trigger: "blur"
              }]
            },
            {
              label: "乏力",
              prop: "fatigue",
              type: 'radio',
              dicUrl: "/api/bid-system/dict/dictionary?code=fatigue",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入乏力",
                trigger: "blur"
              }]
            },
            {
              label: "干咳",
              prop: "hoose",
              type: 'radio',
              dicUrl: "/api/bid-system/dict/dictionary?code=hoose",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入干咳",
                trigger: "blur"
              }]
            },
            {
              label: "呼吸困难",
              prop: "dyspnea",
              type: 'radio',
              dicUrl: "/api/bid-system/dict/dictionary?code=dyspnea",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入呼吸困难",
                trigger: "blur"
              }]
            },
            {
              label: "腹泻",
              prop: "diarrhea",
              type: 'radio',
              dicUrl: "/api/bid-system/dict/dictionary?code=diarrhea",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入腹泻",
                trigger: "blur"
              }]
            },
            {
              label: "肌肉酸疼",
              prop: "muscle",
              type: 'radio',
              dicUrl: "/api/bid-system/dict/dictionary?code=muscle",
              props: {
                label: "dictValue",
                value: "dictKey"
              },
              rules: [{
                required: true,
                message: "请输入肌肉酸疼",
                trigger: "blur"
              }]
            },
            {
              label: "其他不适症状",
              prop: "other",
              type: "textarea",
              rules: [{
                required: false,
                message: "请输入其他不适症状",
                trigger: "blur"
              }]
            },
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
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.quarantine_add, false),
          viewBtn: this.vaildData(this.permission.quarantine_view, false),
          delBtn: this.vaildData(this.permission.quarantine_delete, false),
          editBtn: this.vaildData(this.permission.quarantine_edit, false)
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
        let addr = row.address.trim()
        row.address = addr
        if (addr === "" || addr === "null") {
          this.$message({
            type: "fail",
            message: "请输入当前地点!"
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

        let addr = row.address.trim()
        row.address = addr
        if (addr === "" || addr === "null") {
          this.$message({
            type: "fail",
            message: "请输入当前地点!"
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
