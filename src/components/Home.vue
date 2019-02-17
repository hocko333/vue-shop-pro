<template>
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/img/heima.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <el-aside :style="`transition: width .3s ease-out; width: ${isCollapse ? '65px' : '200px'}`">
        <div class="collapse-btn" @click="isCollapse=!isCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          style="border-right: none;"
        >
          <el-submenu
            :index="item.id+''"
            v-for="(item, i) in menuList"
            :key="item.id"
            :style="isCollapse ? 'width: 65px' : 'width: 200px'"
          >
            <template slot="title">
              <i :class="`iconfont icon-${menuIcon[i]}`"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index="`/${item2.path}`" v-for="item2 in item.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              <span>{{ item2.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
  },
  data() {
    return {
      menuList: [],
      menuIcon: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao'],
      isCollapse: false
    }
  },
  methods: {
    logout() {
      // 弹框提示用户是否确定退出
      this.$confirm('确定退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除 token
          window.sessionStorage.removeItem('token')
          // 重定向到登录页
          this.$router.push('/login')
        })
        .catch(() => {})
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) {
        // 请求权限列表数据 不成功
        return this.$message.error('请求权限数据失败!')
      }
      // 权限列表 请求成功
      this.menuList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;

  .el-header {
    height: 60px;
    background-color: rgb(56, 63, 67);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    padding-right: 20px;
    user-select: none;

    .logo-box {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 22px;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    overflow: hidden;
    .collapse-btn {
      height: 25px;
      line-height: 25px;
      background-color: #4a5064;
      color: #fff;
      font-size: 12px;
      letter-spacing: 0.2em;
      text-indent: 23px;
      font-weight: 700;
      cursor: pointer;
      user-select: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
