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
        <div class="second" v-if="selected_index==1">
            <div class="step1" v-proportion="0.5" v-if="current_step==1">
                <div class="op" v-for="(item, index) in op_content" :key="index" @click="op_choose(index)">
                    <h2>{{item.name}}</h2>
                </div>
            </div>
            <div class="step2" v-if="current_step==2">
                <el-button type="primary" @click="step2_back">返回上一步</el-button>
                <div class="op0" v-if="current_op==0" v-proportion="0.5">
                    <h3>开始游戏</h3>
                    <div style="float: left;margin-left: 20%;margin-top: 3.5%;font-weight:600;">选择团队</div>
                    <el-select v-model="current_team" clearable placeholder="请选择">
                        <el-option
                        v-for="item in team_op"
                        :key="item.value"
                        :value="item.label"
                        :label="item.label">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click="step2_op0">开始</el-button>
                </div>
                <!-- 选择“创建团队”时 -->
                <div class="op1" v-if="current_op==1" v-proportion="0.5">
                    <h3>创建团队</h3>
                    <div class="title1">团队名称</div>
                    <el-input placeholder="请输入内容" v-model="newTeam" clearable type="text" maxlength="10"></el-input>
                    <div class="title1">你的角色</div>
                    <el-radio-group fill="#409EF0" v-model="myNewCharacter">
                    <el-radio  label="1" >描述者</el-radio>
                    <el-radio  label="2">猜测者</el-radio>
                    </el-radio-group>
                    <div class="teammate">
                    <div class="title2">邀请队友</div>
                    <el-input placeholder="请输入内容" v-model="newTeammate" clearable type="text" maxlength="20"></el-input>
                    </div>
                    <el-button type="primary" @click="step2_op1">创建</el-button>
                </div>
            </div>
            <div class="step3" v-if="current_step==3" style="height:500px;">
                <div class="left">
                  <div class="title">{{current_team}}的统计数据</div>
                  <el-table
                  :data="team_data"
                  height="145"
                  border
                  :show-header="false"
                  style="width: 100%"
                  >
                      <el-table-column
                      prop="title"
                      label="">
                      </el-table-column>
                      <el-table-column
                      prop="value"
                      label=""
                      width="200"
                      align="right">
                      </el-table-column>
                  </el-table>
                  </div>
                <div class="right">
                    <div class="top_line">
                    <el-button type="primary1" @click="step3_change()" v-if="this.my_character==='1'">换一题</el-button>
                    <el-button type="primary" @click="step3_quit">退出</el-button>
                    <div class="title" v-if="my_character=='1'">根据视频内容进行描述</div>
                    <div class="title" v-if="my_character=='2'">根据描述猜测视频标题</div>
                    <div class="clock">
                        <i class="el-icon-time">{{count_down_min}}:{{count_down_sec}}</i>
                    </div>
                    </div>
                    <div class="description" v-if="my_character=='1'">
                        <video :src="videoSrc" width="500" controls style="margin-left: -2%;">
                         Your browser does not support the video tag.
                        </video>
                    <el-form :model="gameDescription" :rules="gameRules" ref="gameDescription" label-width="100px" class="demo-ruleForm" style="width: 50%;float: right;"  >
                        <el-form-item label="视频主体" prop="character" class="item">
                        <el-input v-model="gameDescription.character"></el-input>
                        </el-form-item>
                        <el-form-item label="主体的行为" prop="behavior" class="item">
                        <el-input v-model="gameDescription.behavior"></el-input>
                        </el-form-item>
                        <el-form-item label="为什么做" prop="intention" class="item">
                        <el-input v-model="gameDescription.intention"></el-input>
                        </el-form-item>
                        <el-form-item label="可能的后续" prop="result" class="item">
                        <el-input v-model="gameDescription.result"></el-input>
                        </el-form-item>
                        <el-form-item label="主体的属性" prop="attribute" class="item">
                        <el-input v-model="gameDescription.attribute"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="bottom">
                        <h3>禁用词:</h3>
                        <div class="forbidden_words" v-for="(item, index) in forbidden_words" :key="index">
                            {{item}}
                    </div>
                    </div>
                    </div>
                    <div class="caption" v-if="my_character=='2'">
                        <el-form :model="gameDescription" :rules="captionRules" ref="gameDescription" label-width="100px" class="demo-ruleForm" style="width: 80%;margin-left:8%;"  >
                        <el-form-item label="视频主体" prop="character" class="item">
                        <el-input v-model="gameDescription.character" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="主体的行为" prop="behavior" class="item">
                        <el-input v-model="gameDescription.behavior" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="为什么做" prop="intention" class="item">
                        <el-input v-model="gameDescription.intention" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="可能的后续" prop="result" class="item">
                        <el-input v-model="gameDescription.result" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="主体的属性" prop="attribute" class="item">
                        <el-input v-model="gameDescription.attribute" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="可能的标题" prop="caption" class="item">
                        <el-input v-model="gameDescription.caption"></el-input>
                        </el-form-item>
                    </el-form>
                    </div>
                    <el-button type="primary" @click="submit('gameDescription')">提交</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//import { jsonp } from 'vue-jsonp'
const axios = require('axios').default;
axios.defaults.withCredentials = true;

export default {
    name: 'startGame',
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
              var tmp = {value:"",label:""}
              tmp.value="选项"+(i+1);
              tmp.label=res.data.data[i].first.name;
              this.team_op.push(tmp);
              console.log(this.team_op)
            }
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
            selected_index:1,
            current_step:1,
            /**选择开始游戏或者创建团队 */
            current_op:-1,
            /**选择的内容 */
            op_content:[
                {"op":0,"name":"开始游戏"},
                {"op":1,"name":"创建团队"},
            ],
            /**开始游戏的话，进行团队的选择 */
            team_op:[
            ],
            /**开始游戏时，当前的团队名 */
            current_team: "",
            my_character: '',
            teammate:'',
            /**新创建的队伍的信息 */
            newTeam:"",
            myNewCharacter:"1",
            newTeammate:"",
            /**新队伍信息汇总 */
            new_team:{
                "groupName":"",
                "role":"",
                "inviteePhone":"",
                "myPhone":""
            },
            /**队伍数据 */
            team_data:[
                {"title":"当前分数","value":0},
                {"title":"答题数量","value":0},
                {"title":"平均分数","value":0}
            ],
            /**开始游戏后倒计时秒数*/
            count_down:330,
            count_down_min:null,
            count_down_sec:null,
            /**视频地址 */
            videoSrc:"",
            /**描述者的描述内容 */
            gameDescription:{
                groupName:"",
                gameId:"",
                character:"",
                behavior:"",
                intention:"",
                result:"",
                attribute:"",
                caption:"",
                videoNumber:""
            },
            gameRules:{
                character:[
                    {required:true,message:"请输入视频主体",trigger: 'blur'},
                    {pattern: /^[0-9\u3400-\u4db5，。！？]+$/, message: '仅可以使用中文', trigger: 'blur' }
                ],
                behavior:[
                    {required:true,message:"请输入行为",trigger: 'blur'},
                  {pattern: /^[0-9\u4e00-\u9fa5，。？！]+$/, message: '仅可以使用中文', trigger: 'blur' }
                ],
                intention:[
                    {required:true,message:"请输入意图",trigger: 'blur'},
                  {pattern: /^[0-9\u4e00-\u9fa5，。？！]+$/, message: '仅可以使用中文', trigger: 'blur' }
                ],
                result:[
                    {required:true,message:"请输入影响",trigger: 'blur'},
                  {pattern: /^[0-9\u4e00-\u9fa5，。？！]+$/, message: '仅可以使用中文', trigger: 'blur' }
                ],
                attribute:[
                    {required:true,message:"请输入属性",trigger: 'blur'},
                  {pattern: /^[0-9\u4e00-\u9fa5，。？！]+$/, message: '仅可以使用中文', trigger: 'blur' }
                ],
            },
            captionRules:{
                caption:[
                    {required:true,message:"请输入标题",trigger: 'blur'},
                    {pattern: /^[0-9\u4e00-\u9fa5，。？！]+$/, message: '仅可以使用中文', trigger: 'blur' }
                ],
            },
            /**禁用词 */
            forbidden_words:[],
            captions:'',
            forbidden_words_original:'',
            times:''
        }
    },
    methods:{
        logout(){
          this.$router.push({path:'/login'});
        },
        handleClick(index) {
          console.log(index);
          if(index==0){
              this.$router.push({path:'/main',query:{"msg":this.loginMsg}});
          }
          else if(index==2){
              this.$router.push({path:'/personInfo',query:{"msg":this.loginMsg}});
          }
        },
        op_choose(index){
            console.log(index);
            this.current_op=index;
            this.current_step=2;
        },
        step2_op0(){
          /**
           * 根据此时参加游戏的小组信息为用户的角色赋值
           * CODE...this.my_character=""
           * */

          /**
           * 如果是描述者，从后台传入相应的视频，禁用词等
           * 如果是猜标题者，传入该游戏对应的描述
           * CODE...
           * this.videoSrc="";//传入需要观看的视频的地址
           */
          axios({
            method:'get',
            url:axios.defaults.baseURL+'/group/find',
            params:{
              groupName: this.current_team
            }
          }).then((res)=>{
            if(res.data.data!=null){
              this.team_data[0].value = res.data.data.score;
              this.team_data[1].value = res.data.data.total;
              this.team_data[2].value = res.data.data.average;
              //开始游戏
              axios({
                method:'post',
                url: axios.defaults.baseURL +'/game/start',
                params:{
                  groupName: this.current_team
                }
              }).then((res)=>{
                if(res.data.data!=null){
                  if(res.data.data.second===1){
                    console.log(res.data.data)
                    console.log('成员1')
                    this.my_character='1';
                    this.gameDescription.gameId = res.data.data.first.id;
                    this.gameDescription.videoNumber = res.data.data.first.videoNumber
                    axios({
                      method:'get',
                      url: axios.defaults.baseURL+'/video/one',
                      params:{
                        number:res.data.data.first.videoNumber
                      }
                    }).then((res)=>{
                      this.videoSrc = 'http://localhost:8081/videoResource/video'+res.data.data.number+'.mp4';
                      this.forbidden_words_original = res.data.data.frequentWords;
                      this.forbidden_words = res.data.data.frequentWords.split('##');
                    });
                  }else if(res.data.data.second===2){
                    console.log('成员2')
                    this.my_character='2';
                    this.gameDescription.gameId = res.data.data.first.id;
                    this.gameDescription.videoNumber = res.data.data.first.videoNumber
                    this.gameDescription.character = res.data.data.first.character;
                    this.gameDescription.behavior = res.data.data.first.behavior;
                    this.gameDescription.intention = res.data.data.first.intention;
                    this.gameDescription.result = res.data.data.first.result;
                    this.gameDescription.attribute = res.data.data.first.attribute;
                  }else {
                    console.log('wrong role')
                  }
                  this.current_step=3;
                  this.verification();//倒计时设置
                }else {
                  this.$message({
                    type: 'error',
                    message: res.data.msg
                  });
                }
              })
            }else {
              this.$message({
                type: 'error',
                message: res.data.msg
              });
            }
          });
        },
        step2_op1(){
            /**将新队伍的信息new_team传至后台,保存到被邀请人的消息队列，成功后，设置当前step=1，回到上一个页面，
             * 此时点击“开始游戏”后，可选择的队伍中多了刚刚新创建的队伍 */
            /**后台保存至被邀请人的消息队列
             * CODE...
             */
            axios({
              method:'post',
              url: axios.defaults.baseURL+'/group/create',
              params:{
                groupName: this.newTeam,
                role: this.myNewCharacter,
                inviteePhone:this.newTeammate
              }
            }).then((res)=>{
              if(res.data.data){
                this.$message({
                  type: 'success',
                  message: '已向对方发送邀请'
                });
                this.current_step=1;
              }else {
                this.$message({
                  type: 'error',
                  message: res.data.msg
                });
              }
            })
        },
        step2_back(){
          this.current_step = 1;
        },
        tableRowClassName(rowIndex) {
          // console.lpg(rowIndex);
          if (rowIndex%2 == 0) {
            return 'warning-row';
          } else{
            return 'success-row';
          }
        },
        step3_quit(){
            /**开始游戏时点击“退出”后触发的函数 */
            /**删除目前正在做的游戏，并从相应组的未完成列表中删除*/
            if(this.my_character==='1'){
              //若为角色1
              axios({
                method:'post',
                url:axios.defaults.baseURL +'/game/deleteGame',
                params:{
                  gameId : this.gameDescription.gameId
                }
              }).then((res)=>{
                console.log(res);
                this.current_step=1;
              })
            }else if(this.my_character==='2'){
              //若为角色2
              this.current_step=1;
            }else {
              console.log('wrong role')
            }
            clearInterval(this.times)
            this.count_down = 330
        },
        step3_change(){
          axios({
            method:'post',
            url: axios.defaults.baseURL+'/game/next',
            params:{
              groupName:this.current_team,
              Id:this.gameDescription.gameId,
            }
          }).then((res)=>{
            if(res.data.data!=null){
              this.gameDescription.gameId = res.data.data.id;
              this.gameDescription.videoNumber = res.data.data.videoNumber;
              axios({
                method:'get',
                url: axios.defaults.baseURL+'/video/one',
                params:{
                  number: this.gameDescription.videoNumber
                }
              }).then((res)=>{
                this.videoSrc = 'http://localhost:8081/videoResource/video'+res.data.data.number+'.mp4';
                this.forbidden_words = res.data.data.frequentWords.split('##');
              });
            }else {
              this.$message({
                type: 'error',
                message: res.data.msg
              });
            }
            clearInterval(this.times)
            this.count_down = 330
            this.verification()
          })
        },
        async submit(formName){
            this.$message({
              type: 'success',
              message: "正在提交，请勿刷新界面和退出"
            });
           await new Promise((resolve) => {
             setTimeout(()=>{
               /**
                * 判断此时提交的是描述者还是猜标题者
                */
               if(this.my_character==='1')//描述者
               {
                 /**
                  * 将数据提交至后台
                  * 发送消息给对应的猜标题者，提醒有未完成的游戏
                  */
                 this.$refs[formName].validate((valid) => {
                   if (valid) {
                     /**将数据传至后台
                      * code...
                      */
                     axios({
                       method:"get",
                       url : 'http://127.0.0.1:9999/tok',
                       params:{
                         character: this.gameDescription.character,
                         behavior: this.gameDescription.behavior,
                         intention: this.gameDescription.intention ,
                         result: this.gameDescription.result,
                         attribute: this.gameDescription.attribute,
                         forbidden_words_original: this.forbidden_words_original
                       }
                     }).then((res)=>{
                       var judge = [res.data.character,res.data.behavior,res.data.intention,res.data.result,res.data.attribute]
                       if(judge[0]===0&&judge[1]===0&&judge[2]===0&&judge[3]===0&&judge[4]===0){
                         axios({
                           method:'post',
                           url:axios.defaults.baseURL+'/game/member1Submit',
                           params:{
                             groupName: this.current_team,
                             gameId: this.gameDescription.gameId,
                             character: this.gameDescription.character,
                             behavior: this.gameDescription.behavior,
                             intention: this.gameDescription.intention ,
                             result: this.gameDescription.result,
                             attribute: this.gameDescription.attribute
                           }
                         }).then((res)=>{
                           if(res.data.data){
                             console.log("角色1提交")
                             this.$message({
                               type: 'success',
                               message: '提交成功'
                             });
                             this.current_step=1;
                           }else {
                             this.$message({
                               type: 'error',
                               message: res.data.msg
                             });
                           }
                         });
                       }else {
                         if(judge[0]!==0)
                           this.gameDescription.character = ''
                         if(judge[1]!==0)
                           this.gameDescription.behavior = ''
                         if(judge[2]!==0)
                           this.gameDescription.intention = ''
                         if(judge[3]!==0)
                           this.gameDescription.result = ''
                         if(judge[4]!==0)
                           this.gameDescription.attribute = ''
                         alert("输入包含禁用词，请重新输入")
                       }
                     })
                   }else{
                     this.$message({
                       type: 'error',
                       message: '填写信息错误'
                     });
                   }
                 });
               }
               else if(this.my_character==='2'){
                 this.$refs[formName].validate((valid) => {
                   if(valid){
                     /**
                      * 将游戏数据发送至后台保存
                      * 并在该组的成绩中进行相应添加
                      * CODE...
                      */

                     // 查询视频对应的20个caption
                     axios({
                       method: "get",
                       url:axios.defaults.baseURL+'/video/one',
                       params:{
                         number: this.gameDescription.videoNumber
                       }
                     }).then((res)=>{
                       if(res.data.data!=null){
                         this.captions = res.data.data.captions;
                         //  通过后台python服务获得分数和相似caption
                         axios({
                           method:"get",
                           url: 'http://127.0.0.1:9999/sim',
                           params:{
                             sentence:this.gameDescription.caption,
                             sentences : this.captions
                           }
                         }).then((res)=>{
                           console.log(res)
                           // 成员2提交
                           axios({
                             method:'post',
                             url:axios.defaults.baseURL+'/game/member2Submit',
                             params:{
                               groupName: this.current_team,
                               gameId: this.gameDescription.gameId,
                               caption: this.gameDescription.caption,
                               score : res.data.score,
                               simCaption: res.data.simCaption
                             }
                           }).then((res)=>{
                             if(res.data.data!=null){
                               this.$message({
                                 type: 'success',
                                 message: "答题成功，您的得分为"+res.data.data
                               });
                               console.log("答题成功，您的得分为"+res.data.data)
                             }else {
                               this.$message({
                                 type: 'error',
                                 message: res.data.msg
                               });
                             }
                           });
                           this.current_step=2;
                         })
                       }else {
                         this.$message({
                           type: 'error',
                           message: res.data.msg
                         });
                       }
                     })

                   }else{
                     this.$message({
                       type: 'error',
                       message: '填写信息错误'
                     });
                   }
                 });
               }else {
                 console.log('wrong role')
               }
               clearInterval(this.times)
               this.count_down = 330
               resolve()
             },3000)
           })
        },
        verification(){
          this.times = setInterval(()=>{
            this.count_down--
            var minute=Math.floor(this.count_down/60);
            var second=this.count_down%60;
            if(minute<10)this.count_down_min="0"+minute;
            else this.count_down_min=minute;
            if(second<10)this.count_down_sec="0"+second;
            else this.count_down_sec=second;
            if(this.count_down===0){
              this.step3_quit()
              alert("时间到！答题失败")
            }
          },1000)
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
.left .el-button--primary{
    background-color: rgb(116, 149, 154);
    border-color:rgb(115,126,128);
}

.second{
    width:100%;
    height:500px;
    margin-top: 100px;
    display: flex;
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
.second .step2 .el-button--primary{
  padding: 1em;
  float: left;
  margin-top: -4%;
  margin-left: 0%;
  background-color: rgb(117,149,154);
  border-color:rgb(242,242,242);
  width:180px;
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
    height:800px;
    display: flex;
    margin: 0;
    padding: 0;
}
.second .step3 .left{
    background-color: rgb(183, 199, 201);
    width:20%;
    height:800px;
    margin-top:-100px;
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
    margin-top:-100px;
}
.second .step3 .right .top_line{
    margin-top:0%;
}
.second .step3 .right .top_line .el-button--primary{
    background-color: rgb(117,149,154);
    border-color:rgb(242,242,242);
    margin-right: -80%;
    margin-top:1%;
}
.second .step3 .right .top_line .el-button--primary1{
  background-color: rgb(117,149,154);
  border-color:rgb(242,242,242);
  margin-left: -1%;
  margin-top:1%;
}
.second .step3 .right .title{
    width: 30%;
    font-weight: 600;
    font-size: 22px;
    margin-top:-3%;
    margin-left: 10%;
    color:rgb(116, 149, 154);
}
.second .step3 .right .clock{
    float: right;
    margin-right: 20%;
    margin-top: -1.2%;
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


</style>
