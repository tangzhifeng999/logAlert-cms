<template>
  <div class="notification">
    <div class="top-actions">
      <div class="action-conditions">
        <div class="action-condition">
          <div class="condition-title">项目：</div>
          <Select v-model="project" style="width:200px" @on-change="selectProject">
            <Option v-for="item in projectList" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </div>
        <div class="action-condition">
          <div class="condition-title">状态：</div>
          <Select v-model="status" style="width:200px" @on-change="selectStauts">
            <Option
              v-for="item in statusList"
              :value="item.status"
              :key="item.value"
            >{{ item.value }}</Option>
          </Select>
        </div>
        <div class="action-condition">
          <div class="condition-title">产生时间：</div>
          <div>
            <DatePicker
              type="daterange"
              format="yyyy.MM.dd"
              :editable="false"
              @on-change="dateChange"
              :value="assignTime"
              placeholder="开始时间 -- 结束时间"
              style="width:200px"
              placement="right"
            ></DatePicker>
          </div>
        </div>
      </div>
      <div class="action-conditions">
        <div class="action-condition">
          <div class="condition-title">关键词：</div>
          <div>
            <Input class="condition-input" placeholder="message" v-model="keywords" />
          </div>
        </div>
      </div>
      <div class="action-btns">
        <Button class="action-btn" @click="getLogList">搜索</Button>
      </div>
    </div>
    <div class="batchClosureButtonDiv">
      <div>
        <Button type="primary" class="batchClosureButton" @click="batchNotAlertButton">批量不再告警</Button>
      </div>
      <div>
        <Button type="primary" class="batchClosureButton" @click="batchClosureButton">批量完成处理</Button>
      </div>
    </div>
    <div class="table">
      <Table ref="currentRowTable" :columns="columns" :data="logList" @on-selection-change="selectChange" no-data-text="暂无数据">
        <template slot="MD5" slot-scope="{row}">
          <div class="tableActions">
            <div>{{row.loginfo.md5}}</div>
          </div>
        </template>
        <!-- <template slot="time" slot-scope="{row}">
          <div class="tableActions">
            <div>{{row.time?row.time:row.update_time}}</div>
          </div>
        </template> -->
        <template slot="status" slot-scope="{row}">
          <div class="tableActions">
            <div>{{fixStatus(row.status)}}</div>
          </div>
        </template>
        <template slot="action" slot-scope="{row,index}">
          <div class="tableActions">
            <div
              style="color:#3399ff;cursor: pointer;"
              @click="addNote(index)"
              v-if="row.status=='0'"
            >立即处理</div>
            <div class="verticalLine" v-if="row.status=='0'">|</div>
            <div
              style="color:#3399ff;cursor: pointer;;"
              @click="addNote(index)"
              v-if="row.status=='1'"
            >处理完成</div>
            <div class="verticalLine" v-if="row.status=='1'">|</div>
            <div style="color:#3399ff;cursor: pointer;" @click="toDetail(index)">查看详情</div>
            <div class="verticalLine">|</div>
            <div style="color:#3399ff;cursor: pointer;" @click="toRecord(index)">处理记录</div>
            <div class="verticalLine" v-if="row.status!='3'">|</div>
            <div class="red" @click="finishDeal(index)" v-if="row.status!='3'">不再告警</div>
            <div class="verticalLine" v-if="row.status=='3'">|</div>
            <div class="red" @click="resumeDeal(index)" v-if="row.status=='3'">恢复告警</div>
          </div>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page
            :current="page"
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
    <div v-if="detailModal">
      <Modal v-model="detailModal" title="查看详情" class="detailModal" :width="640">
        <div class="detailModalTable">
          <div class="tableHeader">
            <div class="tableHeaderTime">时间</div>
            <div class="tableHeaderMsg">message</div>
          </div>
          <div class="tableBody" v-for="(item,index) in detailData.timeline" :key="index">
            <div class="tableHeaderTime">{{item}}</div>
            <Poptip
              trigger="hover"
              title="详细信息"
              :content="detailData.loginfo.message.replace(/at\s/g , '\n at ')"
              placement="bottom-start"
            >
              <div class="tableHeaderMsg">{{detailData.loginfo.message}}</div>
            </Poptip>
          </div>
        </div>
        <div slot="footer">
          <!-- <div class="tableCount" style="position: absolute">告警总次数: {{ detailData.loginfo.timeline.length }}次</div> -->
          <template>
            <!-- <Page :total="40" size="small" /> -->
            <Page :total="toalNum" size="small" show-elevator show-sizer show-total @on-change="pageChange" @on-page-size-change="pageSizeChange"/>
            <!-- <Page :total="40" size="small" show-total /> -->
          </template>
          <Button class="addBtn" @click="addNote(index)" v-if="logList[index].status=='0'">立即处理</Button>
          <Button class="addBtn" style="margin:0 0 0 10px " @click="close">关闭</Button>
        </div>
      </Modal>
    </div>
    <Modal v-model="noteModal" title="填写备注" class="noteModal" @on-cancel="closeNote">
      <div>
        <div class="modalContent">
          <img class="redStar" src="@/assets/images/required.png" alt />
          <div>填写备注:</div>
          <Input placeholder="请输入" class="modalInput" v-model="note" type="textarea"/>
        </div>
      </div>
      <div slot="footer">
        <Button style="font-size:14px;" @click="closeNote">取消</Button>
        <Button class="addBtn" style="margin:0 0 0 10px " :loading="modalLoading" @click="confirmFinishDeal">确定</Button>
      </div>
    </Modal>
    <Modal v-model="otherNoteModal" title="填写备注" class="noteModal" @on-cancel="closeNote">
      <div>
        <div class="modalContent">
          <!-- <img class="redStar" src="@/assets/images/required.png" alt /> -->
          <div>填写备注:</div>
          <Input placeholder="请输入" class="modalInput" v-model="note" type="textarea"/>
        </div>
      </div>
      <div slot="footer">
        <Button style="font-size:14px;" @click="closeNote">取消</Button>
        <Button class="addBtn" style="margin:0 0 0 10px " :loading="modalLoading" @click="confirmDeal">确定</Button>
      </div>
    </Modal>
    <Modal v-model="recordModal" footer-hide>
      <p slot="header"></p>
      <div class="dealRecord">
        <Timeline>
          <p class="dealRecordNoData" v-if="dealRecord.length === 0">暂无处理数据</p>
          <TimelineItem v-for="(item,index) in dealRecord" :key="index">
            <p class="time">{{item.time}}</p>
            <p class="content">{{item.name}}</p>
            <p class="content">tag:{{item.tag}}</p>
            <p class="content" v-if="item.note">note:{{item.note}}</p>
          </TimelineItem>
        </Timeline>
      </div>
    </Modal>
    <Modal v-model="batchClosureModal" title="填写备注" class="noteModal" @on-cancel="closeNote">
      <!-- 批量关闭的弹窗 -->
      <div>
        <div class="modalContent">
          <div class="redStar"/>
          <div>填写备注:</div>
          <Input placeholder="请输入" class="modalInput" v-model="note" type="textarea"/>
        </div>
      </div>
      <div slot="footer">
        <Button style="font-size:14px;" @click="closeNote">取消</Button>
        <Button class="addBtn" style="margin:0 0 0 10px " :loading="modalLoading" @click="confirmBatchClosure">确定</Button>
      </div>
    </Modal>
    <Modal v-model="batchNotAlertModal" title="填写备注" class="noteModal" @on-cancel="closeNote">
      <!-- 批量不再告警的弹窗 -->
      <div>
        <div class="modalContent">
          <img class="redStar" src="@/assets/images/required.png" alt />
          <div>填写备注:</div>
          <Input placeholder="请输入" class="modalInput" v-model="note" type="textarea"/>
        </div>
      </div>
      <div slot="footer">
        <Button style="font-size:14px;" @click="closeNote">取消</Button>
        <Button class="addBtn" style="margin:0 0 0 10px " :loading="modalLoading" @click="confirmBatchNotAlert">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { alertApi, projectApi } from "@/api";
export default {
  data() {
    return {
      project: "全部项目",
      noteModal: false,
      otherNoteModal: false,
      modalLoading: false,
      batchClosureModal: false,
      batchNotAlertModal: false,
      note: "",
      projectList: [],
      selectionIdList: [],
      status: -1,
      page: 1,
      per_page: 10,
      total: 100,
      pageModal: 1,
      per_page_modal: 10,
      totalModal: 100,
      statusList: [
        {
          value: "所有状态",
          status: -1
        },
        {
          value: "待处理",
          status: 0
        },
        {
          value: "处理中",
          status: 1
        },
        {
          value: "已完成",
          status: 2
        },
        {
          value: "不再告警",
          status: 3
        }
      ],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          type: "index",
          width: 60,
          align: "center",
          title: "序号",
          indexMethod: row => {
            return row._index + 1 + this.per_page * this.page - this.per_page;
          }
        },
        {
          title: "项目名称",
          key: "name",
          align: "center",
          width:100,
        },
        {
          title: "MD5值",
          key: "MD5",
          align: "center",
          slot: "MD5"
        },
        {
          title: "日志类型",
          key: "level",
          align: "center",
          width: 100
        },
        {
          title: "日志文件路径",
          key: "path",
          align: "center"
        },
        {
          title: "告警时间",
          key: "time",
          align: "center",
          width: 150
        },
        {
          title: "当前状态",
          key: "status",
          align: "center",
          slot: "status",
          width: 100
        },
        {
          title: "操作",
          width: 300,
          align: "center",
          slot: "action"
        }
      ],
      logList: [],
      detailData: [],
      detailModal: false,
      keywords: "",
      choseTime: [],
      index: 0,
      toalNum: 0,
      assignTime: [],
      click: true,
      dealRecord: [],
      recordModal: false
    };
  },
  mounted() {
    this.getLogList();
    this.getProjectNameList();
  },
  methods: {
    getLogList() {
      let data = {
        name: this.project === "全部项目" ? "" : this.project,
        status: this.status === -1 ? "" : this.status,
        keywords: this.keywords,
        report_time:
          this.choseTime.length === 0 ? this.assignTime : this.choseTime,
        per_page: this.per_page,
        page: this.page
      };
      alertApi.getLogList(data).then(data => {
        this.logList = data.data.data.data;
        this.total = data.data.data.count;
      });
    },
    getProjectNameList() {
      projectApi.getProjectNameList().then(data => {
        let tmp = data.data.data;
        tmp.unshift("全部项目");
        this.projectList = tmp;
      });
    },
    changePage(e) {
      this.page = e;
      this.getLogList();
    },
    changePageSize(e) {
      this.per_page = e;
      this.getLogList();
    },
    pageChange(e) {
      this.pageModal = e;
      this.toDetail(this.index);
    },
    pageSizeChange(e) {
      this.per_page_modal = e;
      this.toDetail(this.index);
    },
    dateChange(e) {
      this.choseTime = e;
    },
    addNote(index) {
      this.otherNoteModal = true;
      this.index = index;
      this.modalLoading = false
    },
    selectChange(selection) {
      let lists = []
      for (let i=0; i<selection.length; i++) {
        let id = selection[i]._id.$oid;  //一次获取到每一个选中项的id
        lists.push(id)
      }
      this.selectionIdList = lists
    },
    confirmDeal() {
      this.modalLoading = true
      if (this.click) {
        this.click = false;
        let data = {
          id: this.logList[this.index]._id.$oid,
          note: this.note
        };
        let status = this.logList[this.index].status;
        if (status == 0) {
          this.nowDeal(data);
        } else if (status == 1) {
          this.solveDeal(data);
        }
      }
    },
    nowDeal(data) {
      alertApi
        .checkLog(data)
        .then(data => {
          if (data.data.code != 200) {
            this.$Message.error("处理错误,稍后再试");
            this.click = true;
          } else {
            this.getLogList();
            this.note = "";
            this.$Message.success("处理成功")
            this.click = true;
          }
          this.otherNoteModal = false
        })
        .catch(err => {
          this.$Message.error("处理错误，稍后再试");
          this.click = true;
          this.otherNoteModal = false
        });
    },
    solveDeal(data) {
      alertApi
        .solveLog(data)
        .then(data => {
          if (data.data.code != 200) {
            this.$Message.error("处理错误,稍后再试");
            this.click = true;
          } else {
            this.getLogList();
            this.note = "";
            this.click = true;
            this.$Message.success("处理成功")
          }
          this.otherNoteModal = false
        })
        .catch(err => {
          this.$Message.error("处理错误，稍后再试");
          this.click = true;
          this.otherNoteModal = false;

        });
    },
    finishDeal(index) {
      this.index = index;
      if (this.logList[index].status == 3) {
        this.$Message.info("已不再告警");
      } else {
        this.noteModal = true;
        this.modalLoading = false
      }
    },
    resumeDeal(index) {
      this.index = index;
      if (this.logList[index].status == 2) {
        this.$Message.info("已恢复告警");
      } else {
        this.noteModal = true;
      }
    },
    toRecord(index) {
      this.index = index;
      let data = {
        id: this.logList[this.index]._id.$oid
      };
      this.getLogRecord(data);
    },
    toDetail(index) {
      this.index = index;
      let id = this.logList[this.index]._id.$oid;
      let md5 = this.logList[this.index].loginfo.md5;
      let data = {
        id: id,
        md5: md5,
        per_page: this.per_page_modal,
        page: this.pageModal,
      };
      this.pageModal =1
      alertApi.getLogDetail(data).then(data => {
        if (data.data.code === 200) {
          this.detailData = [];
          this.detailModal = true;
          this.detailData = data.data.data;
          this.toalNum = data.data.data.total_num;
        } else {
          this.$Message.error("详情查询失败");
        }
      });
    },
    close() {
      this.detailModal = false;
    },
    closeNote() {
      this.noteModal = false;
      this.otherNoteModal = false;
      this.batchClosureModal = false;
      this.batchNotAlertModal = false;
      this.note = "";
    },
    confirmFinishDeal() {
      this.modalLoading = true 
      if (!this.note) {
        this.$Message.warning("请填写note");
        this.modalLoading = false 
        return;
      }
      if (this.click) {
        this.modalLoading = true
        this.click = false;
        let id = this.logList[this.index]._id.$oid;
        let status = this.logList[this.index].status;
        let data = {
          id: id,
          note: this.note
        };
        if (status != 3) {
          this.notAlert(data);
        }else {
          this.resumeAlert(data);
        }
        this.modalLoading = false;
      }
    },
    batchClosureButton () {
      if (this.selectionIdList.length == 0) {
        this.$Message.warning("请至少选择一个关闭项")
        return
      }
      this.batchClosureModal = true
    },
    batchNotAlertButton() {
      if (this.selectionIdList.length == 0) {
        this.$Message.warning("请至少选择一个关闭项")
        return
      }
      this.batchNotAlertModal = true
    },
    confirmBatchClosure() {
      let data = {
        ids: this.selectionIdList,
        note: this.note
      }
      if (this.click) {
        this.click = false
        alertApi
        .batchClosure(data)
        .then(data =>{
          if (data.data.code != 200) {
            this.click = true
            this.selectionIdList = []
            this.$Message.error("处理错误，稍后再试")
          }else {
            this.$Message.success("关闭成功")
            this.selectionIdList = []
            this.batchClosureModal = false;
            this.click = true
            this.note = "";
            this.getLogList()
          }
        }).catch(err=>{
          this.$Message.error("处理错误,稍后再试");
          this.selectionIdList = []
          this.click = true
        })
      }
    },
    confirmBatchNotAlert() {
      if (this.note == '') {
        this.$Message.warning('请填写备注信息')
        return
      }
      let data ={
        ids: this.selectionIdList,
        note: this.note
      }
      if (this.click) {
        this.click = false
        alertApi
        .batchNotAlert(data)
        .then(data =>{
          if (data.data.code != 200) {
            this.click = true
            this.selectionIdList = []
            this.$Message.error("处理错误，稍后再试")
          }else {
            this.$Message.success("关闭成功")
            this.selectionIdList = []
            this.batchNotAlertModal = false;
            this.click = true
            this.note = "";
            this.getLogList()
          }
        }).catch(err=>{
          this.$Message.error("处理错误,稍后再试");
          this.selectionIdList = []
          this.click = true
        })
      }
    },
    notAlert(data) {
      this.modalLoading = true;
      alertApi
      .finishLog(data)
      .then(data => {
        if (data.data.code != 200) {
          this.$Message.error("处理错误,稍后再试");
          this.click = true;
        } else {
          this.getLogList();
          this.noteModal = false;
          this.$Message.success("处理成功")
          this.note = "";
          this.click = true;
        }
        this.modalLoading = false;
      })
      .catch(err=>{
        this.$Message.error("处理错误,稍后再试");
        this.click = true
      });
    },
    resumeAlert(data) {
      this.modalLoading = true;
      alertApi
      .resumeLog(data)
      .then(data => {
        if (data.data.code != 200) {
          this.$Message.error("处理错误,稍后再试");
          this.click = true;
        } else {
          this.getLogList();
          this.noteModal = false;
          this.$Message.success("处理成功")
          this.note = "";
          this.click = true;
        }
        this.modalLoading = false;
      })
      .catch(err=>{
        this.$Message.error("处理错误,稍后再试");
        this.click = true
      });
    },
    fixStatus(status) {
      switch (status) {
        case 0:
          return "待处理";
          break;
        case 1:
          return "处理中";
          break;
        case 2:
          return "已完成";
          break;
        default:
          return "不再告警";
          break;
      }
    },
    selectProject() {
      this.getLogList();
    },
    selectStauts() {
      this.getLogList();
    },
    getLogRecord(data) {
      alertApi.getLogRecord(data).then(data => {
        if (data.data.code != 200) {
          this.$Message.error("处理记录获取失败");
        } else {
          this.dealRecord = data.data.data;
          this.recordModal = true;
        }
      });
    },
  }
};
</script>

<style lang="less" scoped>
.notification {
  background: #fff;
  padding: 20px;
  height: 100%;
  .top-actions {
    margin-bottom: 20px;
    .action-conditions {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;
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
    height: ~"calc(100% - 241.91px)";
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
.detailModal {
  // max-height: 800px;
  .detailModalTable {
    width: 608px;
    height: 500px;
    overflow: scroll;
    .tableHeader {
      width: 100%;
      height: 50px;
      display: flex;
      border: 1px solid rgb(215, 215, 215);
      background: #f2f2f2;
    }
    .tableBody {
      width: 100%;
      height: 80px;
      display: flex;
      border-left: 1px solid rgb(215, 215, 215);
      border-right: 1px solid rgb(215, 215, 215);
      border-bottom: 1px solid rgb(215, 215, 215);
    }
    .tableHeaderTime {
      width: 250px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .tableHeaderMsg {
      width: 350px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .ivu-poptip {
      width: 350px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .ivu-poptip-rel {
      .tableHeaderMsg {
        width: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
    }
    .ivu-poptip-body-content-inner {
      // word-break: break-all;
      word-break: break-all;
      width: auto;
      max-width: 600px;
      min-width: 400px;
      white-space: pre;
      height: 400px;
      overflow: auto;
    }
  }
}
.noteModal {
  .modalContent {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .modalTitle {
      width: 60px;
      text-align: right;
    }
    .modalInput {
      width: 300px;
      margin-left: 5px;
    }
  }
}
.dealRecord {
  background: #fff;
  padding: 20px;
  height: 100%;
  .action-condition {
    display: flex;
    align-items: center;
    flex: 1;
    margin-bottom: 20px;
  }
}

.dealRecordNoData {
  background: #fff;
  padding: 20px;
  height: 100%;
  .action-condition {
    display: flex;
    align-items: center;
    flex: 1;
    margin-bottom: 20px;
  }
}
.tableCount{
  background: #fff;
  padding: 10px;
  // height: 100%;
}
.batchClosureButton {
  margin-bottom: 10px;
  margin-left: 10px;
}
.batchClosureButtonDiv {
  display: flex;
  flex-direction: row-reverse;
}
</style>
