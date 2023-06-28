<template>
    <div>
        <!-- 操作栏 -->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <el-input v-model="searchParameter.housename" placeholder="房屋名" clearable></el-input>
                    <el-input v-model="searchParameter.ownerid" placeholder="业主id" clearable></el-input>
                    <el-input v-model="searchParameter.state" placeholder="出租状态" clearable></el-input>
                    <el-button @click="getHouseList" type="primary" round>查询</el-button>
                </el-col>
                <el-col :span="4" align="right">
                    <el-button @click="openEditUI(null)" type="success" round>添加房屋信息</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 结果表 -->
        <el-card>
            <el-table :data="houseList" stripe style="width: 100%">
                <el-table-column label="#" width="80">
                    <template slot-scope="scope"><!--作用域插槽，获取当前行索引号  -->
                        {{ (searchParameter.pageNo - 1) * searchParameter.pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="id" width="80">
                </el-table-column>
                <el-table-column prop="building" label="栋" width="80">
                </el-table-column>

                <el-table-column prop="housename" label="房间名" width="80">
                </el-table-column>
                <el-table-column prop="ownerid" label="业主id" width="80">
                </el-table-column>
                <el-table-column prop="ownername" label="业主名称" width="80">
                </el-table-column>
                <el-table-column prop="ownerphone" label="联系方式" width="120">
                </el-table-column>
                <el-table-column prop="areas" label="房屋面积" width="80">
                </el-table-column>
                <el-table-column prop="rent" label="月租" width="80">
                </el-table-column>
                <el-table-column prop="state" label="出租状态" width="80">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.state=='已出租'" type="success">已出租</el-tag>
                        <el-tag v-else type="danger">未出租</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="remarks" label="备注">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button @click="deleteHouseInfo(scope.row)" type="danger" icon="el-icon-delete"
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
            <el-form :model="houseInfoForm" :rules="rules" ref="houseInfoFormRef">
                <el-form-item label="栋" prop="building" :label-width="formLabelWidth">
                    <el-input v-model="houseInfoForm.building" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="房间名" prop="housename" :label-width="formLabelWidth">
                    <el-input v-model="houseInfoForm.housename" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="业主id" prop="ownerid" :label-width="formLabelWidth">
                    <el-input v-model="houseInfoForm.ownerid" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="业主名称" prop="ownername" :label-width="formLabelWidth">
                    <el-input v-model="houseInfoForm.ownername" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="ownerphone" :label-width="formLabelWidth">
                    <el-input v-model="houseInfoForm.ownerphone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="房屋面积" prop="areas" :label-width="formLabelWidth">
                    <el-input v-model="houseInfoForm.areas" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="月租" prop="rent" :label-width="formLabelWidth">
                    <el-input v-model="houseInfoForm.rent" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="出租状态" prop="state" :label-width="formLabelWidth">
                    <el-radio-group v-model="houseInfoForm.state">
                        <el-radio label="已出租">已出租</el-radio>
                        <el-radio label="未出租">未出租</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remarks" :label-width="formLabelWidth">
                    <el-input v-model="houseInfoForm.remarks" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveHouseInfo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
    
<script>
import houseApi from '@/api/houseManage'
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
            houseInfoForm:{},
            dialogFormVisible:false,
            title:"",
            total: 0,
            searchParameter: {
                pageSize: 5,
                pageNo: 1,
            },
            houseList: [],
            rules: {
                building: [
                    { required: true, message: '请输入该房屋属于哪栋', trigger: 'blur' },
                    { min: 1, max: 1, message: '请输入一个字符', trigger: 'blur' }
                ],
                housename: [
                    { required: true, message: '请输入房间名', trigger: 'blur' },
                    { validator:checkHouseName,trigger: 'blur' }
                ],

                ownerid: [
                    { required: false, message: '请输入业主id', trigger: 'blur' },
                    { max: 11, message: '业主id为1到11个字符', trigger: 'blur' }
                ],
                ownername: [
                    { required: false, message: '请输入业主姓名', trigger: 'blur' },
                    { min: 2, max: 10, message: '业主姓名为2到10个字符', trigger: 'blur' }
                ],
                ownerphone: [
                    { required: false, message: '请输入联系方式', trigger: 'blur' },
                    { min: 11, max: 11, message: '联系方式为11个字符', trigger: 'blur' }
                ],
                areas: [
                    { required: true, message: '请输入房屋面积', trigger: 'blur' },
                ],
                rent: [
                    { required: true, message: '请输入月租', trigger: 'blur' },
                ],

                state: [
                    { required: true, message: '请选择出租状态', trigger: 'change' }
                ],
                remarks: [
                    { required: false, message: '请输入备注', trigger: 'blur' },
                    { max: 500, message: '不能超过500个字符', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        deleteHouseInfo(house) {
            this.$confirm(`是否确认删除${house.housename}的信息?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                houseApi.deleteHouseById(house.id).then(response => {
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                    this.getHouseList();
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        saveHouseInfo() {//确定按钮
            //确定按钮触发验证表单
            this.$refs.houseInfoFormRef.validate((valid) => {
                if (valid) {
                    //提交请求到后台
                    houseApi.saveHouseInfo(this.houseInfoForm).then(response => {
                        //提示成功
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });
                        // 关闭对话框
                        this.dialogFormVisible = false;
                        // 刷新表格
                        this.getHouseList();
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        clearForm() {
            this.houseInfoForm = {};
            this.$refs.houseInfoFormRef.clearValidate();
        },
        handleSizeChange(pageSize) {
            this.searchParameter.pageSize=pageSize;
            this.getHouseList();
        },
        handleCurrentChange(pageNo) {
            this.searchParameter.pageNo=pageNo;
            this.getHouseList();
        },
        getHouseList() {
            houseApi.getHouseList(this.searchParameter).then(response => {
                this.houseList = response.data.rows;
                this.total = response.data.total;
            });
            // console.log(this.houseList);
        },
        openEditUI(id) {
            if (id == null) {
                this.title = '添加房屋信息';
            } else {
                this.title = '修改房屋信息';
                houseApi.getHouseById(id).then(response => {
                    this.houseInfoForm = response.data.house;
                    this.houseInfoForm.ownerid=response.data.house.ownerid.toString();
                });
            }
            this.dialogFormVisible = true;

        },
    },
    created() {
        this.getHouseList();
        // console.log(this.houseList);
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
    