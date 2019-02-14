<template>
  <div id="login-container">
    <div id="login-box">
      <div class="avatar">
        <img src="../assets/img/logo.png">
      </div>

      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>

        <el-row>
          <el-col :offset="15">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('/login', this.loginForm)
          if (res.meta.status !== 200) {
            return this.$message.error('用户名或密码不正确,请重试!')
          }
          // 登录成功 将用户的 token 令牌存入sessionStorage
          window.sessionStorage.setItem('token', res.data.token)
          // 重定向到后台首页
          this.$router.push('/home')
        }
      })
    },
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#login-container {
  background-color: rgb(34, 77, 107);
  height: 100%;
  overflow: hidden;

  #login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar {
      width: 148px;
      height: 148px;
      border-radius: 50%;
      box-sizing: border-box;
      border: 1px solid #eee;
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      img {
        border-radius: 50%;
        width: 100%;
        background-color: #eee;
      }
    }

    .el-form {
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
      position: absolute;
      bottom: 0;
    }
  }
}
</style>
