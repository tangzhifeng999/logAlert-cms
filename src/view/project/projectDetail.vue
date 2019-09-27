<template>
  <div class="project-detail">
    <div class="detail-part">
      <div class="part-title">
        <div>基本信息</div>
        <Button class="addBtn" style="margin:0" @click="change" v-if="disabled">修改</Button>
        <div v-if="!disabled">
          <Button style="font-size:14px;" @click="cancel">取消</Button>
          <Button class="addBtn" style="margin:0 0 0 10px " @click="nameConfirm">确定</Button>
        </div>
      </div>
      <div class="part-content" v-if="disabled">
        <div class="part-text">项目名称:{{name}}</div>
        <div class="part-text">项目代号:{{app}}</div>
      </div>
      <div class="part-content" v-if="!disabled">
        <div class="part-input">
          项目名称:
          <div>
            <Input v-model="name" />
          </div>
        </div>
        <div class="part-input">
          项目代号:
          <div>
            <Input v-model="app" />
          </div>
        </div>
      </div>
    </div>
    <div class="detail-part">
      <div class="part-title">
        <div>轮询任务</div>
        <Button class="addBtn" style="margin:0" @click="addTask(-1)">新建轮询任务</Button>
      </div>
      <div class="part-content">
        <div class="table">
          <Table ref="currentRowTable" :columns="columns1" :data="taskList1" no-data-text="暂无数据">
            <template slot="timeCell" slot-scope="{row}">
              <div class="tableActions">{{row.timeCell}}分钟/周期</div>
            </template>
            <template slot="times" slot-scope="{row}">
              <div class="tableActions">查询结果大于{{row.times}}次</div>
            </template>
            <template slot="way" slot-scope="{row}">
              <div class="tableActions">{{row.way.join(',')}}</div>
            </template>
            <template slot="person" slot-scope="{row}">
              <div class="tableActions">{{row.person.join(',')}}</div>
            </template>
            <template slot="status" slot-scope="{row}">
              <div class="tableActions">{{row.status==1?'执行中':'未执行'}}</div>
            </template>
            <template slot="action" slot-scope="{row,index}">
              <div class="red" v-if="row.status==1" @click="modifyTaskConfirm(row,index,1)">结束</div>
              <div class="tableActions" v-else>
                <div class="blue" @click="addTask(index)">编辑</div>
                <div style="margin-left:5px;margin-right:5px;color:#3399ff">|</div>
                <div class="blue" @click="modifyTaskConfirm(row, index,1)">开始</div>
                <div style="margin-left:5px;margin-right:5px;color:#3399ff">|</div>
                <div class="red" @click="deleteTaskConfirm(index,1)">删除</div>
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <div class="detail-part">
      <div class="part-title">
        <div>统计任务</div>
        <Button class="addBtn" style="margin:0" @click="addCountTask(-1)">新建统计任务</Button>
      </div>
      <div class="part-content">
        <div class="table">
          <Table ref="currentRowTable" :columns="columns2" :data="taskList2" no-data-text="暂无数据">
            <template slot="interval" slot-scope="{row}">
              <div class="tableActions">
                <span v-if="row.interval==1">日报</span>
                <span v-if="row.interval==7">周报</span>
                <span v-if="row.interval==30">月报</span>
              </div>
            </template>
            <template slot="crontab" slot-scope="{row}">
              <div class="tableActions">{{row.crontab}}</div>
            </template>
            <template slot="params" slot-scope="{row}">
              <div class="tableActions">{{row.params.join(';')}}</div>
            </template>
            <template slot="person" slot-scope="{row}">
              <div class="tableActions">{{row.person.join(',')}}</div>
            </template>
            <template slot="status" slot-scope="{row}">
              <div class="tableActions">{{row.status==1?'执行中':'未执行'}}</div>
            </template>
            <template slot="action" slot-scope="{row,index}">
              <div class="red" v-if="row.status==1" @click="modifyTaskConfirm(row,index,2)">结束</div>
              <div class="tableActions" v-else>
                <div class="blue" @click="addCountTask(index)">编辑</div>
                <div style="margin-left:5px;margin-right:5px;color:#3399ff">|</div>
                <div class="blue" @click="modifyTaskConfirm(row,index,2)">开始</div>
                <div style="margin-left:5px;margin-right:5px;color:#3399ff">|</div>
                <div class="red" @click="deleteTaskConfirm(index,2)">删除</div>
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <!-- <div class="detail-part">
      <div class="part-title">
        <div>自定义查询任务</div>
        <Button class="addBtn" style="margin:0" @click="addOnceCountTask(-1)">新建自定义任务</Button>
      </div>
      <div class="part-content">
        <div class="table">
          <Table ref="currentRowTable" :columns="columns3" :data="taskList3" no-data-text="暂无数据">
            <template slot="timeCell" slot-scope="{row}">
              <div class="tableActions">{{row.timeCell}}分钟/周期</div>
            </template>
            <template slot="times" slot-scope="{row}">
              <div class="tableActions">查询结果大于{{row.times}}次</div>
            </template>
            <template slot="way" slot-scope="{row}">
              <div class="tableActions">{{row.way.join(',')}}</div>
            </template>
            <template slot="person" slot-scope="{row}">
              <div class="tableActions">{{row.person.join(',')}}</div>
            </template>
            <template slot="status" slot-scope="{row}">
              <div class="tableActions">{{row.status==1?'执行中':'未执行'}}</div>
            </template>
            <template slot="action" slot-scope="{row,index}">
              <div class="red" v-if="row.status==1" @click="modifyTaskStatus(row,index,3)">结束</div>
              <div class="tableActions" v-else>
                <div class="blue" @click="addOnceCountTask(index)">编辑</div>
                <div style="margin-left:5px;margin-right:5px;color:#3399ff">|</div>
                <div class="blue" @click="modifyTaskStatus(row,index,3)">开始</div>
                <div style="margin-left:5px;margin-right:5px;color:#3399ff">|</div>
                <div class="red" @click="deleteTask(index)">删除</div>
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div> -->
    <div>
      <Modal v-model="taskModal" :title="taskModalTitle" class="addTask" :width="640" @on-visible-change="close1">
        <div>
          <div class="modalContent">
            <div style="width:110px;display:flex">
              <img class="redStar" src="@/assets/images/required.png" alt />
              <div>任务执行规则:</div>
            </div>
            <div style="margin-left:10px">每</div>
            <div class="modalInput">
              <Input placeholder="请输入" v-model="newTask.timeCell" />
            </div>
            <div>分/周期</div>
          </div>
          <div class="modalContent">
            <div style="width:110px;display:flex">
              <img class="redStar" src="@/assets/images/required.png" alt />
              <div>触发告警条件:</div>
            </div>
            <div style="margin-left:10px">查询结果大于</div>
            <div class="modalInput">
              <Input placeholder="请输入" v-model="newTask.times" />
            </div>
            <div>次</div>
          </div>
          <div class="modalContent">
            <div style="width:110px;display:flex">
              <img class="redStar" src="@/assets/images/required.png" alt />
              <div>查询的参数设置:</div>
            </div>
            <div class="modalInput" style="width:300px">
              <Input placeholder="fields.type:nginx-access,http_status:200" v-model="newTask.params" type="textarea" />
            </div>
            <div style="margin-left: 120px">e.g.:&nbsp;&nbsp;fields.type:nginx-access,http_status:200</div>
          </div>
          <div class="modalContent">
            <div style="width:110px;display:flex">
              <img class="redStar" src="@/assets/images/required.png" alt />
              <div>通知方式:</div>
            </div>
            <Select v-model="newTask.way" multiple style="width:200px" class="modalInput">
              <Option v-for="item in methodList" :value="item.name" :key="item.inde">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="modalContent modalContentUser">
            <div style="width:110px;display:flex">
              <img class="redStar" src="@/assets/images/required.png" alt />
              <div>接受人:</div>
            </div>
            <div class="modalUser">
              <div v-for="(item,index) in userList" :key="index" class=" modalUserPart">
                <Select v-model="item.name" @on-change="taskChange" style="width:200px" class="modalInput">
                  <Option
                    v-for="ele in userNameList"
                    :value="ele.name"
                    :key="ele.index"
                    :disabled="ele.disabled"
                  >{{ ele.name }}</Option>
                </Select>
                <Icon
                  type="ios-add-circle-outline"
                  class="addTaskIcon"
                  @click="addUser(index)"
                  v-if="userList.length -1 == index && item.name"
                />
                <Icon
                  type="ios-remove-circle-outline"
                  class="addTaskIcon"
                  v-if="userList.length>1"
                  @click="deleteUser(index)"
                />
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <Button style="font-size:14px;" @click="close1(false)">取消</Button>
          <Button class="addBtn" style="margin:0 0 0 10px " @click="confirm">确定</Button>
        </div>
      </Modal>
    </div>
    <div>
      <Modal v-model="countTaskModal" :title="taskModalTitle" class="addCountTask" :width="640" @on-visible-change="close2">
        <div>
          <div class="modalContent">
            <div style="width:80px;display:flex">
              <img class="redStar" src="@/assets/images/required.png" alt />
              <div>统计周期:</div>
            </div>
            <div class="modalInput">
              <Input placeholder="执行周期" v-model="newCountTask.interval" />
            </div>
            <div>说明:( 日报：1, 周报：7, 月报：30 )</div>
          </div>
          <div class="modalContent">
            <div style="width:80px;display:flex">
              <img class="redStar" src="@/assets/images/required.png" alt />
              <div>启动规则:</div>
            </div>
            <div class="modalInput">
              <Input placeholder="crontab规则" v-model="newCountTask.crontab" />
            </div>
            <!-- <div>e.g.:&nbsp;&nbsp;*&nbsp;*&nbsp;*&nbsp;*&nbsp;*(说明:minute, hour, day of month, mouth, day of week)</div> -->
          </div>
          <div class="modalContent" style="align-items: flex-start">
            <div style="width:80px;display:flex">
              <img class="redStar" src="@/assets/images/required.png" alt />
              <div>查询参数:</div>
            </div>
            <div>
              <div class="modalInput" style="display: flex;align-items: center;margin-bottom:5px" v-for="(item,index) in newCountTask.params" :key="index" >
                <Input placeholder="请输入" :value="item"
                  v-model="newCountTask.params[index]" style="margin-right: 10px;width: 230px" type="text" />
                <!-- <div v-for="(item,index) in taskList2.params" :key="index" class="modalUserPart"></div> -->
                <Icon type="ios-add-circle-outline" class="addTaskIcon" @click="addParams(index)"
                  v-if="newCountTask.params.length -1 == index && item" />
                <Icon type="ios-remove-circle-outline" class="addTaskIcon" v-if="newCountTask.params.length>1"
                  @click="deleteParams(index)" />
              </div>
            </div>
            <!-- <Icon
                  type="ios-add-circle-outline"
                  class="addTaskIcon"
                  @click="addParams(index)"
                  v-if="userNameList.length>1"
                />
                <Icon
                  type="ios-remove-circle-outline"
                  class="addTaskIcon"
                  v-if="paramsList.length>1"
                  @click="deleteParams(index)"
                /> -->
            <div style="margin-left: 90px">e.g.:&nbsp;&nbsp;fields.type:nginx-access,http_status:200</div>
          </div>
          <div class="modalContent modalContentUser">
            <div style="width:80px;display:flex">
              <img class="redStar" src="@/assets/images/required.png" alt />
              <div>接受人:</div>
            </div>
            <div class="modalUser">
              <div v-for="(item,index) in userList" :key="index" class=" modalUserPart">
                <Select v-model="item.name" @on-change="taskChange" style="width:200px" class="modalInput">
                  <Option
                    v-for="ele in userNameList"
                    :value="ele.name"
                    :key="ele.index"
                    :disabled="ele.disabled"
                  >{{ ele.name }}</Option>
                </Select>
                <Icon
                  type="ios-add-circle-outline"
                  class="addTaskIcon"
                  @click="addUser(index)"
                  v-if="userList.length-1 == index && item.name"
                />
                <Icon
                  type="ios-remove-circle-outline"
                  class="addTaskIcon"
                  v-if="userList.length>1 "
                  @click="deleteUser(index)"
                />
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <Button style="font-size:14px;" @click="close2(false)">取消</Button>
          <Button class="addBtn" style="margin:0 0 0 10px " @click="confirm1">确定</Button>
        </div>
      </Modal>
    </div>
    <!-- <div>
      <Modal v-model="onceCountTaskModal" :title="taskModalTitle" class="addCountTask" :width="640">
        <div>
          <div class="modalContent">
            <div style="width:110px;display:flex">
              <img class="redStar" src="@/assets/images/required.png" alt />
              <div>启动规则:</div>
            </div>
            <div style="margin-left:10px"></div>
              <Input placeholder="请按照crontab规格输入，参数之间空格分割" v-model="newTask.crontab" />
          </div>
          <div class="modalContent">
            <div style="width:110px;display:flex">
              <img class="redStar" src="@/assets/images/required.png" alt />
              <div>查询的参数设置:</div>
            </div>
            <div class="modalInput" style="width:235px">
              <Input placeholder="请输入" v-model="newTask.params" type="textarea" />
            </div>
            <div>e.g.:fields.type:nginx-access,http_status:200</div>
          </div>
          <div class="modalContent modalContentUser">
            <div style="width:110px;display:flex">
              <img class="redStar" src="@/assets/images/required.png" alt />
              <div>接受人:</div>
            </div>
            <div class="modalUser">
              <div v-for="(item,index) in userList" :key="index" class=" modalUserPart">
                <Select v-model="item.name" @on-change="taskChange" style="width:200px" class="modalInput">
                  <Option
                    v-for="ele in userNameList"
                    :value="ele.name"
                    :key="ele.index"
                    :disabled="ele.disabled"
                  >{{ ele.name }}</Option>
                </Select>
                <Icon
                  type="ios-add-circle-outline"
                  class="addCountTaskIcon"
                  @click="addUser(index)"
                  v-if="userNameList.length>1"
                />
                <Icon
                  type="ios-remove-circle-outline"
                  class="addCountTaskIcon"
                  v-if="userList.length>1"
                  @click="deleteUser(index)"
                />
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <Button style="font-size:14px;" @click="close3">取消</Button>
          <Button class="addBtn" style="margin:0 0 0 10px " @click="confirm">确定</Button>
        </div>
      </Modal>
    </div> -->
  </div>
</template>

<script>
import { projectApi, accountApi } from "@/api";
export default {
  data() {
    return {
      name: "",
      total: 100,
      newTask: {
        timeCell: "",
        times: "",
        params: "",
        way: [],
        person: []
      },
      newCountTask: {
        crontab: "",
        params: [
          ''
        ],
        person: []
      },
      methodList: [
        {
          name: "email",
          index: 0
        },
        {
          name: "sms",
          index: 1
        }
      ],
      userNameList: [],
      userList: [
        {
          name: ""
        }
      ],
      paramsList:[
        {
          params:""
        }
      ],
      taskModal: false,
      taskModalTitle:'新建任务',
      countTaskModal: false,
      countTaskModalTitle:'新建任务',
      onceCountTaskModal: false,
      onceCountTaskModalTitle:'新建任务',
      columns1: [
        {
          type: "index",
          width: 100,
          align: "center",
          title: "序号"
        },
        {
          title: "任务执行规则",
          key: "timeCell",
          align: "center",
          slot: "timeCell"
        },
        {
          title: "触发告警条件",
          key: "times",
          align: "center",
          slot: "times"
        },
        {
          title: "查询参数",
          key: "params",
          align: "center"
        },
        {
          title: "通知方式",
          key: "way",
          align: "center",
          slot: "way"
        },
        {
          title: "接受人",
          key: "person",
          align: "center",
          slot: "person"
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          slot: "status"
        },
        {
          title: "操作",
          align: "center",
          slot: "action"
        }
      ],
      columns2: [
        {
          type: "index",
          width: 100,
          align: "center",
          title: "序号"
        },
        {
          title: "统计周期",
          key: "interval",
          align: "center",
          slot: "interval"
        },
        {
          title: "任务执行规则",
          key: "crontab",
          align: "center",
          slot: "crontab"
        },
        {
          title: "查询参数",
          key: "params",
          align: "center",
          slot:"params"
        },
        {
          title: "接受人",
          key: "person",
          align: "center",
          slot: "person"
        },
        {
          title: "状态",
          key: "status",
          align: "center",
          slot: "status"
        },
        {
          title: "操作",
          align: "center",
          slot: "action"
        }
      ],
      // columns3: [
      //   {
      //     type: "index",
      //     width: 100,
      //     align: "center",
      //     title: "序号"
      //   },
      //   {
      //     title: "任务执行规则",
      //     key: "interval",
      //     align: "center",
      //     slot: "interval"
      //   },
      //   {
      //     title: "查询参数",
      //     key: "params",
      //     align: "center"
      //   },
      //   {
      //     title: "通知方式",
      //     key: "way",
      //     align: "center",
      //     slot: "way"
      //   },
      //   {
      //     title: "接受人",
      //     key: "person",
      //     align: "center",
      //     slot: "person"
      //   },
      //   {
      //     title: "状态",
      //     key: "status",
      //     align: "center",
      //     slot: "status"
      //   },
      //   {
      //     title: "操作",
      //     align: "center",
      //     slot: "action"
      //   }
      // ],
      taskList1: [],
      taskList2: [],
      // taskList3: [],
      app: "",
      disabled: true,
      click: true,
      index: -1
    };
  },
  mounted() {
    // console.log(this)
    // this.app = this.$route.query.app;
    // this.name = this.$route.query.name;
    // this.tmpApp = this.$route.query.app;
    // this.tmpName = this.$route.query.name;
    this.id = this.$route.query.id;
    // if (!this.app) {
    //   this.$Message.info("请重新进入").onClose(
    //     this.$router.push({
    //       name: "projectManager"
    //     })
    //   );
    // }
    this.getProjectDetail();
    this.getUserList();
  },
  methods: {
    getProjectDetail() {
      let data = {
        id: this.id,
        // type: 1
      };
      projectApi.getProjectDetail(data).then(data => {
        // console.log(data)
        // console.log('getProjectDetail',data.data);
        let tmp = data.data.data.task;
        let taskList1 = [];
        let taskList2 = [];
        let taskList3 = [];
        this.name = data.data.data.project.name;
        this.app = data.data.data.project.app;
        // for(i=0;i<tmp.length;i++){
        //   if(tmp[i].type==1){
        //     taskList1.a
        //   }
        // }
        tmp.forEach(item => {
          if(item.type == 1) {
            taskList1.push(item)
          }else if(item.type == 2) {
            taskList2.push(item)
          }else {
            taskList3.push(item)
          }
        })
        this.taskList1 = taskList1;
        this.taskList2 = taskList2;
        // this.taskList3 = taskList3;
        this.click = true;
      });
    },
    getUserList() {
      accountApi.getPersonList().then(data => {
        let tmp = [];
        let _tmp = {};
        data.data.data.forEach((element, index) => {
          _tmp = {};
          _tmp.name = element;
          _tmp.index = index;
          tmp.push(_tmp);
        });
        this.userNameList = tmp;
      });
    },
    change() {
      this.disabled = !this.disabled;
    },
    cancel() {
      this.disabled = true;
      // this.app = this.tmpApp;
      // this.name = this.tmpName;
    },
    nameConfirm() {
      if (this.click) {
        this.click = false;
        let data = {
          app: this.app,
          name: this.name,
          id: this.id
        };
        projectApi
          .modifyProject(data)
          .then(data => {
            if (data.data.code === 200) {
              this.$Message.success("修改成功");
              this.disabled = true;
              this.click = true;
            } else {
              this.$Message.error("修改失败");
              this.click = true;
            }
          })
          .catch(err => {
            this.$Message.error("修改失败");
            this.click = true;
          });
      }
    },
    close1(e) {
      if(e){
        return
      }
      this.taskModal = false;
      this.newTask = {
        timeCell: "",
        times: "",
        params: "",
        way: [],
        person: []
      };
      this.userList = [{ name: "" }];
    },
    close2(e) {
      if(e) return
      this.countTaskModal = false;
      this.newCountTask = {
        crontab: "",
        // times: "",
        params: [''],
        // way: [],
        person: []
      };
      this.userList = [{ name: "" }];
    },
    // close3(e) {
    //   if(e) return
    //   this.onceCountTaskModal = false;
    //   this.newTask = {
    //     timeCell: "",
    //     times: "",
    //     params: "",
    //     way: [],
    //     person: []
    //   };
      // this.userList = [{ name: "" }];
    // },
    confirm() {
      let tmp = this.newTask;
      if (!tmp.timeCell) {
        this.$Message.warning("规则未填写");
        return;
      }
      if (!tmp.times) {
        this.$Message.warning("告警条件未填写");
        return;
      }
      if (!tmp.params) {
        this.$Message.warning("参数未填写");
        return;
      }
      if (tmp.way.length == 0) {
        this.$Message.warning("通知方式未选择");
        return;
      }
      if (!this.userList[0].name) {
        this.$Message.warning("接受人未选择");
        return;
      } else {
        tmp.person = this.userList.filter(s => s.name).map(s => s.name);
      }
      let data = {
        app: this.app,
        name: this.name,
        ...tmp
      };
      if (this.click) {
        this.click = false;
        if (this.index != -1) {
          projectApi
            .modifyTask(data)
            .then(data => {
              if (data.data.code === 200) {
                this.$Message.success("修改成功");
                this.close1();
                this.getProjectDetail();
                this.click = true;
              } else {
                this.$Message.error(data.data.errorMessage);
                this.click = true;
              }
            })
            .catch(err => {
              this.$Message.error("修改失败");
              this.click = true;
            });
        } else {
          projectApi
            .createTask(data)
            .then(data => {
              if (data.data.code === 200) {
                this.$Message.success("创建成功");
                this.close1();
                this.getProjectDetail();
                this.click = true;
              } else {
                this.$Message.error("创建失败");
                this.click = true;
              }
            })
            .catch(err => {
              this.$Message.error("创建失败");
              this.click = true;
            });
        }
      }
    },
    confirm1() {
      let tmp = this.newCountTask;
      if (!tmp.interval) {
        this.$Message.warning("统计周期未填写");
        return;
      }else {
        tmp.interval = Number(tmp.interval)
      }
      if (!tmp.crontab) {
        this.$Message.warning("执行规格未填写");
        return;
      }
      if (!tmp.params) {
        this.$Message.warning("查询参数未填写");
        return;
      }
      if (!this.userList[0].name) {
        this.$Message.warning("接受人未选择");
        return;
      } else {
        tmp.person = this.userList.filter(s => s.name).map(s => s.name);
      }
      let data = {
        app: this.app,
        name: this.name,
        type: 2,
        ...tmp
      };
      if (this.click) {
        this.click = false;
        if (this.index != -1) {
          projectApi
            .modifyCount(data)
            .then(data => {
              if (data.data.code === 200) {
                this.$Message.success("修改成功");
                this.close2();
                this.getProjectDetail();
                this.click = true;
              } else {
                this.$Message.error(data.data.errorMessage);
                this.click = true;
              }
            })
            .catch(err => {
              this.$Message.error("修改失败");
              this.click = true;
            });
        } else {
          projectApi
            .createCount(data)
            .then(data => {
              if (data.data.code === 200) {
                this.$Message.success("创建成功");
                this.close2();
                this.getProjectDetail();
                this.click = true;
              } else {
                this.$Message.error(data.data.errorMessage);
                this.click = true;
              }
            })
            .catch(err => {
              this.$Message.error("创建失败");
              this.click = true;
            });
        }
      }
    },
    addTask(index) {
      this.index = index;
      if (index != -1) {
        this.taskModalTitle = '修改任务'
        let task = this.taskList1[index];
        let tmp = [];
        this.newTask = {
          timeCell: task.timeCell,
          times: task.times,
          params: task.params,
          way: task.way,
          person: task.person,
          id: task._id.$oid
        };
        task.person.forEach(item => {
          tmp.push({ name: item });
        });
        this.userList = tmp;
      }
      this.taskModal = true;
    },
    addCountTask(index) {
      this.index = index;
      if (index != -1) {
        this.taskModalTitle = '修改任务'
        let task = JSON.parse(JSON.stringify(this.taskList2[index]));
        let tmp = [];
        this.newCountTask = {
          // timeCell: task.timeCell,
          interval: task.interval,
          crontab: task.crontab,
          params: task.params,
          person: task.person,
          id: task._id.$oid
        };
        task.person.forEach(item => {
          tmp.push({ name: item });
        });
        this.userList = tmp;
      }
      this.countTaskModal = true;
    },
    // addOnceCountTask(index) {
    //   this.index = index;
    //   if (index != -1) {
    //     this.taskModalTitle = '修改任务'
    //     let task = this.taskList3[index];
    //     let tmp = [];
    //     this.newTask = {
    //       timeCell: task.timeCell,
    //       times: task.times,
    //       params: task.params,
    //       way: task.way,
    //       person: task.person,
    //       id: task._id.$oid
    //     };
    //     task.person.forEach(item => {
    //       tmp.push({ name: item });
    //     });
    //     this.userList = tmp;
    //   }
    //   this.onceCountTaskModal = true;
    // },
    modifyTaskConfirm(row, index,num) {
      let vm = this
      let status
      if(row.status) {
        status = '结束'
      }else {
        status = '开始'
      }
      this.$Modal.confirm({
        title: '提示',
        content: `<p>确定${status}任务吗？</p>`,
        onOk: () => {
          vm.modifyTaskStatus(index,num)
        },
        onCancel: () => {
          this.$Message.info('取消执行');
        }
      });
    },
    modifyTaskStatus(index,num) {
      let id
      switch (num) {
        case 1:
          id = this.taskList1[index]._id.$oid
          status = this.taskList1[index].status === 0 ? 1 : 0
          break;
        case 2:
          id = this.taskList2[index]._id.$oid,
          status = this.taskList2[index].status === 0 ? 1 : 0
          break;
        case 3:
          id = this.taskList3[index]._id.$oid,
          status = this.taskList3[index].status === 0 ? 1 : 0
        default:
          break;
      }
      if (this.click) {
        this.click = false;
        let data = {
          id,
          status: Number(status)
        };
        projectApi
          .modifyTaskStatus(data)
          .then(data => {
            if (data.data.code === 200) {
              this.$Message.success("修改成功");
              this.getProjectDetail();
            } else {
              this.$Message.error("修改失败");
            }
            this.click = true;
          })
          .catch(err => {
            this.$Message.error("修改失败");
            this.click = true;
          });
      }
    },
    deleteTaskConfirm(index,num) {
      let vm = this
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除任务吗？</p>',
        onOk: () => {
          vm.deleteTask(index,num)
        },
        onCancel: () => {
          this.$Message.info('取消删除');
        }
      });
    },
    deleteTask(index,num) {
      let id
      switch (num) {
        case 1:
          id = this.taskList1[index]._id.$oid
          break;
        case 2:
          id = this.taskList2[index]._id.$oid
          break;
        case 3:
          id = this.taskList3[index]._id.$oid
        default:
          break;
      }
      if (this.click) {
        this.click = false;
        let data = {
          id,
          app: this.app
        };
        projectApi
          .deleteTask(data)
          .then(data => {
            if (data.data.code === 200) {
              this.$Message.success("删除成功");
              this.getProjectDetail();
            } else {
              this.$Message.error("删除失败");
              this.click = true;
            }
          })
          .catch(err => {
            this.$Message.error("删除失败");
            this.click = true;
          });
      }
    },
    addUser(index) {
      this.userNameList[index].disabled = true
      this.userList.push({
        name: "",
        index: index + 1
      });
      this.taskChange()
    },
    deleteUser(index) {
      this.userList.splice(index, 1);
      this.taskChange()
    },
    addParams(index) {
      this.newCountTask.params.push('');
    },
    deleteParams(index) {
      this.newCountTask.params.splice(index, 1);
    },
    taskChange () {
      this.userNameList.forEach(item1=> {
        item1.disabled = false
        this.userList.forEach(item2=> {
          if(item2.name == item1.name) {
            item1.disabled = true
          }
        })
      })
      
    }
  }
};
</script>

<style lang="less" scoped>
.project-detail {
  .detail-part {
    .part-title {
      font-size: 16px;
      font-weight: 500;
      padding: 10px 20px;
      border-bottom: 1px solid #f2f2f2;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .part-content {
      padding: 10px;
      .part-text {
        margin-bottom: 15px;
        margin-left: 15px;
      }
      .part-input {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        margin-left: 15px;
      }
      .table {
        height: ~"calc(100% - 100px)";
        .ivu-table-wrapper {
          height: ~"calc( 100% - 24px )";
        }
        .table-header,
        .table-detail {
          display: flex;
          .table-header-title,
          .table-detail-list {
            flex: 1;
            height: 40px;
            background: #f8f8f9;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #333;
            font-weight: 700;
          }
        }
        .tableActions {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>

<style lang="less">
.addTask {
  .modalContent {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 20px;
    .modalInput {
      margin: 0 10px 0 10px;
    }
    .addTaskIcon {
      font-size: 22px;
      margin-right: 5px;
    }
    .modalUser {
      display: flex;
      flex-direction: column;
      .modalUserPart {
        margin-bottom: 10px;
      }
    }
  }
  .modalContentUser {
    align-items: flex-start;
  }
}

.addCountTask {
  .modalContent {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 20px;
    .modalInput {
      margin: 0 10px 0 10px;
    }
    .addTaskIcon {
      font-size: 22px;
      margin-right: 5px;
    }
    .modalUser {
      display: flex;
      flex-direction: column;
      .modalUserPart {
        margin-bottom: 10px;
      }
    }
  }
  .modalContentUser {
    align-items: flex-start;
  }
}

.table {
  .ivu-table-header {
    position: relative;
  }

  .ivu-table-body {
    margin-top: 0;
  }
}
</style>
