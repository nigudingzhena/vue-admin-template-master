<template>
    <div>
        <!-- 操作栏 -->
        <el-card id="search">
            <el-row>
                <el-col align="right">
                    <el-button @click="openEditUI" type="primary" round>添加投诉信息</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 结果表 -->
        <el-card>
            <el-table :data="complaintsList" stripe style="width: 100%">
                <el-table-column label="#" width="80">
                    <template slot-scope="scope"><!--作用域插槽，获取当前行索引号  -->
                        {{ (searchParameter.pageNo - 1) * searchParameter.pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="id" width="100">
                </el-table-column>
                <el-table-column prop="ownerid" label="业主id" width="100">
                </el-table-column>
                <el-table-column prop="housename" label="房间名" width="120">
                </el-table-column>
                <el-table-column prop="content" label="内容" width="140">
                </el-table-column>
                <el-table-column prop="time" label="日期" width="120">
                </el-table-column>
                <el-table-column prop="status" label="处理状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == '待处理'" type="warning">待处理</el-tag>
                        <el-tag v-else type="success">已解决</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button @click="deleteComplaintsInfo(scope.row)" type="danger" icon="el-icon-delete"
                            circle>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchParameter.pageNo" :page-sizes="[5, 10, 15, 20]" :page-size="searchParameter.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 添加投诉信息对话框 -->
        <el-dialog @close="clearForm" title="添加投诉信息" :visible.sync="dialogFormVisible">
            <el-form :model="complaintsInfoForm" :rules="rules" ref="complaintsInfoFormRef">
                <el-form-item label="业主id" prop="ownerid" :label-width="formLabelWidth">
                    <el-input v-model="complaintsInfoForm.ownerid" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="房间名" prop="housename" :label-width="formLabelWidth">
                    <el-input v-model="complaintsInfoForm.housename" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content" :label-width="formLabelWidth">
                    <el-input v-model="complaintsInfoForm.content" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="日期" prop="time" :label-width="formLabelWidth">
                    <el-input type="date" v-model="complaintsInfoForm.time" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="处理状态" prop="status" :label-width="formLabelWidth">
                    <el-radio-group v-model="complaintsInfoForm.status">
                        <el-radio label="待处理">待处理</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveComplaintsInfo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
    
<script>

import store from '@/store'
import complaintsApi from '@/api/complaintsManage'


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
            complaintsInfoForm: {
                status: '待处理',
                time:new Date().toISOString().slice(0, 10)
            },
            formLabelWidth: '130px',
            dialogFormVisible: false,
            total: 0,
            complaintsList: [],
            searchParameter: {
                pageSize: 5,
                pageNo: 1,
                username: store.getters.name,
            },
            rules:{
                ownerid:[
                { required: true, message: '请输入业主id', trigger: 'blur' },
                ],
                housename:[
                { required: true, message: '请输入房间名', trigger: 'blur' },
                { validator:checkHouseName,trigger: 'blur' },
                ],
                content:[
                { required: true, message: '请输入内容', trigger: 'blur' },
                ],
                time:[
                { required: true, message: '请输入时间', trigger: 'blur' },
                ],
                status:[
                { required: true, message: '请选择状态', trigger: 'blur' },
                ],

            },

        };
    },
    methods: {
        deleteComplaintsInfo(complaints) {
            this.$confirm(`是否确认删除id=${complaints.id}的信息?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                complaintsApi.deleteComplaintsById(complaints.id).then(response => {
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                    this.getComplaintsList();
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        openEditUI() {
            this.dialogFormVisible = true;
        },
        handleSizeChange(pageSize) {
            this.searchParameter.pageSize = pageSize;
        },
        handleCurrentChange(pageNo) {
            this.searchParameter.pageNo = pageNo;
        },
        getComplaintsList() {
            complaintsApi.getOwnerComplaintsList(this.searchParameter).then(response => {
                this.complaintsList = response.data.rows;
                this.total = response.data.total;
            });
        },
        clearForm(){
            this.complaintsInfoForm={
                status: '待处理',
                time:new Date().toISOString().slice(0, 10),
            };
            this.$refs.complaintsInfoFormRef.clearValidate();
        },
        saveComplaintsInfo() {//确定按钮
            //确定按钮触发验证表单
            this.$refs.complaintsInfoFormRef.validate((valid) => {
                if (valid) {
                    //提交请求到后台
                    complaintsApi.saveComplaintsInfo(this.complaintsInfoForm).then(response => {
                        //提示成功
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });
                        // 关闭对话框
                        this.dialogFormVisible = false;
                        // 刷新表格
                        this.getComplaintsList();
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    },
    created() {
        this.getComplaintsList();
    },

}

</script>

<style>
.el-dialog .el-input {
    width: 80%;
}
</style>
    