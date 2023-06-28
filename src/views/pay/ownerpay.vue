<template>
    <div>
        <!-- 结果表 -->
        <el-card>
            <el-table :data="payList" stripe style="width: 100%">
                <el-table-column label="#" width="80">
                    <template slot-scope="scope"><!--作用域插槽，获取当前行索引号  -->
                        {{ (searchParameter.pageNo - 1) * searchParameter.pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="缴费id" width="80">
                </el-table-column>
                <el-table-column prop="housename" label="房间名" width="80">
                </el-table-column>
                <el-table-column prop="ownerid" label="业主id" width="80">
                </el-table-column>
                <el-table-column prop="month" label="月份" width="80">
                </el-table-column>
                <el-table-column prop="electric" label="电费（元）" width="100">
                </el-table-column>
                <el-table-column prop="water" label="水费（元）" width="100">
                </el-table-column>
                <el-table-column prop="rent" label="房租（元）" width="100">
                </el-table-column>
                <el-table-column prop="fee" label="管理费（元）" width="110">
                </el-table-column>
                <el-table-column prop="cost" label="总计（元）" width="100">
                </el-table-column>
                <el-table-column prop="pay" label="是否支付" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.pay == '已支付'" type="success">已支付</el-tag>
                        <el-tag v-else type="danger">未支付</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <!-- <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button @click="deleteChargeInfo(scope.row)" type="danger" icon="el-icon-delete"
                            circle></el-button> -->
                        <!-- <el-button v-if="scope.row.pay == '未支付'" @click="payBtn(scope.row.id)" type="primary"
                            round>缴费</el-button> -->
                        <el-button v-if="scope.row.pay == '未支付'" @click="generateQrCode(scope.row.id)" type="primary"
                            round>缴费</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchParameter.pageNo" :page-sizes="[5, 10, 15, 20]" :page-size="searchParameter.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- <div>
            <canvas id="qrcodeCanvas" width="256" height="256" ></canvas>
        </div> -->
        <!-- 二维码弹窗 -->
        <el-dialog width="25%" :before-close="handleClose" :visible.sync="dialogVisible" title="缴费二维码">
            <div class="display">
                <img id="qrcodeimg" v-if="qrCodeImage" :src="qrCodeImage" alt="QR Code" />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!-- <canvas id="qrcodeCanvas" width="256" height="256" ></canvas> -->
    </div>
</template>
    
    
<script>
import store from '@/store'
import payApi from '@/api/payManage'
import qrcode from 'tc-qrcode'
import QRCode from 'qrcode-generator';
export default {
    data() {
        return {
            dialogVisible: false,
            inputValue: "",
            qrCodeImage: "",
            formLabelWidth: '130px',
            payInfoForm: {},
            dialogFormVisible: false,
            title: "",
            total: 0,
            searchParameter: {
                username: store.getters.name,
                pageSize: 5,
                pageNo: 1,
            },
            payList: [],

        }
    },
    // mounted() {
    //     const generateBtn = document.getElementById('generateBtn')
    //     this.qrcodeCanvas = document.getElementById('qrcodeCanvas')
    //     this.qrReader = new QrReader()
    //     generateBtn.addEventListener('click', this.generateQRCode)
    //     // this.url = 'http://192.168.1.102:8088/house1'
    // },
    methods: {
        handleConfirm(){
            this.dialogVisible = false;
            this.getPayList();
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        async generateQrCode(id) {
            const qr = QRCode(10, 'L');
            qr.addData('http://192.168.43.106:8088/costtb/payment/'+id+'');
            qr.make();
            const qrCodeImage = qr.createDataURL(10);
            this.qrCodeImage = qrCodeImage;
            this.dialogVisible = true;
        },
        // generateQRCode() {
        //     // this.$alert('<canvas id="qrcodeCanvas" width="256" height="256" ></canvas>', 'HTML 片段', {
        //     //     dangerouslyUseHTMLString: true
        //     // });

        //     this.url = 'http://192.168.1.102:8088/house1'
        //     let opts = {
        //         errorCorrectionLevel: 'H',
        //         quality: 1,
        //         width: 256,
        //         height: 256,
        //         text: '二维码',
        //         color: {
        //             dark: '#333333',
        //             light: '#fff'
        //         },
        //     };
        //     Qrcode.toCanvas(this.qrcodeCanvas, this.url, opts)
        //     this.dialogVisible=true;
        // },
        payBtn(id) {
            payApi.updatePay(id).then(response => {
                this.$message({
                    message: response.message,
                    type: 'success'
                });
                // 刷新表格
                this.getPayList();
            });
        },
        handleSizeChange(pageSize) { this.searchParameter.pageSize = pageSize; this.getPayList(); },
        handleCurrentChange(pageNo) { this.searchParameter.pageNo = pageNo; this.getPayList(); },
        getPayList() {
            payApi.getPayList(this.searchParameter).then(response => {
                this.payList = response.data.rows;
                this.total = response.data.total;
            });
        },
    },
    created() {
        this.getPayList();
    },

}

</script>

<style>
.display img {
    width: 300px;
    height: 300px;
}

.el-dialog .el-input {
    width: 60%;
}
</style>
    