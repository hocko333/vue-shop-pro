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
          <el-button type="primary">添加用户</el-button>
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
          <el-row>
            <el-tooltip effect="dark" content="编辑" :enterable="false" placement="top">
              <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" :enterable="false" placement="top">
              <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" :enterable="false" placement="top">
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </el-row>
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
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUsersList()
  },
  data() {
    return {
      userParams: {
        query: '',
        pagenum: 1,
        pagesize: 2,
        totalPage: 0
      },
      userList: []
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
