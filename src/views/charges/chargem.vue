<template>
    <div>
        <!-- 操作栏 -->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <el-input type="month" v-model="searchParameter.month" placeholder="月份"></el-input>
                    <el-input v-model="searchParameter.housename" placeholder="房间名"></el-input>
                    <el-input v-model="searchParameter.pay" placeholder="是否支付？"></el-input>
                    <el-button @click="getChargeList" type="primary" round>查询</el-button>
                </el-col>
                <el-col :span="4" align="right">
                    <el-button @click="openEditUI(null)" type="success" round>收费</el-button>
                </el-col>
            </el-row>

        </el-card>

        <!-- 结果表 -->
        <el-card>
            <el-table :data="costList" stripe style="width: 100%">
                <el-table-column label="#" width="80">
                    <template slot-scope="scope"><!--作用域插槽，获取当前行索引号  -->
                        {{ (searchParameter.pageNo - 1) * searchParameter.pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="id" width="80">
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
                        <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button @click="deleteChargeInfo(scope.row)" type="danger" icon="el-icon-delete"
                            circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchParameter.pageNo" :page-sizes="[5, 10, 15, 20]"
            :page-size="searchParameter.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 添加收费信息对话框 -->
        <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="chargeInfoForm" :rules="rules" ref="chargeInfoFormRef">
                <el-form-item label="房间名" prop="housename" :label-width="formLabelWidth">
                    <el-input v-model="chargeInfoForm.housename" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="业主id" prop="ownerid" :label-width="formLabelWidth">
                    <el-input v-model="chargeInfoForm.ownerid" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="月份" prop="month" :label-width="formLabelWidth">
                    <el-input type="month" v-model="chargeInfoForm.month" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电费（元）" prop="electric" :label-width="formLabelWidth">
                    <el-input min="0" type="number" @input="sum" v-model="chargeInfoForm.electric" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="水费（元）" prop="water" :label-width="formLabelWidth">
                    <el-input min="0" type="number" @input="sum" v-model="chargeInfoForm.water" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="房租（元）" prop="rent" :label-width="formLabelWidth">
                    <el-input min="0" type="number" @input="sum" v-model="chargeInfoForm.rent" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="管理费（元）" prop="fee" :label-width="formLabelWidth">
                    <el-input min="0" type="number" @input="sum" v-model="chargeInfoForm.fee" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="总计（元）" prop="cost" :label-width="formLabelWidth">
                    <el-input min="0" type="number" :disabled="true" v-model="chargeInfoForm.cost" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否支付" prop="pay" :label-width="formLabelWidth">
                    <el-radio-group v-model="chargeInfoForm.pay">
                        <el-radio label="已支付">已支付</el-radio>
                        <el-radio label="未支付">未支付</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remarks" :label-width="formLabelWidth">
                    <el-input v-model="chargeInfoForm.remarks" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveChargeInfo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import chargeApi from '@/api/chargeManage'
export default {
    data() {
        var checkHouseName=(rule,value,callback)=>{
            var reg=/^[A-Z][0-9]{3,4}$/
            if(!reg.test(value)){
                return callback(new Error('房间名格式错误,例如：A1102'));
            }
            callback();
        };
        return {
            formLabelWidth:'130px', 
            chargeInfoForm:{},
            dialogFormVisible:false,
            title:"",
            total:0,
            searchParameter: {
                pageSize: 5,
                pageNo: 1,
            },
            costList: [],
            rules: {
                housename: [
                    { required: true, message: '请输入房间名', trigger: 'blur' },
                    { validator:checkHouseName,trigger: 'blur' }
                ],

                ownerid: [
                    { required: true, message: '请输入业主id', trigger: 'blur' },
                    { min: 1, max: 11, message: '业主id为1到11个字符', trigger: 'blur' }
                ],
                month: [
                    { required: true, message: '请输入月份', trigger: 'blur' },
                ],
                electric: [
                    { required: true, message: '请输入电费', trigger: 'blur' },
                ],
                water: [
                    { required: true, message: '请输入水费', trigger: 'blur' },
                ],
                rent: [
                    { required: true, message: '请输入房租', trigger: 'blur' },
                ],
                fee: [
                    { required: true, message: '请输入管理费', trigger: 'blur' },
                ],
                pay: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                remarks: [
                    { required: false, message: '请输入备注', trigger: 'blur' },
                    { max: 500, message: '不能超过500个字符', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        deleteChargeInfo(change) {
            this.$confirm(`是否确认删除id:${change.id}的记录?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                chargeApi.deleteChargeById(change.id).then(response => {
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                    this.getChargeList();
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        saveChargeInfo(){//确定按钮
            //确定按钮触发验证表单
            this.$refs.chargeInfoFormRef.validate((valid) => {//valid是验证结果,回调函数
                if (valid) {
                    //提交请求到后台
                    chargeApi.saveChargeInfo(this.chargeInfoForm).then(response => {
                        //提示成功
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });
                        // 关闭对话框
                        this.dialogFormVisible = false;
                        // 刷新表格
                        this.getChargeList();
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        sum() {
            this.chargeInfoForm.cost = Number(this.chargeInfoForm.electric) + Number(this.chargeInfoForm.water)
                + Number(this.chargeInfoForm.rent) + Number(this.chargeInfoForm.fee)
        },
        handleSizeChange(pageSize) {
            this.searchParameter.pageSize=pageSize;
            this.getChargeList();
        },
        handleCurrentChange(pageNo) {
            this.searchParameter.pageNo=pageNo;
            this.getChargeList();
        },
        getChargeList(){chargeApi.getChargeList(this.searchParameter).then(response=>{
            this.costList=response.data.rows;
            this.total=response.data.total;
        })},
        clearForm() {
            this.chargeInfoForm = {};
            this.$refs.chargeInfoFormRef.clearValidate();
        },
        openEditUI(id) {
            if (id == null) {
                this.title = '添加收费信息';
            } else {
                this.title = '修改收费信息';
                chargeApi.getChargeById(id).then(response => {
                    this.chargeInfoForm = response.data.costtb;
                    // this.houseInfoForm.ownerid=response.data.house.ownerid.toString();
                    this.chargeInfoForm.ownerid=response.data.costtb.ownerid.toString();
                });
            }
            this.dialogFormVisible = true;

        },
    },
    created(){this.getChargeList();},

}
</script>

<style>
#search .el-input {
    width: 200px;
    margin-right: 10px;
}

.el-dialog .el-input {
    width: 60%;
}
</style>