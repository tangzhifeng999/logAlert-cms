<template>
  <div class="dealRecord">
    <Timeline>
      <TimelineItem v-for="(item,index) in dealRecord" :key="index">
        <p class="time">{{item.time}}</p>
        <p class="content">{{item.name}}</p>
        <p class="content">tag:{{item.tag}}</p>
        <p class="content" v-if="item.note">note:{{item.note}}</p>
      </TimelineItem>
    </Timeline>
  </div>
</template>

<script>
import { alertApi } from '@/api'
export default {
  data () {
    return {
      id: '',
      dealRecord:[]
    }
  },
  mounted () {
    this.id = this.$route.query.id
    this.getLogRecord()
  },
  methods: {
    getLogRecord () {
      let data = {
        id: this.id
      }
      alertApi.getLogRecord(data).then(data => {
        this.dealRecord=data.data.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
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
</style>
