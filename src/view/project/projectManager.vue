<template>
  <div class="roleList">
    <div class="top-part">
      <Button class="addBtn" @click="addProject">新建项目</Button>
      <Input
        search
        enter-button="搜索"
        placeholder="项目名称/项目代码"
        style="width:200px"
        @on-search="getProjectList"
        v-model="keyword"
      />
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
            <div class="blue" @click="toDetail(index)">查看详情</div>
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
    <Modal v-model="projectModal" title="新建项目" class="addProjectModal" @on-cancel="close">
      <div v-if="err.length!=0" class="err">
        <img src alt />
        <div>请填写{{err.join('、')}}</div>
      </div>
      <div>
        <div class="modalContent">
          <img class="redStar" src="@/assets/images/required.png" alt />
          <div>项目名称:</div>
          <Input placeholder="请输入" class="modalInput" v-model="newProject.name" />
        </div>
        <div class="modalContent">
          <img class="redStar" src="@/assets/images/required.png" alt />
          <div>项目代号:</div>
          <Input placeholder="请输入" class="modalInput" v-model="newProject.app" />
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
import { projectApi } from "@/api";
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
      newProject: {
        name: "",
        app: ""
      },
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
          title: "项目名称",
          key: "name",
          align: "center"
        },
        {
          title: "项目代号",
          key: "app",
          align: "center"
        },
        {
          title: "轮询任务数",
          key: "tasks_num",
          align: "center"
        },
        {
          title: "统计任务数",
          key: "count_tasks_num",
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
      click: true
    };
  },
  mounted() {
    this.getProjectList();
  },
  methods: {
    getProjectList() {
      let data = {
        per_page: this.pageSize,
        page: this.currentPage,
        keyword: this.keyword,
        type:1
      };
      projectApi.getProjectList(data).then(data => {
        this.projectList = data.data.data.data;
        this.total = data.data.data.count;
        this.click = true;
      });
    },
    addProject() {
      this.projectModal = true;
    },
    toDetail(index) {
      // let app = this.projectList[index].app;
      // let name = this.projectList[index].name;
      let id = this.projectList[index]._id.$oid;
      this.$router.push({
        name: "projectDetail",
        query: {
          // app: app,
          // name: name,
          id: id
        }
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
      if (!this.newProject.name) {
        this.errOption[0].no = true;
      } else {
        this.errOption[0].no = false;
      }
      if (!this.newProject.app) {
        this.errOption[1].no = true;
      } else {
        this.errOption[1].no = false;
      }
      this.err = this.errOption.filter(s => s.no).map(s => s.name);
      if (this.err.length == 0 && this.click) {
        this.click = false;
        projectApi
          .createProject(this.newProject)
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
    },
    close() {
      this.projectModal = false;
      this.newProject = {
        name: "",
        app: ""
      };
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
.addProjectModal {
  .modalContent {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .modalInput {
      width: 300px;
      margin-left: 5px;
    }
  }
  .err {
    display: flex;
    align-items: center;
    background: rgba(255, 242, 241, 1);
    border: 1px solid rgba(255, 163, 158, 1);
    margin-bottom: 20px;
  }
}
</style>
