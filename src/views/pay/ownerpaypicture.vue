<template>
    <div>
        <div class="block" align="right">
            <span class="demonstration">月</span>
            <el-date-picker @change="getPieData" v-model="month" type="month" placeholder="选择月">
            </el-date-picker>
        </div>
        <el-card>
            <el-row>
                <el-col :span="10">
                    <div ref="chart" style="width: 600px; height: 400px;"></div>
                </el-col>
                <el-col :span="4">
                    总计：{{sum}}
                </el-col>
            </el-row>
        </el-card>

    </div>
</template>
<script>
import paypictureApi from '@/api/paypicture'
import * as echarts from 'echarts';
import moment from 'moment';
import store from '@/store'

export default {
    mounted() {
        // 初始化图表
        this.chart = echarts.init(this.$refs.chart);
        this.chart.setOption(this.option);
    },
    data() {
        return {
            sum:"0",
            value1: [],
            username: store.getters.name,
            month: '2023-03',
            option: {
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    // data: ['电费', '水费', '房租', '管理费']
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center',
                            formatter: '{b} {c}元 ({d}%)',
                        },
                        labelLine: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        data: [

                        ],
                    }
                ]
            }
        };
    },
    created() {
        this.getPieData();
    },
    methods: {
        getPieData() {
            const formattedMonth = moment(this.month).format('YYYY-MM');
            console.log(formattedMonth);
            paypictureApi.getCosttbPie(this.username, formattedMonth).then(response => {

                this.value1 = response.data;
                if (Object.keys(response.data).length === 0) {
                    this.$message({
                        message: response.message,
                        type: 'warning'
                    });
                }
                const data = [
                    { value: this.value1.electric, name: '电费' },
                    { value: this.value1.water, name: '水费' },
                    { value: this.value1.rent, name: '房租' },
                    { value: this.value1.fee, name: '管理费' }
                ];
                this.option.series[0].data = data;
                this.chart.setOption(this.option);
                this.sum=this.value1.electric+this.value1.water+this.value1.rent+this.value1.fee
            });

        },
    },
};
</script>
<style></style>
    







<!-- <template>
    <div>
        <button id="generateBtn" @click="generateQRCode">生成二维码</button>
        <canvas id="qrcodeCanvas" width="256" height="256" @click="decodeQRCode"></canvas>
    </div>
</template>
  
  
<script>
import Qrcode from 'qrcode'
import QrReader from 'qrcode-reader'
import axios from 'axios'

export default {
    data() {
        return {
            qrcodeCanvas: null,
            putUrl: 'http://192.168.1.102:8088/house1'
            // 'http://example.com/upload',
        }
    },
    mounted() {
        const generateBtn = document.getElementById('generateBtn')
        this.qrcodeCanvas = document.getElementById('qrcodeCanvas')
        this.qrReader = new QrReader()
        this.url = 'https://i2.hdslb.com/bfs/face/492cfa8c1e08a7f668790c1fa6750bc029a25235.jpg@96w_96h_1c_1s.webp'

        generateBtn.addEventListener('click', this.generateQRCode)
    },
    methods: {
        aaa() { alert(123); },
        generateQRCode() {
            // this.url = 'http://192.168.1.102:8088/house/houselist?pageNo=1&pageSize=5'
            let opts = {
                errorCorrectionLevel: 'H',
                quality: 1,
                width: 256,
                height: 256,
                text: '二维码',
                color: {
                    dark: '#333333',
                    light: '#fff'
                },

            }

            const putData = {
                // PUT请求所需的数据
                name: 'xxx',
                // ...
            };
            const putUrlWithData = this.putUrl;
            // const putUrlWithData = `${this.putUrl}?${JSON.stringify(putData)}`;
console.log(putUrlWithData);
            Qrcode.toCanvas(this.qrcodeCanvas, putUrlWithData, opts)
            // Qrcode.toCanvas(this.qrcodeCanvas, this.putUrl, opts)
        },
        //     async sendPutRequest() {
        //         const imageData = this.qrcodeCanvas.toDataURL('image/png')
        //         try {
        //             await axios.put(this.putUrl, { imageData })
        //             console.log('Put request sent successfully')
        //         } catch (error) {
        //             console.error('Failed to send put request:', error)
        //         }
        //     },
        // },
        // watch: {
        //     putUrl() {
        //         this.generateQRCode()
        //     }
        //decodeQRCode() {
        //     const ctx = this.qrcodeCanvas.getContext('2d')

        //     ctx.fillStyle = 'red';
        //     ctx.fillRect(0, 0, 50, 50);

        //     console.log(this.qrReader);
        //     this.qrReader
        //         .decodeFromImage(ctx.getImageData(0, 0, 500, 500))
        //         .then((result) => {
        //             this.aaa();
        //             this.$emit('qrCodeScanned', result)
        //         })
        //         .catch((error) => {
        //             console.error('Failed to decode QR code:', error)
        //         })
        //},
    },
}
</script>

 -->
