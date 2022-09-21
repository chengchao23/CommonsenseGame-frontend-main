<template>
    <div class="body">
        <div class="top-line">
            <h1>ICA-GAME</h1>
            <div class="container">
                <div class="item" :class="{'active':selected_index==index}"  v-for="(item, index) in tabs.slice(0,3)" :key="index" @click="handleClick(index)">
                    <div class="title">{{item.name}}</div>
                </div>
            </div>
            <div class="container1">
              <div class="item" @click="logout">
                <div class="title"  >退出登录</div>
              </div>
            </div>
            <div class="container2">
              <h2>您好，{{name}}</h2>
            </div>
        </div>
        <!-- 个人信息模块  -->
<!--      @row-click="show_ans"-->
        <div class="third" v-if="selected_index==2">
            <div class="team_detail" v-if="if_fix==false">
                <h2>团队管理</h2>
                <el-button type="primary" style="float:right;margin-top:-3%;margin-right:10%;" @click="fix_p">个人信息修改</el-button>
                <el-table
                :data="team_detail"
                border
                height="180"
                style="width: 80%">
                    <el-table-column
                    prop="name"
                    label="团队名称"
                    width="150"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="teammate"
                    label="小队队友"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="role"
                    label="您的角色"
                    width="80">
                    </el-table-column>
                    <el-table-column
                    prop="score"
                    label="总分"
                    width="80"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="total"
                    label="完成题数"
                    width="80"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="average"
                    label="平均得分"
                    width="80"
                    >
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    >
                    <template slot-scope="scope">
                      <el-button type="primary" @click="fix(scope.$index)" >修改队名</el-button>
                      <el-button type="primary" @click="fixTeamName(scope.$index)">角色转换</el-button>
                      <el-button type="primary" @click.native.prevent="deleteRow(scope.$index, team_detail)">删除团队</el-button>
                      <el-button type="primary" @click="show_detail(scope.$index)">查看详情</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <el-divider style="width:80%;"></el-divider>
                <h2 v-if="X_show" style="margin-top:2%;" v-loading="X_loading">{{X_team}}团队做题详情</h2>
                <el-table class="a"
                :data="X_detail"
                v-loading="X_loading"
                border
                v-if="X_show"
                height="180"
                style="width: 90%">
                    <el-table-column
                    prop="videoNumber"
                    label="题号"
                    width="60">
                    </el-table-column>
                    <el-table-column
                      prop="member1Name"
                      label="描述者"
                      width="70">
                    </el-table-column>
                    <el-table-column
                      prop="member2Name"
                      label="猜测者"
                      width="70">
                    </el-table-column>
                    <el-table-column
                    prop="character"
                    label="视频主体"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="behavior"
                    label="主体在做什么"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="intention"
                    label="为什么做"
                    width="150"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="result"
                    label="可能的后续"
                    width="150"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="attribute"
                    label="主体属性"
                    width="100"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="caption"
                    label="可能的标题"
                    width="200"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="simCaption"
                      label="最相似标题"
                      width="250"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="score"
                    label="分数"
                    >
                    </el-table-column>
                </el-table>
            </div>
            <!-- 个人信息修改模块 -->
            <div class="fix_personal_info" v-if="if_fix==true" v-proportion="0.65">
                 <h2 style="color:rgb(101,138,144);">账户信息</h2>
                 <el-form :model="setupMsg" :rules="setupRules" ref="setupMsg" label-width="100px" class="demo-ruleForm">
                     <el-form-item label="昵称" prop="username">
                        <el-input v-model="setupMsg.username"></el-input>
                    </el-form-item>
                    <el-form-item label="电话号码" prop="phone">
                        <el-input v-model="setupMsg.phone" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="setupMsg.password" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="submit()">提交</el-button>
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
    name: 'personalInfo',
    mounted(){
        axios({
          method:'get',
          url: axios.defaults.baseURL+'/members/me'
        }).then((res)=>{
          this.name = res.data.data.username
        }).catch((e)=>{
          console.log(e.response.status);
          if(e.response.status===500){
            alert('登录失效，请重新登录');
            this.$router.push({path:'/login'});
          }
        })
        /**
         * 加载该用户的参与的所有小组的数据team_detail
         * CODE
         */
        axios({
          method:'get',
          url: axios.defaults.baseURL+'/group/findAll'
        }).then((res) => {
          if(res.data.data!=null){
            console.log(res.data.data)
            for(var i=0;i<res.data.data.length;i++){
              res.data.data[i].first['score'] = res.data.data[i].first['score'].toFixed(2)
              res.data.data[i].first['average'] = res.data.data[i].first['average'].toFixed(2)
              this.team_detail.push(res.data.data[i].first);
            }
            // console.log(this.team_detail);
          }else {
            console.log(res.data);
          }
        })
    },
    data(){
        return{
            name:'',
            tabs:[{"name":"排行榜"},{"name":"开始游戏"},{"name":"个人中心"},{"name":"登录"},{"name":"注册"}],
            /*目前选择的tab */
            selected_index:2,
            /**所有团队信息 */
            team_detail:[
            ],
            /**被选中查看做题详情的团队 */
            X_team:"",
            /**是否展示做题详情 */
            X_show:false,
            X_loading:false,
            /**X团队的做题详情 */
            X_detail:[],
            /**是否修改个人信息 */
            if_fix:false,
            /*记录用户的登录信息 */
            loginMsg:{
                phone:"",
                password:"",
            },
            /**记录用户的注册信息，个人信息修改即修改其中的username */
            setupMsg:{
                username:"",
                phone:"",
                password:"",
            },
            setupRules:{
                username:[
                    {required:true,message:"请输入昵称",trigger: 'blur'}
                ],

            }
        }
    },
    methods:{
        logout(){
          this.$router.push({path:'/login'});
        },
        handleClick(index) {
          console.log(index);
          if(index===0){
              this.$router.push({path:'/main',query:{"msg":this.loginMsg}});
          }
          else if(index===1){
              this.$router.push({path:'/startGame',query:{"msg":this.loginMsg}});
          }
        },
        fix(row){
            console.log(row);
            this.$prompt('请输入新队名', '修改队名', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
              inputErrorMessage: '队名不能为空'
            }).then(({ value }) => {
            axios({
              method : "post",
              url: axios.defaults.baseURL+'/group/rename',
              params : {
                groupName : this.team_detail[row].name,
                newName : value
                }
            }).then((res)=>{
              if(res.data.data){
                this.$message({
                  type: 'success',
                  message: '新队名是: ' + value
                });
                /**修改队名 */
                this.team_detail[row].name=value;
              }else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                });
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        },
        fixTeamName(row){
            // var teamToFix = this.team_detail[row];
            /**根据小组信息在后台找到需要角色转换的小组，向另一小组成员消息列表中加入该请求
             * CODE...
             */
            axios({
              method :'post',
              url : axios.defaults.baseURL + '/message/change',
              params:{
                groupName : this.team_detail[row].name
              }
            }).then((res)=>{
              if(res.data.data){
                this.$message({
                  type: 'success',
                  message: '成功发送消息'
                });
              }else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                });
              }
            })
        },
        deleteRow(index, rows) {
          /**
           * 从后台中删除这一小组的信息
          */
          axios({
            method:'delete',
            url: axios.defaults.baseURL+'/group/delete',
            params:{
              groupName : this.team_detail[index].name
            }
          }).then((res)=>{
            if(res.data.data){
              rows.splice(index, 1);
              this.$message({
                type: 'success',
                message: '成功删除小组'
              });
            }else {
              this.$message({
                type: 'success',
                message: res.data.msg
              });
            }
          })
        },
        async  show_detail(row) {
　　　　　　console.log(row.name);
          this.X_loading=true;
          this.X_team=this.team_detail[row].name;
          await new Promise((resolve) => {
            setTimeout(() => {
              /**
               * 根据团队名称从后台获取该团队的已完成游戏记录，放入X_detail
               * CODE...
               */
              axios({
                method:'get',
                url:axios.defaults.baseURL+'/game/findFinishedGamesByGroupName',
                params:{
                  groupName : this.team_detail[row].name
                }
              }).then((res) =>{
                if(res.data.data!=null){
                  this.X_detail=[];
                  for(var i=0;i<res.data.data.length;i++){
                    this.X_detail.push(res.data.data[i]);
                  }
                  console.log(this.X_detail)
                }
              })
              this.X_loading = false
              this.X_show = true
              resolve()
            }, 1000)
          })
        },
        fix_p(){
            this.if_fix=true;
        },
        submit() {
          axios({
            method : 'post',
            url: axios.defaults.baseURL +'/members/update',
            params: {
              name: this.setupMsg.username
            }
          }).then((res)=>{
            if(res.data.data){
              this.$message({
                type: 'success',
                message: '成功更改昵称'
              });
            }else {
              this.$message({
                type: 'error',
                message: res.data.msg
              });
            }
          })
          this.$router.push({path:'/main',query:{"msg":this.loginMsg}});
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
    display: flex;
}
.top-line h1{
    float: left;
    color:white;
    padding: 0.55em;
    margin-top: 0.1%;
    height:100%;
}
.top-line .container{
    background-color: rgb(116, 149, 154);
    height: 100%;
    width:40%;
    float:right;
    margin-right:0px;
    color:white;
    /* margin: 0.5em; */
}
.top-line .container:hover{
    cursor: pointer;
}
.top-line .container .item{
    display: inline-block;
    width:30%;
    height:100%;
    padding: 0;
    margin:0;
    text-align: center;
}

.active{
    background-color: white;
    color:black;
}

.top-line .container .item .title{
    width:80%;
    height:50%;
    padding: 0;
    margin-top: 30px;
    text-align: center;
    margin-left:10px;
    font-size:20px;
}
.top-line .container1{
  background-color: rgb(116, 149, 154);
  height: 100%;
  width:10%;
  margin-left: -10px;
  float:right;
  color:white;
  /* margin: 0.5em; */
}
.top-line .container1 .item{
  display: inline-block;
  width:100%;
  height:100%;
  padding: 0;
  margin:0;
  text-align: center;
}

.top-line .container1 .item .title{
  width:80%;
  height:50%;
  padding: 0;
  margin-top: 30px;
  text-align: center;
  margin-left:10px;
  font-size:20px;
}

.top-line .container2{
  background-color: rgb(116, 149, 154);
  height: 100%;
  width:10%;
  float:right;
  margin-left: 25%;
  color:white;
  /* margin: 0.5em; */
}
.top-line .container2 h1{
  float: left;
  color:white;
  font-size: 30px;
  padding: 0.58em;
  margin-top: 0%;
  height:100%;
  /* margin: 0.5em; */
}

.third{
    width:100%;
    height:480px;
    display: flex;
    margin: 0;
    padding: 0;
}
.third .team_detail{
    width:100%;
   margin-top: 30px;
}
.third .team_detail h2{

}
.third .team_detail .el-table{
    margin-left: 10%;
}
.third .team_detail .a {
  margin-left: 5%;
}
.third .team_detail .el-table .el-button--primary{
    background-color: rgb(117,149,154);
    border-color:rgb(206, 215, 217);
}
.third .team_detail .el-divider--horizontal{

    display: block;
    height: 1px;
    width: 90%;
    margin: 24px 5%;

}
.third .team_detail .el-button--primary{
    background-color: rgb(116, 149, 154);
    border-color:rgb(115,126,128);
}
.third .fix_personal_info{
    width:40%;
    /* v-proportion:"1.5"; */
    background-color: rgb(205,214,216);
    text-align: center;
    padding: 0;
    margin-left: 30%;
}
.third .fix_personal_info .el-form{
    margin-right: 5%;
}
.third .fix_personal_info .el-button--primary{
    background-color: rgb(117,149,154);
    border-color:rgb(242,242,242);
    border-radius: 10px;
    margin-left: -16%;
}

</style>
