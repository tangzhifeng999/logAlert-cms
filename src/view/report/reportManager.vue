<template>
  <div class="roleList">
    <div class="top-part">
      <Button class="addBtn" @click="addTask(-1)">新建日志</Button>
      <!-- <Input
        search
        enter-button="搜索"
        placeholder="项目名称/项目代码"
        style="width:200px"
        @on-search="getProjectList"
        v-model="keyword"
      />-->
    </div>
    <div class="table">
      <Table
        ref="currentRowTable"
        :columns="projectColumns"
        :data="projectList"
        no-data-text="暂无数据"
      >
        <template slot="action" slot-scope="{row,index}">
          <div class="tableActions">
            <div class="blue" @click="addTask(index)">编辑</div>
            <div style="margin-left:5px;margin-right:5px;color:#3399ff">|</div>
            <div class="blue" @click="statrCount(index)">开始</div>
            <div style="margin-left:5px;margin-right:5px;color:#3399ff">|</div>
            <div class="blue" @click="deleteCount(index)">删除</div>
          </div>
        </template>
      </Table>
      <div style="margin: 10px;">
        <div style="float: right;">
          <Page
            :current="currentPage"
            size="small"
            @on-change="changePage"
            @on-page-size-change="changePageSize"
            show-elevator
            show-sizer
            show-total
            :total="total"
          >
            <slot>共计{{total}}个记录</slot>
          </Page>
        </div>
      </div>
    </div>
    <Modal v-model="projectModal" title="新建项目" class="addReport" @on-cancel="close" :width="640">
      <div>
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
            <div v-for="(item,index) in userList" :key="index" class="modalUserPart">
              <Select v-model="item.name" style="width:200px" class="modalInput">
                <Option
                  v-for="ele in userNameList"
                  :value="ele.name"
                  :key="ele.index"
                >{{ ele.name }}</Option>
              </Select>
              <Icon
                type="ios-add-circle-outline"
                class="addTaskIcon"
                @click="addUser(index)"
                v-if="userNameList.length>1"
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
        <div class="modalContent">
          <div style="width:110px;display:flex">
            <img class="redStar" src="@/assets/images/required.png" alt />
            <div>执行周期:</div>
          </div>
          <div class="modalInput">
            <RadioGroup v-model="timeType" type="button" @on-change="radioChange">
              <Radio label="日"></Radio>
              <Radio label="周"></Radio>
              <Radio label="月"></Radio>
              <Radio label="其他"></Radio>
            </RadioGroup>
          </div>
        </div>
        <div class="modalContent">
          <div v-if="timeType!='其他'" style="margin-left:120px;width:200px">
            <Input v-model="crontab" />
          </div>
          <div v-else style="margin-left:120px">
            <DatePicker
              type="daterange"
              format="yyyy.MM.dd"
              :editable="false"
              @on-change="dateChange"
              :value="time_range"
              placeholder="开始时间 -- 结束时间"
              style="width:200px"
              placement="bottom"
            ></DatePicker>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button style="font-size:14px;" @click="close">取消</Button>
        <Button class="addBtn" style="margin:0 0 0 10px " @click="confirm">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { accountApi, projectApi } from "@/api";
import { type } from "os";
export default {
  data() {
    return {
      total: 100,
      pageSize: 10,
      currentPage: 1,
      err: [],
      errOption: [
        {
          name: "项目名称",
          no: false
        },
        {
          name: "项目代号",
          no: false
        }
      ],
      newTask: {
        params: "",
        way: [],
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
      projectColumns: [
        {
          type: "index",
          width: 100,
          align: "center",
          title: "序号",
          indexMethod: row => {
            return (
              row._index + 1 + this.pageSize * this.currentPage - this.pageSize
            );
          }
        },
        {
          title: "查询参数",
          key: "name",
          align: "center"
        },
        {
          title: "通知方式",
          key: "app",
          align: "center"
        },
        {
          title: "接受人",
          key: "tasks_num",
          align: "center"
        },
        {
          title: "操作",
          align: "center",
          slot: "action"
        }
      ],
      projectList: [],
      projectModal: false,
      keyword: "",
      click: true,
      timeType: "日",
      time_range: [],
      crontab: "",
      interval: 1,
      index: -1
    };
  },
  mounted() {
    this.getProjectList();
    this.getUserList();
  },
  methods: {
    getProjectList() {
      let data = {
        per_page: this.pageSize,
        page: this.currentPage,
        keyword: this.keyword,
        type: 2
      };
      projectApi.getProjectList(data).then(data => {
        this.projectList = data.data.data.data;
        this.total = data.data.data.count;
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
    changePage(e) {
      this.currentPage = e;
      this.getProjectList();
    },
    changePageSize(e) {
      this.pageSize = e;
      this.getProjectList();
    },
    confirm() {
      if (!this.newTask.params) {
        this.$Message.warning("参数未填写");
        return;
      }
      if (!this.userList[0].name) {
        this.$Message.warning("接受人未选择");
        return;
      } else {
        this.newTask.person = this.userList.filter(s => s.name).map(s => s.name);
      }
      if (!this.newTask.way.length) {
        this.$Message.warning("方式未选择");
        return;
      }
      if (this.timeType != "其他") {
        if (!this.crontab) {
          this.$Message.warning("crontab未填写");
          return;
        }
      } else {
        if (!this.time_range.length) {
          this.$Message.warning("时间间隔未选择");
          return;
        }
      }
      let data = {
        ...this.newTask
      };
      if (this.timeType != "其他") {
        data.type = 2;
        data.interval = this.interval;
        data.crontab = this.crontab;
      } else {
        data.type = 3;
        data.time_range = this.time_range;
      }
      if (this.click) {
        this.click = false;
        if (this.index != -1) {
          projectApi
            .modifyCount(data)
            .then(data => {
              if (data.data.code === 200) {
                this.$Message.success("创建成功");
                this.getProjectList();
                this.projectModal = false;
              } else {
                this.$Message.error("创建失败");
                this.click = true;
              }
            })
            .catch(err => {
              this.$Message.error("创建失败");
              this.click = true;
            });
        } else {
          projectApi
            .createCount(data)
            .then(data => {
              if (data.data.code === 200) {
                this.$Message.success("创建成功");
                this.getProjectList();
                this.projectModal = false;
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
    close() {
      this.projectModal = false;
      this.newTask = {
        params: "",
        way: [],
        person: []
      };
      this.timeType = "日";
      (this.interval = 1), (this.crontab = ""), (this.time_range = []);
    },
    addUser(index) {
      this.userList.push({
        name: "",
        index: index + 1
      });
    },
    deleteUser(index) {
      this.userList.splice(index, 1);
    },
    dateChange(e) {
      this.time_range = e;
    },
    addTask(index) {
      this.index = index;
      if (index != -1) {
        let task = this.projectList[index];
        let tmp = [];
        this.newTask = {
          params: task.params,
          way: task.way,
          person: task.person,
          id: task._id.$oid
        };
        // this.timeType = "日";
        // this.interval = 1;
        // this.crontab = "";
        // this.time_range = [];
        task.person.forEach(item => {
          tmp.push({ name: item });
        });
        this.userList = tmp;
      }
      this.projectModal = true;
    },
    radioChange(e) {
      let vm = this;
      switch (e) {
        case "日":
          vm.interval = 1;
          break;
        case "周":
          vm.interval = 7;
          break;
        case "月":
          vm.interval = 30;
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.roleList {
  background: #fff;
  padding: 20px;
  height: 100%;
  .top-part {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .top-actions {
    .action-conditions {
      display: flex;
      margin-bottom: 30px;
      .action-condition {
        display: flex;
        align-items: center;
        flex: 1;
      }
    }
    .action-btns {
      .action-btn {
        margin-right: 10px;
      }
    }
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
</style>

<style lang="less">
.addReport {
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
</style>
