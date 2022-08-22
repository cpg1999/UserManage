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
          <div class="name">{{ item.name }}</div>
        </template>
      </el-autocomplete>
      <el-button @click="handlerSearch">搜索</el-button>
      <el-button class="revoke">撤销</el-button>
      <el-table :data="tableData" style="width: 100%" class="table" border>
        <el-table-column type="selection" align="center" width="50px">
        </el-table-column>
        <el-table-column align="center" width="100px" label="姓名" prop="name">
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
          prop="address"
        >
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
              @click="deleteTableData(scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog center title="新建/编辑用户" :visible.sync="dialogFormVisible">
        <el-form :model="formData" :rules="formRules" ref="form">
          <el-form-item label="姓名" prop="name" label-width="100px">
            <el-input
              v-model="formData.name"
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
            <el-cascader :props="props" style="float: left"></el-cascader>
            <el-input
              v-model="formData.address"
              placeholder="请输入详细地址"
              style="float: left; margin-left: 20px; width: 700px"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrUpdate">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
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
      //   表格展示数据
      tableData: [
        {
          name: "小张",
          age: 23,
          sex: "女",
          phone: 15358827326,
          address: "xxxxxx",
          display: true,
        },
        {
          name: "小许",
          age: 24,
          sex: "男",
          phone: 12345678901,
          address: "xxxxx",
          display: false,
        },
        {
          name: "小鸡",
          age: 50,
          sex: "男",
          phone: 11011912012,
          address: "1234555124",
          display: true,
        },
      ],
      //   dialog中收集的数据
      formData: {
        name: "",
        age: null,
        sex: "",
        phone: null,
        address: "",
      },
      //   dialog输入规则
      formRules: {
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            max: 11,
            min: 11,
            message: "请输入11位联系电话",
            trigger: "blur",
          },
        ],
      },
      filterList: [],
      copyValue: [],
      props: {
        // lazy: true,
        // lazyLoad(node, resolve) {
        //   const { level } = node;
        //   // //   setTimeout(() => {
        //   // //     const nodes = Array.from({ length: level + 1 }).map((item) => ({
        //   // //       //   value: ++id,
        //   // //       //   label: `选项${id}`,
        //   // //       //   leaf: level >= 2,
        //   // //     }));
        //   //     // 通过调用resolve将子节点数据返回，通知组件数据加载完成
        //   //     resolve(nodes);
        //   //   }, 1000);
        // },
      },
    };
  },
  methods: {
    // 新建按钮弹出对话框
    showDialog() {
      this.dialogFormVisible = true;
      this.add = true;
      this.formData = {
        name: "",
        age: null,
        sex: "",
        phone: null,
        address: "",
      };
    },
    // 对话框确定按钮添加或修改数据
    addOrUpdate() {
      this.$refs.form.validate((success) => {
        if (success) {
          this.dialogFormVisible = false;
          if (this.add) {
            this.tableData.push(this.formData);
            this.$message({
              message: "新建用户成功",
              type: "success",
            });
            this.add = false;
          } else {
            this.$set(this.tableData, this.editIndex, this.formData);
            this.$message({
              message: "修改用户成功",
              type: "success",
            });
            this.editIndex = null;
          }
        }
      });
      this.copyValue = this.tableData;
    },
    // 修改内容
    updateTableData(row, index) {
      this.dialogFormVisible = true;
      this.formData = { ...row };
      this.editIndex = index;
    },
    // 删除单条内容
    deleteTableData(index) {
      this.$confirm("是否删除该用户信息？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData.splice(index, 1);
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
      this.copyValue = this.tableData;
    },
    // 搜索功能
    querySearch(queryString, cb) {
      if (this.keyword) {
        this.filterList = [];

        for (let i = 0; i < this.searchList.length; i++) {
          if (this.searchList[i].name.indexOf(this.keyword) !== -1) {
            this.filterList.push(this.searchList[i]);
          }
        }
      }
      cb(this.filterList);
    },
    handleSelect(item) {
      this.keyword = item.name;
    },
    handlerSearch() {
      if (this.keyword) {
        this.tableData = this.tableData.filter((item) => {
          return item.name == this.keyword;
        });
      } else {
        console.log(this.copyValue);
        this.tableData = this.copyValue;
      }
    },
  },
  computed: {
    searchList() {
      let arr = [];
      for (let i = 0; i < this.tableData.length; i++) {
        let str = { name: this.tableData[i].name };
        arr.push(str);
      }
      return arr;
    },
  },
  mounted() {
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
