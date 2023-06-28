<template>
    <div>
        <!-- 操作栏 -->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <el-input v-model="searchParameter.parkingname" placeholder="车位名" clearable></el-input>
                    <el-input v-model="searchParameter.ownerid" placeholder="业主id" clearable></el-input>
                    <el-input v-model="searchParameter.licenceplate" placeholder="车牌号" clearable></el-input>
                    <el-input v-model="searchParameter.status" placeholder="出租状态" clearable></el-input>
                    <el-button @click="getParkingList" type="primary" round>查询</el-button>
                </el-col>
                <el-col :span="4" align="right">
                    <el-button @click="openEditUI(null)" type="success" round>添加车位信息</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 结果表 -->
        <el-card>
            <el-table :data="parkingList" stripe style="width: 100%">
                <el-table-column label="#" width="80">
                    <template slot-scope="scope"><!--作用域插槽，获取当前行索引号  -->
                        {{ (searchParameter.pageNo - 1) * searchParameter.pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="id" width="80">
                </el-table-column>
                <el-table-column prop="ownerid" label="业主id" width="80">
                </el-table-column>
                <el-table-column prop="parkingname" label="车位名" width="80">
                </el-table-column>
                <el-table-column prop="licenceplate" label="车牌号" width="100">
                </el-table-column>
                <el-table-column prop="status" label="出租状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status=='已出租'" type="success">已出租</el-tag>
                        <el-tag v-else type="danger">未出租</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button @click="deleteParkingInfo(scope.row)" type="danger" icon="el-icon-delete"
                            circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchParameter.pageNo" :page-sizes="[5, 10, 15, 20]" :page-size="searchParameter.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 添加房屋信息对话框 -->
        <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="parkingInfoForm" :rules="rules" ref="parkingInfoFormRef">
                <el-form-item label="业主id" prop="ownerid" :label-width="formLabelWidth">
                    <el-input v-model="parkingInfoForm.ownerid" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="车位名" prop="parkingname" :label-width="formLabelWidth">
                    <el-input v-model="parkingInfoForm.parkingname" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="车牌号" prop="ownername" :label-width="formLabelWidth">
                    <el-input v-model="parkingInfoForm.licenceplate" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="出租状态" prop="status" :label-width="formLabelWidth">
                    <el-radio-group v-model="parkingInfoForm.status">
                        <el-radio label="已出租">已出租</el-radio>
                        <el-radio label="未出租">未出租</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveParkingInfo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
    
<script>
import parkingApi from '@/api/parkingManage'
export default {
    data() {
        var checkParkingName=(rule,value,callback)=>{
            var reg=/^[A-Z][0-9]{3,4}$/
            if(!reg.test(value)){
                return callback(new Error('房间名格式错误,例如：A1102'));
            }
            callback();
        };
        return {
            formLabelWidth:'130px', 
            parkingInfoForm:{},
            dialogFormVisible:false,
            title:"",
            total: 0,
            searchParameter: {
                pageSize: 5,
                pageNo: 1,
            },
            parkingList: [],
            rules: {
                parkingname: [
                    { required: true, message: '请输入车位名', trigger: 'blur' },
                    { validator:checkParkingName,trigger: 'blur' }
                ],

                ownerid: [
                    { required: false, message: '请输入业主id', trigger: 'blur' },
                    { min: 1, max: 11, message: '业主id为1到11个字符', trigger: 'blur' }
                ],
                licenceplate: [
                    { required: false, message: '请输入车牌号', trigger: 'blur' },
                    { min: 2, max: 10, message: '业主姓名为2到10个字符', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '请选择出租状态', trigger: 'change' }
                ],
            }
        }
    },
    methods: {
        deleteParkingInfo(parking) {
            this.$confirm(`是否确认删除${parking.parkingname}的信息?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                parkingApi.deleteParkingById(parking.id).then(response => {
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                    this.getParkingList();
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        saveParkingInfo() {//确定按钮
            //确定按钮触发验证表单
            this.$refs.parkingInfoFormRef.validate((valid) => {
                if (valid) {
                    //提交请求到后台
                    parkingApi.saveParkingInfo(this.parkingInfoForm).then(response => {
                        //提示成功
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });
                        // 关闭对话框
                        this.dialogFormVisible = false;
                        // 刷新表格
                        this.getParkingList();
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        clearForm() {
            this.parkingInfoForm = {};
            this.$refs.parkingInfoFormRef.clearValidate();
        },
        handleSizeChange(pageSize) {
            this.searchParameter.pageSize=pageSize;
            this.getParkingList();
        },
        handleCurrentChange(pageNo) {
            this.searchParameter.pageNo=pageNo;
            this.getParkingList();
        },
        getParkingList() {
            parkingApi.getParkingList(this.searchParameter).then(response => {
                this.parkingList = response.data.rows;
                this.total = response.data.total;
            });
            // console.log(this.parkingList);
        },
        openEditUI(id) {
            if (id == null) {
                this.title = '添加车位信息';
            } else {
                this.title = '修改车位信息';
                parkingApi.getParkingById(id).then(response => {
                    this.parkingInfoForm = response.data.parking;
                    this.parkingInfoForm.ownerid=response.data.parking.ownerid.toString();
                });
            }
            this.dialogFormVisible = true;

        },
    },
    created() {
        this.getParkingList();
        // console.log(this.parkingList);
    },
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
    