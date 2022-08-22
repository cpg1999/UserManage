<template>
  <div>
    <nav>用户管理</nav>
    <div class="container">
      <el-button @click="showDialog">新建</el-button>
      <el-autocomplete
        popper-class="my-autocomplete"
        v-model="keyword"
        :fetch-suggestions="querySearch"
        placeholder="输入关键字搜索"
        @select="handleSelect"
        style="margin-left: 20px"
      >
        <template slot-scope="{ item }">
          <div class="name">{{ item }}</div>
        </template>
      </el-autocomplete>
      <el-button @click="handlerSearch">搜索</el-button>
      <el-button class="revoke" @click="handlerRevoke">撤销</el-button>
      <el-table
        :data="tableData"
        style="width: 100%"
        class="table"
        border
        @select="getSelectList($event)"
      >
        <el-table-column type="selection" align="center" width="50px">
        </el-table-column>
        <el-table-column
          align="center"
          width="100px"
          label="姓名"
          prop="userName"
        >
        </el-table-column>
        <el-table-column align="center" width="100px" label="年龄" prop="age">
        </el-table-column>
        <el-table-column align="center" width="100px" label="性别" prop="sex">
        </el-table-column>
        <el-table-column
          align="center"
          width="150px"
          label="联系电话"
          prop="phone"
        >
        </el-table-column>
        <el-table-column
          align="center"
          width="width"
          label="详细地址"
          prop="city,address"
        >
          <template slot-scope="allAddress">
            {{ allAddress.row.city }}{{ allAddress.row.address }}
          </template>
        </el-table-column>

        <el-table-column align="center" width="170px" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="updateTableData(scope.row, scope.$index)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="deleteTableData(scope.row, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog center title="新建/编辑用户" :visible.sync="dialogFormVisible">
        <el-form :model="formData" :rules="formRules" ref="form">
          <el-form-item label="姓名" prop="userName" label-width="100px">
            <el-input
              v-model="formData.userName"
              autocomplete="off"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item label="年龄" label-width="100px">
            <el-input
              v-model="formData.age"
              autocomplete="off"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别" label-width="100px">
            <el-select v-model="formData.sex" style="width: 30%">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone" label-width="100px">
            <el-input
              v-model="formData.phone"
              autocomplete="off"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item label="详细地址" label-width="100px">
            <el-cascader
              :props="props"
              :options="options"
              v-model="formData.cityCheck"
              style="float: left"
            ></el-cascader>
            <el-input
              v-model="formData.address"
              placeholder="请输入详细地址"
              style="float: left; margin-left: 20px; width: 700px"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="addOrUpdate">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import addressCheck from "@/assets/chinaMap.js";

export default {
  name: "UserManage",
  data() {
    return {
      // dialog弹出与隐藏
      dialogFormVisible: false,
      //   顶部关键字搜索框收集数据
      keyword: "",
      //   用于判断当前是添加还是修改
      add: false,
      //   用于记录当前修改的是哪一条数据
      editIndex: null,
      // 用于收集当前符合关键字的候选条目
      filterList: [],
      // 拷贝原数据
      copyValue: [],
      // 用于记录用户选中的条目
      checkedList: [],
      //   表格展示数据
      tableData: [
        {
          userName: "小张",
          age: 23,
          sex: "女",
          phone: 15358827326,
          cityCheck: null,
          city: "",
          address: "1232424",
        },
        {
          userName: "小许",
          age: 24,
          sex: "男",
          phone: 12345678901,
          cityCheck: null,
          city: "",
          address: "12312312414",
        },
        {
          userName: "小鸡",
          age: 50,
          sex: "男",
          phone: 11011912012,
          cityCheck: null,
          city: "",
          address: "123124134",
        },
      ],
      //   dialog中收集的数据
      formData: {
        userName: "",
        age: null,
        sex: "",
        phone: null,
        cityCheck: null,
        city: "",
        address: "",
      },
      //   dialog输入规则
      formRules: {
        userName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: "blur",
          },
        ],
      },
      // 地区选择候选项
      options: addressCheck,
      props: {
        label: "name",
        value: "name",
        children: "children",
      },
      // 用于记录操作
      controlList: [
        {
          type: "",
          data: {},
        },
      ],
      willDelete: [],
      tempData: null,
    };
  },
  methods: {
    // 新建按钮弹出对话框
    showDialog() {
      this.dialogFormVisible = true;
      this.add = true;
      this.formData = {
        userName: "",
        age: null,
        sex: "",
        phone: null,
        cityCheck: null,
        city: "",
        address: "",
      };
    },
    // 对话框确定按钮添加或修改数据
    addOrUpdate() {
      this.$refs.form.validate((success) => {
        if (success) {
          this.dialogFormVisible = false;
          if (this.add) {
            if (this.formData.cityCheck) {
              this.formData.city = this.formData.cityCheck
                .toString()
                .replace(/,/g, "");
            } else {
              return "";
            }
            this.tableData.push(this.formData);
            window.localStorage.setItem("list", JSON.stringify(this.tableData));
            // 记录添加操作
            this.controlList.push({
              type: "add",
              data: this.formData,
            });
            this.$message({
              message: "新建用户成功",
              type: "success",
            });
            this.add = false;
          } else {
            if (this.formData.cityCheck) {
              this.formData.city = this.formData.cityCheck
                .toString()
                .replace(/,/g, "");
            } else {
              return "";
            }
            this.$set(this.tableData, this.editIndex, this.formData);
            window.localStorage.setItem("list", JSON.stringify(this.tableData));
            // 修改完后记录新数据
            this.controlList.push({
              type: "edit",
              data: this.formData,
            });
            this.$message({
              message: "修改用户成功",
              type: "success",
            });
            this.editIndex = null;
          }
        }
      });
      // 添加或修改成功后更新数据复制
      this.copyValue = this.tableData;
      this.formData = {
        userName: "",
        age: null,
        sex: "",
        phone: null,
        city: "",
        address: "",
      };
    },
    // 修改内容
    updateTableData(row, index) {
      console.log(row);
      this.dialogFormVisible = true;
      this.formData = { ...row };
      this.tempData = row;
      // 记录旧数据
      this.controlList.push({
        type: "edit",
        data: this.tempData,
      });
      this.editIndex = index;
    },
    cancel() {
      this.dialogFormVisible = false;
      if (this.controlList[this.controlList.length - 1].type == "edit") {
        this.controlList.pop();
      }
    },
    // 删除内容
    deleteTableData(row, index) {
      // 过滤出不需要删除的条目
      for (let i = 0; i < this.checkedList.length; i++) {
        this.copyValue = this.copyValue.filter((item) => {
          return item != this.checkedList[i];
        });
      }
      this.willDelete = this.checkedList;
      // 如果有选中的条目;
      if (this.checkedList.length > 0) {
        this.$confirm("是否删除选中的用户信息？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          // 可删除一条或多条
          .then(() => {
            this.tableData = this.copyValue;
            window.localStorage.setItem("list", JSON.stringify(this.tableData));
            if (this.willDelete.length > 1) {
              for (let i = 0; i < this.willDelete.length; i++) {
                this.controlList.push({
                  type: "delete",
                  data: this.willDelete[i],
                });
              }
            } else if ((this.willDelete.length = 1)) {
              this.controlList.push({
                type: "delete",
                data: this.willDelete[0],
              });
            }
            this.$message({
              type: "success",
              message: "删除成功",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    // 搜索功能
    querySearch(queryString, cb) {
      if (this.keyword) {
        // 将filterlist清空，循环姓名数组，
        this.filterList = [];
        for (let i = 0; i < this.tableData.length; i++) {
          if (
            this.tableData[i].userName.indexOf(this.keyword.toString()) !== -1
          ) {
            this.filterList.push(this.tableData[i].userName);
          }
        }
      }
      cb(this.filterList);
    },
    // 当点击候选项后，将候选项的内容展示在搜索框中
    handleSelect(item) {
      this.keyword = item;
    },
    // 搜索按钮
    // 如果有关键字，则过滤出关键字相关的条目，如果没有，则点击后展示所有数据
    handlerSearch() {
      if (this.keyword) {
        this.tableData = this.tableData.filter((item) => {
          return item.userName == this.keyword;
        });
      } else {
        this.tableData = this.copyValue;
      }
    },
    getSelectList(e) {
      this.checkedList = e;
    },
    // 撤销
    handlerRevoke() {
      console.log(this.controlList);
      if (this.controlList.length > 1) {
        if (this.controlList[this.controlList.length - 1].type == "add") {
          for (let i = 0; i < this.tableData.length; i++) {
            if (
              this.tableData[i] ==
              this.controlList[this.controlList.length - 1].data
            ) {
              this.tableData.splice(i, 1);
              window.localStorage.setItem(
                "list",
                JSON.stringify(this.tableData)
              );
              this.controlList.pop();
            }
          }
        } else if (
          this.controlList[this.controlList.length - 1].type == "delete"
        ) {
          window.localStorage.removeItem("list");
          this.tableData.push(
            this.controlList[this.controlList.length - 1].data
          );

          window.localStorage.setItem("list", JSON.stringify(this.tableData));
          this.controlList.pop();
        } else if (
          this.controlList[this.controlList.length - 1].type == "edit"
        ) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (
              this.tableData[i] ==
              this.controlList[this.controlList.length - 1].data
            ) {
              this.tableData.splice(
                i,
                1,
                this.controlList[this.controlList.length - 2].data
              );
              window.localStorage.setItem(
                "list",
                JSON.stringify(this.tableData)
              );
              this.controlList.pop();
              this.controlList.pop();
            }
          }
        }
      } else {
        alert("已经到第一步了");
      }
    },
  },
  mounted() {
    // 初始化复制一份数据
    this.tableData = JSON.parse(window.localStorage.getItem("list"));
    this.copyValue = this.tableData;
  },
};
</script>

<style scoped>
nav {
  width: 100%;
  height: 100px;
  background-color: #ececec;
  text-align: center;
  line-height: 100px;
}
.container {
  width: 60%;
  margin: 0 auto;
  margin-top: 50px;
}
.my-autocomplete {
  width: 300px;
  margin-left: 20px;
}
.name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.revoke {
  float: right;
}
.table {
  margin-top: 20px;
}
</style>
