<template>
  <div class="body">
    <div class="top-line">
      <h1>ICA-GAME</h1>
      <div class="container1">
        <div class="item1" :class="{'active':selected_index==index1+3}"  v-for="(item1, index1) in tabs.slice(3,5)" :key="index1" @click="handleClick1(index1)">
          <div class="title1">{{item1.name}}</div>
        </div>
      </div>
    </div>
    <!-- 登录模块  -->
    <div class="fourth" v-if="selected_index==3">
      <div class="login-box" v-proportion="0.55">
        <h2 style="color:rgb(101,138,144);">登录</h2>
        <el-form :model="loginMsg" :rules="loginRules" ref="loginMsg" label-width="100px" class="demo-ruleForm">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="loginMsg.phone"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginMsg.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitLoginForm('loginMsg')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 注册模块  -->
    <div class="fifth" v-if="selected_index==4">
      <div class="login-box" v-proportion="0.85">
        <h2 style="color:rgb(101,138,144);">注册</h2>
        <el-form :model="setupMsg" :rules="setupRules" ref="setupMsg" label-width="100px" class="demo-ruleForm">
          <el-form-item label="昵称" prop="username">
            <el-input v-model="setupMsg.username"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="setupMsg.phone"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="setupMsg.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitSetupForm('setupMsg')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
//import { jsonp } from 'vue-jsonp'
const axios = require('axios').default;
axios.defaults.withCredentials = true;
export default {
  name: 'login',
  mounted(){

  },
  data(){
    return{
      tabs:[{"name":"排行榜"},{"name":"开始游戏"},{"name":"个人中心"},{"name":"登录"},{"name":"注册"}],
      /*目前选择的tab */
      selected_index:3,
      /*登录信息 */
      loginMsg:{
        phone:"",
        password:"",
      },
      loginRules:{
        phone:[
          {required:true,message:"请输入手机号",trigger: 'blur'}
        ],
        password:[
          {required:true,message:"请输入密码",trigger: 'blur'}
        ]
      },
      /**注册信息 */
      setupMsg:{
        username:"",
        phone:"",
        password:"",
      },
      setupRules:{
        username:[
          {required:true,message:"请输入昵称",trigger: 'blur'}
        ],
        phone:[
          {required:true,message:"请输入电话号码",trigger: 'blur'}
        ],
        password:[
          {required:true,message:"请输入密码",trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    /**点击不同tab显示不同模块（登录或注册） */
    handleClick1(index) {
      console.log(index);
      this.selected_index=index+3;
    },
    /**登录信息表单提交 */
    submitLoginForm(formName){
      let data = new FormData();
      data.append("phone",this.loginMsg.phone);
      data.append("password",this.loginMsg.password);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          /**将数据传至后台，判断登录信息是否正确，不正确则留在本页面，正确则跳至主页面 */
          axios({
            method:'post',
            url: axios.defaults.baseURL+'/login',
            data : data
          }).then((res)=>{
            console.log("res:",res);
            /**数据成功传至后台后，若登录信息组正确，则返回相关信息msg(此时暂用loginMsg代替)，跳至mainpage */
            this.$router.push({path:'/main',query:{"msg":this.loginMsg}});
          }).catch((e) =>{
            console.log(e);
            if(e.response.status===401&&e.response.data.data===false){
              this.loginMsg.password="";
              alert(e.response.data.msg);
            }
          })
        } else {
          alert('登录信息填写错误');
          return false;
        }
      });
    },
    /**注册信息表单提交 */
    submitSetupForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('提交注册信息成功!');
          console.log("setupMsg:",this.setupMsg);
          /**将数据传至后台，进行存储 */
          axios({
            method:'post',
            url:axios.defaults.baseURL+'/members/signup',
            // withCredentials: true,
            params: {
              username: this.setupMsg.username,
              password: this.setupMsg.password,
              phone: this.setupMsg.phone
            }
          }).then((res)=>{
            console.log("res:",res);
            if(res.data.data===false){
              alert("手机号已经注册");
            }else {
              alert("注册成功");
              /**数据成功传至后台后，成功存储后，跳至登录页面*/
              this.selected_index = 3;
            }
            this.setupMsg.username="";
            this.setupMsg.phone="";
            this.setupMsg.password="";
          })
        } else {
          alert('注册信息填写错误');
          return false;
        }
      });
    }
  }
}
</script>

<style scoped >
body{
  padding: 0;
  margin: 0;
}
.top-line{
  background-color:rgb(116, 149, 154);
  height: 80px;
}
.top-line h1{
  float: left;
  color:white;
  padding: 0.55em;
  margin-top: 0.5%;
  height:100%;
}

.active{
  background-color: white;
  color:black;
}

.top-line .container1{
  background-color: rgb(116, 149, 154);
  height: 100%;
  width:20%;
  float:right;
  margin-right:66px;
  color:white;
  margin-top:0px;
  /* margin: 0.5em; */
}
.top-line .container1:hover{
  cursor: pointer;
}
.top-line .container1 .item1{
  display: inline-block;
  width:30%;
  height:100%;
  padding: 0;
  margin:0;
  text-align: center;
}

.top-line .container1 .item1 .title1{
  width:80%;
  height:50%;
  padding: 0;
  margin-top: 30px;
  text-align: center;
  margin-left:10px;
  font-size:20px;
}


.fourth{
  width:100%;
  height:400px;
  display: flex;
  margin: 0;
  padding: 0;
}
.fourth .login-box{
  width:40%;
  /* v-proportion:"1.5"; */
  background-color: rgb(205,214,216);
  text-align: center;
  padding: 0;
  margin-left: 30%;
}
.fourth .login-box .el-form{
  margin-left: -30px;
  margin-right: 20px;
}
.fourth .el-button--primary{
  background-color: rgb(117,149,154);
  border-color:rgb(242,242,242);
  border-radius: 10px;
  margin-left: -16%;
}
.fifth{
  width:100%;
  height:480px;
  display: flex;
  margin: 0;
  padding: 0;
}
.fifth .login-box{
  width:40%;
  /* v-proportion:"1.5"; */
  background-color: rgb(205,214,216);
  text-align: center;
  padding: 0;
  margin-left: 30%;
}
.fifth .login-box .el-form{
  margin-left: -20px;
  margin-right: 30px;
}
.fifth .el-button--primary{
  background-color: rgb(117,149,154);
  border-color:rgb(242,242,242);
  border-radius: 10px;
  margin-left: -16%;
}
</style>
