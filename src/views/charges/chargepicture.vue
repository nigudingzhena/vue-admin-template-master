<template>
    <div>
        <div class="block" align="right">
            <span class="demonstration">年</span>
            <el-date-picker @change="getBarData" v-model="year" type="year" placeholder="选择年">
            </el-date-picker>
            <!-- <el-button @click="aaaaa" type="primary" round>查询</el-button> -->
        </div>
        <div class="echart" id="mychart" :style="{ float: 'left', width: '100%', height: '400px' }"></div>

    </div>
</template>
  
<script>
import * as echarts from "echarts";
import chargepictureApi from '@/api/chargepicture'
export default {
    data() {
        return {
            year: '2023',
            yDataYPay: [],//纵坐标数据，与横坐标对应
            yDataNPay: [], //纵坐标数据，与横坐标对应
            xData: [] // 在这里声明和初始化 xData
            // xData: ["2020-02", "2020-03", "2020-04", "2020-05"], //横坐标数据
            // yData: [30, 132, 80, 134] //纵坐标数据，与横坐标对应
        };
    },
    mounted() {
        this.chart = echarts.init(document.getElementById('mychart'));
    },
    created() {
        this.getBarData();
    },
    // created() {
    //     this.getBarData();
    //     console.log(this.xData, "cccccc");
    // },
    methods: {
        aaaaa() {
            alert(new Date(this.year))
        },
        // getBarData() {
        //     chargepictureApi.getCosttbBar(this.year).then(response => {
        //         this.xData = [1,2,3];
        //         this.yDataYPay = response.data.ypay;
        //         this.yDataNPay = response.data.npay;
        //         console.log(response.data.month,
        //         response.data.npay);

        //     });
        //     // alert( this.xData);
        // },

        getBarData() {
            this.year = new Date(this.year).getFullYear().toString();
            chargepictureApi.getCosttbBar(this.year).then(response => {
                this.xData = response.data.month;
                this.yDataYPay = response.data.ypay;
                this.yDataNPay = response.data.npay;
                // this.year=this.year.toString();

                // 数据更新后，重新绘制图表
                this.updateChart();
            });
        },
        // getBarData() {
        //     chargepictureApi.getCosttbBar(this.year).then(response => {
        //         this.xData = response.data.month;
        //         this.yDataYPay = response.data.ypay;
        //         this.yDataNPay = response.data.npay;
        //         this.initEcharts();
        //         console.log(this.yDataYPay + "this.yDataYPay");
        //     }).catch(error => {
        //         console.error(error);
        //     });

        // },

        // getBarData() {
        //     chargepictureApi.getCosttbBar(this.year).then(response => {
        //         this.xData = response.data.month;
        //         console.log(this.xData,"aaaaa");
        //     });
        //     console.log(this.xData,"bbbbb");
        // },
        updateChart() {
            this.chart.setOption({
                title: {
                    text: '是否缴费人员数量柱状图'
                },
                legend: {
                    data: ['已支付', '未支付']
                },
                xAxis: {
                    name: '月份',
                    type: 'category',
                    data: this.xData,
                    axisLine: {
                        symbol: ['none', 'arrow'],

                    }
                },
                yAxis: {
                    type: 'value',
                    interval: 1,
                    axisLine: {
                        show: true,
                        symbol: ['none', 'arrow'],

                    }
                },
                series: [
                    {
                        type: 'bar',
                        name: '已支付',
                        data: this.yDataYPay,
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c}'
                        }
                    },
                    {
                        type: 'bar',
                        name: '未支付',
                        data: this.yDataNPay,
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c}',
                        }
                    }
                ]
            });
        }
        // initEcharts() {
        //     const option = {
        //         title: {
        //             text: "ECharts 入门示例"
        //         },
        //         tooltip: {},
        //         legend: {
        //             data: ["已支付", "未支付"]
        //         },
        //         xAxis: {
        //             data: this.xData,
        //         },
        //         yAxis: {},
        //         series: [
        //             {
        //                 name: "已支付",
        //                 type: "bar", //类型为柱状图
        //                 data: this.yDataYPay,
        //             },
        //             {
        //                 name: "未支付",
        //                 type: "bar", //类型为柱状图
        //                 data: this.yDataNPay,
        //             },

        //         ]
        //     };
        //     const myChart = echarts.init(document.getElementById("mychart"));// 图标初始化
        //     myChart.setOption(option);// 渲染页面
        //     //随着屏幕大小调节图表
        //     window.addEventListener("resize", () => {
        //         myChart.resize();
        //     });
        // }
    }
};
</script>
    
<style></style>