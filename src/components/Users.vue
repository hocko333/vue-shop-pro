<template>
  <div class="user-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 搜索区域 -->
        <el-col :span="8">
          <el-input
            placeholder="输入关键字, 搜索用户名"
            v-model="userParams.query"
            @keyup.enter.native="getUsersList"
            @clear="getUsersList"
            :clearable="true"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="7">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="userList" stripe border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="130"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="170"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="70">
          <el-switch
            slot-scope="info"
            v-model="info.row.mg_state"
            @change="handleStateChange(info.row.id, info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="{ row }">
            <el-tooltip effect="dark" content="编辑" :enterable="false" placement="top">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUser(row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" :enterable="false" placement="top">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="delUser(row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" :enterable="false" placement="top">
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userParams.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="userParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="userParams.totalPage"
      ></el-pagination>

      <!-- dialog 对话框 -->
      <!-- 添加用户 dialog -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户 dialog -->
      <el-dialog
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="editFormRules">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </el-dialog>

      <!-- /dialog 对话框 -->
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUsersList()
  },
  data() {
    let checkMobile = (rule, value, callback) => {
      if (!/^1[345678]\d{9}$/.test(value)) {
        // 格式不正确
        return callback(new Error('手机号码格式不正确'))
      }
      callback()
    }

    return {
      userParams: {
        query: '',
        pagenum: 1,
        pagesize: 2,
        totalPage: 0
      },
      userList: [],
      addDialogVisible: false, // 添加用户对话框 隐现标识
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '用户名为必填项', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码为必填项', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号为必填项', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false, // 编辑用户对话框 隐现标识
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号为必填项',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get('/users', {
        params: this.userParams
      })
      // 获取用户列表数据失败 提示用户
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 获取用户列表数据成功
      this.userList = res.data.users
      // 渲染总数据条数
      this.userParams.totalPage = res.data.total
    },
    async handleStateChange(uid, state) {
      const { data: res } = await this.$http.put(`/users/${uid}/state/${state}`)
      // 修改用户状态失败
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 修改用户状态成功
      this.$message.success(res.meta.msg)
    },
    handleSizeChange(arg) {
      this.userParams.pagesize = arg
      this.getUsersList()
    },
    handleCurrentChange(arg) {
      this.userParams.pagenum = arg
      this.getUsersList()
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        // 整张表单验证不成功 不执行后续代码
        if (!valid) return
        // 验证成功 向后端提交表单内容
        const { data: res } = await this.$http.post('/users', this.addForm)
        if (res.meta.status !== 201) {
          // post请求失败 弹出提示消息
          return this.$message({
            message: res.meta.msg,
            type: 'error',
            duration: 1500
          })
        }
        // 添加用户成功: 关闭对话框, 刷新列表, 提示成功消息
        this.addDialogVisible = false
        this.getUsersList()
        this.$message({
          message: res.meta.msg,
          type: 'success',
          duration: 1500
        })
      })
    },
    delUser(id) {
      this.$confirm('您确定要删除该用户吗?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: res } = await this.$http.delete('/users/' + id)
          if (res.meta.status !== 200) {
            // 删除用户失败
            return this.$message({
              message: res.meta.msg,
              type: 'error',
              duration: 1500
            })
          }
          // 删除用户成功
          this.$message({
            message: res.meta.msg,
            type: 'success',
            duration: 1500
          })
          this.getUsersList()
        })
        .catch(() => {})
    },
    async editUser(id) {
      // 获取用户原有信息 展示在对话框上
      const { data: res } = await this.$http.get('/users/' + id)
      if (res.meta.status !== 200) {
        // 获取用户数据失败
        return this.$message({
          message: res.meta.msg,
          type: 'error',
          duration: 1500
        })
      }
      // 获取用户数据成功 弹出对话框
      this.editDialogVisible = true
      // 渲染到页面上
      this.editForm = res.data
    },
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    saveEdit() {
      // 保存编辑之前 验证整张表单
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 表单验证成功 提交编辑
        const { data: res } = await this.$http.put('/users/' + this.editForm.id, this.editForm)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        // 编辑提交成功
        this.editDialogVisible = false
        this.getUsersList()
        this.$message.success(res.meta.msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
