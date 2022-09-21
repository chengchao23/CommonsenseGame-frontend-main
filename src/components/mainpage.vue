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
                <div class="title">退出登录</div>
              </div>
            </div>
            <div class="container2">
              <h2>您好，{{name}}</h2>
            </div>
        </div>
        <div class="first" v-if="selected_index==0">
            <div class="left" >
                <div class="title">排行榜</div>
                <el-table
                :data="team_rank_data"
                border
                height="840"
                style="width: 100%">
                    <el-table-column
                      type="index"
                      label="排名"
                      width="50"
                      align="center">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="团队名称"
                    align="center">
                    </el-table-column>
                    <el-table-column
                      prop="average"
                      label="平均分数"
                      sortable
                      width="110"
                      align="center">
                    </el-table-column>
                    <el-table-column
                    prop="score"
                    label="总分"
                    width="100"
                    sortable
                    align="center">
                    </el-table-column>
                    <el-table-column
                    prop="total"
                    label="完成题数"
                    width="110"
                    sortable
                    align="center">
                    </el-table-column>
                    <el-table-column
                      prop="topone"
                      label="单次最高"
                      width="110"
                      sortable
                      align="center">
                    </el-table-column>
                </el-table>
            </div>
            <div class="right">
                <div class="title">游戏详情</div>
                <div class="msg-group1" @scroll="scrollGet($event)">
                    <div class="msg1" v-if="detail_list.length===0">暂无待做游戏</div>
                    <div class="msg" v-for="(item, index) in detail_list" :key="index">
                        <div class="content">您在{{item.first}}团队有{{item.second}}题可进行猜标题活动哦～</div>
                    <el-button-group>
                    <el-button type="primary"  size="mini" @click="toStart">立即开始</el-button>
                    </el-button-group>
                        </div>
                </div>
                <div class="title">消息列表</div>
                <div class="msg-group" @scroll="scrollGet($event)">
                    <div class="msg1" v-if="messageList.length===0">消息列表为空</div>
                    <div class="msg" v-for="(item, index) in messageList" :key="index">
                      <div class="content" v-if="messageList[index].type===1">{{item.inviterName}}邀请您加入{{item.groupName}}团队并担任{{item.role}}角色</div>
                      <div class="content" v-if="messageList[index].type===2">{{item.groupName}}团队的{{item.inviterName}}提出交换角色</div>
                    <el-button-group>
                    <el-button type="primary"  size="mini" @click="msgYes(index)">同意</el-button>
                    <el-button type="primary"  size="mini" @click="msgNo(index)">拒绝</el-button>
                    </el-button-group>
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//import { jsonp } from 'vue-jsonp'
import router from "../router";

const axios = require('axios').default;
axios.defaults.withCredentials = true;
export default {
    name: 'mainpage',
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
         * 加载该用户的消息列表的数据message_list
         * CODE
         */
        axios({
          method:'get',
          url: axios.defaults.baseURL+'/message/find'
        }).then((res) =>{
          console.log(res);
          if(res.data.data!=null){
            var messages = res.data.data;
            for (var i=0;i<messages.length;i++){
              if(messages[i].role===1){
                messages[i].role ="描述者";
              }else if (messages[i].role===2){
                messages[i].role ="猜测者";
              }
              this.messageList.push(messages[i]);
            }
            console.log(1)
            console.log(this.messageList);
          }else{
            console.log("没有消息");
            this.messageList = [];
          }
        })
        /**
         * 加载该用户的参与的未完成的游戏detail_list
         * CODE
         */
        axios({
          method:'get',
          url: axios.defaults.baseURL+'/game/findByAsMember2'
        }).then((res) => {
          if(res.data.data!=null){
            for(var i=0;i<res.data.data.length;i++){
              this.detail_list.push(res.data.data[i]);
            }
          }else{
            console.log(res.data);
          }
        })
        /**
         * 加载排行榜列表team_rank_data
         * CODE
         */
        axios({
          method:'get',
          url:axios.defaults.baseURL+'/group/allValid',
        }).then((res)=>{
          console.log(res.data.data);
          if(res.data.data!=null){
            var i;
            for(i=0;i<res.data.data.length;i++){
              res.data.data[i]['score'] = res.data.data[i]['score'].toFixed(2)
              res.data.data[i]['average'] = res.data.data[i]['average'].toFixed(2)
              res.data.data[i]['topone'] = res.data.data[i]['topone'].toFixed(2)
              this.team_rank_data.push(res.data.data[i])
            }
            console.log(this.team_rank_data)
          }
        })
    },
    data(){
        return{
            name:'',
            tabs:[{"name":"排行榜"},{"name":"开始游戏"},{"name":"个人中心"},{"name":"登录"},{"name":"注册"}],
            /*目前选择的tab */
            selected_index:0,
            /* 排行榜的数据 */
            team_rank_data:[],
            /*排行榜目前显示的页码 */
            // current_page:0,
            /* 如果已经登录，消息列表的数据 */
            messageList:[],
            /* 如果已经登录，游戏详情的数据 */
            detail_list:[
            ],
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
        /**
         * 跳转至其他模块（开始游戏，个人中心）
         * query中代表要传至该页面的参数，可按需传入，目前只是个例子
         */
        if(index==1){
            this.$router.push({path:'/startGame',query:{"msg":this.loginMsg}});
        }
        else if(index==2){
            this.$router.push({path:'/personInfo',query:{"msg":this.loginMsg}});
        }
      },
      scrollGet (e) {
        console.log(e.srcElement.scrollTop, e.target.scrollTop)
      },
      toStart(){
          /**
           * 根据此时参加游戏的小组信息为用户的角色赋值
           * CODE...this.my_character=""
           * */
          /**
           * 如果是描述者，从后台传入相应的视频，禁用词等
           * 如果是猜标题者，传入该游戏对应的描述
           * CODE...
           */
          this.$router.push({path:'/startGame'});
      },
      msgYes(index){
          console.log("msgIndex:",index);
          /**按照相应请求messageList[index]（交换角色或加入新小组）在后台进行相应的更改,
           * 完成后把相应消息从后台的消息列表中删除
           * 交换角色时把后台对应的小组中的角色进行修改
           * 加入新小组时把新小组new_team的数据保存至后台
           * CODE...
           */
          axios({
            method:'post',
            url:axios.defaults.baseURL +'/message/accept',
            params:{
              messageId : this.messageList[index].id
            }
          }).then((res)=>{
            if(res.data.data){
              this.$message({
                type: 'success',
                message: '成功'
              });
            }else {
              this.$message({
                type: 'error',
                message: res.data.msg
              });
            }
          })
          this.messageList.splice(index, 1)
      },
      msgNo(index){
          /**
          * 直接把消息从后台的消息列表中删除
          */
          axios({
            method:'post',
            url:axios.defaults.baseURL +'/message/refuse',
            params:{
              messageId : this.messageList[index].id
            }
          }).then((res) => {
            if(res.data.data){
              this.$message({
                type: 'success',
                message: '拒绝成功'
              });
            }else {
              this.$message({
                type: 'error',
                message: res.data.msg
              });
            }
          })
          this.messageList.splice(index, 1)
      },
      op_choose(index){
          console.log(index);
          this.current_op=index;
          this.current_step=2;
      },
      tableRowClassName(rowIndex) {
        // console.lpg(rowIndex);
        if (rowIndex%2 == 0) {
          return 'warning-row';
        } else{
          return 'success-row';
        }
      },
      count_down_clock(){
          var minute=Math.floor(this.count_down/60);
          var second=this.count_down%60;
          if(minute<10)this.count_down_min="0"+minute;
          else this.count_down_min=minute;
          if(second<10)this.count_down_sec="0"+second;
          else this.count_down_sec=second;
      },
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
.top-line h1 {
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
.top-line .container .item1{
  display: inline-block;
  width:30%;
  height:100%;
  padding: 0;
  margin:0;
  text-align: center;
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
  display: inline-block;
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
.first{
    width:100%;
    height:900px;
    display: flex;
    margin: 0;
    padding: 0;
}
.first .left{
    background-color: rgb(183, 199, 201);
    width:35%;
    margin-top:0px;
}
.first .right{
    width:65%;
    background-color: rgb(242,242,242);
    margin-top:0px;
}
.first .left .title{
    text-align: center;
    font-size: 25px;
    margin-top:20px;
    font-weight: 800;
}
.first .left .el-table{
    margin-top: 20px;
}
.first .left .page{
    margin-top:200px;
    height:40px;
}
.left .el-button--primary{
    background-color: rgb(116, 149, 154);
    border-color:rgb(115,126,128);
}
.first .right .title{
    text-align: center;
    font-size: 25px;
    margin-top:20px;
    font-weight: 800;
    margin-left: 0px;
}
.first .right .msg-group{
    width:100%;
    height:50%;
    overflow-y: scroll;
}
.first .right .msg-group .msg{
    width:60%;
    text-align: center;
    padding: 1em;
    background-color: rgb(206, 215, 217);
    margin-left: 90px;
    border-radius: 20px;
    margin-top:20px;
    margin-bottom: 10px;
}
.first .right .msg-group .msg .content{
    margin-top: 8px;
    text-align:center;
    width:80%;
    word-wrap: break-word;
    word-break: break-all;
    margin-left:50px;
}
.first .right .msg-group1{
    width:100%;
    height:30%;
    overflow-y: scroll;
}
.first .right .msg-group1 .msg{
    width:60%;
    text-align: center;
    padding: 1em;
    background-color: rgb(206, 215, 217);
    margin-left: 90px;
    border-radius: 20px;
    margin-top:20px;
    margin-bottom: 10px;
}
.first .right .msg-group1 .msg1{
  width:80%;
  text-align: center;
  padding: 1em;
  margin-left: 105px;
  margin-top:20px;
  margin-bottom: 10px;
  color: #6d6d6d;
}
.first .right .msg-group .msg1{
  width:80%;
  text-align: center;
  padding: 1em;
  margin-left: 105px;
  margin-top:20px;
  margin-bottom: 10px;
  color: #6d6d6d;
}
.first .right .msg-group1 .msg .content{
    margin-top: 8px;
    text-align:center;
    width:80%;
    word-wrap: break-word;
    word-break: break-all;
    margin-left:50px;
}
.first .right .el-button--primary{
    margin-left:10px;
}
.first .el-button-group{
    margin-top: -25px;
    float: right;
    margin-right: -200px;
}
.first .right .el-button--primary{
    background-color: rgb(206, 215, 217);
    border-color:rgb(242,242,242);
    border-radius: 20px;
}
.second{
    width:100%;
    height:600px;
    display: flex;
    margin: 0;
    padding: 0;
}
.second .step1{
    width:40%;
    background-color: rgb(116, 149, 154);
    text-align: center;
    margin-left: 30%;
}
.second .step1 .op{
    background-color: rgb(183, 199, 201);
    width:40%;
    height:70%;
    float: left;
    margin-left: 6.5%;
    margin-top:6.5%;
    text-align: center;
}
.second .step1 .op:hover{
    cursor: pointer;
}
.second .step1 .op h2{
    color: rgb(242,242,242);
    margin-top: 35%;
}
.second .step2{
    width:60%;
    text-align: center;
    margin-left: 20%;
}
.second .step2 .op0{
    width:100%;
    background-color: rgb(205, 214, 216);
    text-align: center;
    margin-left: 0%;
}
.second .step2 .op0 h3{
    margin-top: 20px;
    padding-top: 5%;
    color:rgb(95,134,140);
    font-size: 25px;
}
.second .step2 .op0 .el-select {
    margin-top: 1%;
    width:40%;
    padding: 1em;
}
.second .step2 .op0 .el-button--primary{
    padding: 1em;
    float: left;
    margin-top: 20%;
    margin-left: 40%;
    background-color: rgb(117,149,154);
    border-color:rgb(242,242,242);
    width:180px;
}
.second .step2 .op0 .el-button--primary:hover{
    opacity: 0.7;
}
.second .step2 .op1{
    width:100%;
    background-color: rgb(205, 214, 216);
    text-align: center;
    margin-left: 0%;
}
.second .step2 .op1 h3{
    margin-top: 20px;
    padding-top: 5%;
    color:rgb(95,134,140);
    font-size: 25px;
}
.second .step2 .op1 .title1{
    float:left;
    margin-left: 15%;
    margin-top: 4%;
}
.second .step2 .op1 .el-input {
    padding-right: 30px;
    margin-left: 50px;
    width: 60%;
    margin-top: 3%;
}
.second .step2 .op1 .el-radio-group {
    padding-right: 30px;
    margin-left: -15%;
    width: 60%;
    margin-top: 5%;
}
.second .step2 .op1 .teammate .title2{
    float: left;
    margin-left: 15%;
    margin-top: 4%;
}
.second .step2 .op1 .el-button--primary{
    padding: 1em;
    float: left;
    margin-top: 5%;
    margin-left: 40%;
    background-color: rgb(117,149,154);
    border-color:rgb(242,242,242);
    width:180px;
}
.second .step2 .op1 .el-button--primary:hover{
    opacity: 0.7;
}
.second .step3{
    width:100%;
    height:480px;
    display: flex;
    margin: 0;
    padding: 0;
}
.second .step3 .left{
    background-color: rgb(183, 199, 201);
    width:25%;
    height:100%;
    margin-top:-63px;
}
.second .step3 .left .title{
    text-align: center;
    font-size: 25px;
    margin-top:20px;
    font-weight: 800;
}
.second .step3 .left .el-table{
    margin-top: 20px;
}
.warning-row {
    background-color: rgb(214, 162, 64);
}

.success-row {
    background-color: #f0f9eb;
}
.second .step3 .right{
    width:80%;
    background-color: rgb(242,242,242);
    margin-top:-63px;
}
.second .step3 .right .top_line{
    margin-top:2%;
}
.second .step3 .right .top_line .el-button--primary{
    background-color: rgb(117,149,154);
    border-color:rgb(242,242,242);
    margin-left: -80%;
    margin-top:2%;
}
.second .step3 .right .title{
    font-weight: 600;
    font-size: 22px;
    margin-top:-3.5%;
    margin-left: -10%;
    color:rgb(116, 149, 154);
}
.second .step3 .right .clock{
    float: right;
    margin-right: 20%;
    margin-top: -2%;
}
.el-icon-time:before {
    content: "\E71F";
    margin-right: 10px;
}
.second .step3 .right .description{
    width:95%;
    height:70%;
    margin-top: 1%;
    margin-left: 1%;
    padding: 1em;
    background-color: rgb(206, 215, 217);
}
.second .step3 .right .description .item .el-form-item__label{
    font-size: 12px;
}
.second .step3 .right .description .bottom{
    width:100%;
    margin-top: 3%;
    padding: 0;
    height:10%;
}
.second .step3 .right .description .bottom h3{
    float:left;
    margin-top:1%;
    margin-left: 2%;
}
.second .step3 .right .description .bottom .forbidden_words{
    width:10%;
    float: left;
    margin-top: 1.5%;
}
.second .step3 .right .el-button--primary{
    background-color: rgb(117,149,154);
    border-color:rgb(242,242,242);
    margin-left: 0%;
    margin-top:1%;
}
.second .step3 .right .caption{
    width:75%;
    height:70%;
    margin-top: 1%;
    margin-left: 12%;
    padding: 1em;
    background-color: rgb(206, 215, 217);
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
}
.third .team_detail h2{
    margin-top: -3%;
}
.third .team_detail .el-table{
    margin-left: 10%;
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
