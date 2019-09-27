<template>
  <div class="memberList">
    <div class="top-part">
      <Button class="addBtn" @click="addMember">新增成员</Button>
      <!-- <Input search placeholder="姓名/手机号" style="width:200px" @on-search="search"/> -->
    </div>
    <div class="table">
      <Table ref="currentRowTable" :columns="columns" :data="userList" no-data-text="暂无数据">
        <template slot="status" slot-scope="{row}">
          <div class="tableActions">
            <div>{{row.status?'使用中':'已禁用'}}</div>
          </div>
        </template>
        <template slot="action" slot-scope="{row,index}">
          <div class="tableActions">
            <div class="blue" @click="toEdit(index)">编辑</div>
            <div style="margin-left:5px;margin-right:5px;color:#3399ff">|</div>
            <div
              :class="row.status?'red':'blue'"
              @click="changeStatus(index)"
            >{{row.status?'禁用':'启用'}}</div>
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
    <Modal v-model="memberModal" title="新建成员" class="addMemberModal" @on-cancel="close">
      <div>
        <div class="modalContent">
          <div class="modalTitle">
            <img class="redStar" src="@/assets/images/required.png" alt />真实姓名:
          </div>
          <Input placeholder="请输入" class="modalInput" v-model="memberInfo.name" />
        </div>
        <div class="modalContent">
          <div class="modalTitle">
            <img class="redStar" src="@/assets/images/required.png" alt />手机号:
          </div>
          <Input placeholder="请输入" class="modalInput" v-model="memberInfo.mobile" />
        </div>
        <div class="modalContent">
          <div class="modalTitle">
            <img class="redStar" src="@/assets/images/required.png" alt />邮箱:
          </div>
          <Input placeholder="请输入" class="modalInput" v-model="memberInfo.email" />
        </div>
        <div class="modalContent">
          <div class="modalTitle">
            <img class="redStar" src="@/assets/images/required.png" alt />密码:
          </div>
          <Input placeholder="请输入" class="modalInput" v-model="memberInfo.password" />
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
import { accountApi } from "@/api";
export default {
  data() {
    return {
      total: 100,
      memberModal: false,
      currentPage: 1,
      pageSize: 10,
      columns: [
        {
          type: "index",
          width: 100,
          align: "center",
          title: "序号",
          indexMethod: row => {
            return row._index + 1 + this.pageSize * this.currentPage - this.pageSize;
          }
        },
        {
          title: "真实姓名",
          key: "name",
          align: "center"
        },
        {
          title: "手机号",
          key: "mobile",
          align: "center"
        },
        {
          title: "邮箱",
          key: "email",
          align: "center"
        },
        {
          title: "用户密码",
          key: "password",
          align: "center"
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
      userList: [],
      memberInfo: {},
      editId: "",
      click: true
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      accountApi
        .getUserList({
          per_page: this.pageSize,
          page: this.currentPage
        })
        .then(data => {
          this.userList = data.data.data.data;
          this.total = data.data.data.count;
        });
    },
    toEdit(index) {
      this.memberModal = true;
      let member = this.userList[index];
      this.editId = member._id.$oid;
      let tmp = {
        name: member.name,
        mobile: member.mobile,
        password: member.password,
        email: member.email
      };
      this.memberInfo = tmp;
    },
    addMember() {
      this.memberModal = true;
    },
    changeStatus(index) {
      this.userList[index].status = !this.userList[index].status;
      accountApi.changeUserStatus(this.userList[index]._id.$oid).then(data => {
        if (data.data.code === 200) {
          this.$Message.success("修改成功");
          this.getUserList();
        } else {
          this.$Message.error("修改失败");
          this.userList[index].status = !this.userList[index].status;
        }
      });
    },
    changePage(e) {
      this.currentPage = e;
      this.getUserList();
    },
    changePageSize(e) {
      this.pageSize = e;
      this.getUserList();
    },
    confirm() {
      if (!this.memberInfo.name) {
        this.$Message.warning("名称未填写");
        return;
      }
      if (
        !this.memberInfo.mobile ||
        !/^1[3456789]\d{9}$/.test(this.memberInfo.mobile)
      ) {
        this.$Message.warning("手机号错误");
        return;
      }
      if (
        !this.memberInfo.email ||
        !/^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/.test(
          this.memberInfo.email
        )
      ) {
        this.$Message.warning("邮箱错误");
        return;
      }
      if (!this.memberInfo.password) {
        this.$Message.warning("密码未填写");
        return;
      }
      if (this.click) {
        this.click = false;
        if (this.editId) {
          let data = {
            id: this.editId,
            ...this.memberInfo
          };
          accountApi
            .modifyUser(data)
            .then(data => {
              if (data.data.code === 200) {
                this.$Message.success("创建成功");
                this.memberModal = false;
                this.editId = "";
                this.memberInfo = {};
                this.getUserList();
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
        } else {
          let data = {
            ...this.memberInfo
          };
          accountApi
            .createUser(this.memberInfo)
            .then(data => {
              if (data.data.code === 200) {
                this.$Message.success("创建成功");
                this.memberModal = false;
                this.memberInfo = {};
                this.getUserList();
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
    close() {
      this.memberModal = false;
      this.editId = "";
      this.memberInfo = {};
    }
  }
};
</script>

<style lang="less" scoped>
.memberList {
  background: #fff;
  padding: 20px;
  height: 100%;
  .top-part {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
.addMemberModal {
  .modalContent {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .modalTitle {
      width: 80px;
      /* text-align: right; */
      display: flex;
      /* align-items: flex-end; */
      justify-content: flex-end;
    }
    .modalInput {
      width: 300px;
      margin-left: 5px;
    }
  }
}
</style>
