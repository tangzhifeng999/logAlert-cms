
<template>
    <div class="homeTable">
        <div >
            <!-- <p style="font-size: 15px" >请选择统计月份:</p> -->
            <DatePicker 
                size="large" 
                type="month" 
                format="yyyy.MM" 
                placeholder="请选择统计月份" 
                :value="selectMonth"
                @on-change="selectChange"
                @on-clickoutside="getHomeInfo"
                style="width: 200px"
                ></DatePicker>
        </div>
        <div class="tableHeader">{{tableInfo}}</div>
        <div class="tableComments">表格参数说明：A代表apilog类型的日志，N代表nginx-access类型的日志。</div>
        <Table :loading="loading" stripe :columns="titleList" :data="dataList"></Table>
    </div>
</template>
<script>
import {homeApi} from "@/api";
    export default {
        data () {
            return {
                titleList: [
                    {
                        title: '项目名称',
                        key: 'name',
                        align: "center"
                    },
                    {
                        title: '项目代号',
                        key: 'app',
                        align: "center"
                    },
                    {
                        title: '告警总数',
                        key: 'total_num',
                        align: "center"
                    },
                    {
                        title: 'A/N告警数',
                        key: 'A/N_total_num',
                        align: "center"
                    },
                    {
                        title: 'A/N完成数',
                        key: 'A/N_solve_num',
                        align: "center"
                    },
                    {
                        title: 'A/N未完成数',
                        key: 'A/N_not_solve_num',
                        align: "center"
                    },
                    {
                        title: 'A/N完成率',
                        key: 'A/N_solve_num_per',
                        align: "center"
                    },
                    {
                        title: '总完成率',
                        key: 'total_per',
                        align: "center"
                    }
                ],
                dataList: [],
                tableInfo: '',
                selectMonth:'',
                loading: true
            }
        },
        mounted() {
            // let data={
            //         selectMonth: this.selectMonth
            //         };
            this.getHomeInfo();
        },
        methods: {
            selectChange(e) {
                // console.log(e)
                this.selectMonth=e
                this.getHomeInfo()
            },
            getHomeInfo() {
                let data={
                    selectMonth: this.selectMonth
                    };
                homeApi
                .getHomeInfo(data)
                .then(data => {
                    this.tableInfo = data.data.data.title;
                    this.dataList = data.data.data.data;
                    this.loading = false;
                });
            },
        }
    }
</script>

<style lang="less" scoped>
    .tableHeader {
        font-size: 26px;
        text-align: center
    }
    .tableComments{
        font-size: 13px;
        color: red;
        // padding-left: 40px;

    }
</style>