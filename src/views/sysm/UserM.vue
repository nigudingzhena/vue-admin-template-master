<template>
    <div>
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <el-input v-model="searchParameter.uid" placeholder="id" clearable></el-input>
                    <el-input v-model="searchParameter.username" placeholder="用户名" clearable></el-input>
                    <el-button @click="getUserList" type="primary" round>查询</el-button>
                </el-col>
                <el-col :span="4" align="right">
                    <el-button @click="openEditUI(null)" type="success" round>添加用户</el-button>
                </el-col>
            </el-row>
        </el-card>

        <el-card>
            <el-table :data="userList" stripe style="width: 100%">
                <el-table-column label="#" width="180">
                    <template slot-scope="scope">
                        {{ (searchParameter.pageNo - 1) * searchParameter.pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="uid" label="uid" width="180">
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="180">
                </el-table-column>
                <el-table-column prop="roles" label="权限">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button @click="openEditUI(scope.row.uid)" type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button @click="deleteUserInfo(scope.row)" type="danger" icon="el-icon-delete"
                            circle></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>


        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchParameter.pageNo" :page-sizes="[5, 10, 15, 20]" :page-size="searchParameter.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 添加用户对话框 -->
        <el-dialog @close="clearForm" :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="userInfoForm" :rules="rules" ref="userInfoFormRef">
                <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
                    <el-input v-model="userInfoForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password" :label-width="formLabelWidth">
                    <el-input type="password" v-model="userInfoForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="roles" :label-width="formLabelWidth">
                    <el-radio-group v-model="userInfoForm.roles">
                        <el-radio label="admin">管理员</el-radio>
                        <el-radio label="owner">业主</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveUserInfo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import userApi from "@/api/userManage"
export default {
    data() {
        return {
            formLabelWidth: '140px',
            userInfoForm: {},
            dialogFormVisible: false,
            title: "",
            total: 0,
            searchParameter: {
                pageSize: 5,
                pageNo: 1,
            },
            userList: [],
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名为3到10个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '密码为6到15个字符', trigger: 'blur' }
                ],
                roles: [
                    { required: true, message: '请选取权限', trigger: 'change' }
                ]
            }
        }
    },
    methods: {
        deleteUserInfo(user) {
            this.$confirm(`是否确认删除${user.username}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                userApi.deleteUserById(user.uid).then(response => {
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                    this.getUserList();
                });

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        saveUserInfo() {//确定按钮
            //确定按钮触发验证表单
            this.$refs.userInfoFormRef.validate((valid) => {
                if (valid) {
                    //提交请求到后台
                    userApi.saveUserInfo(this.userInfoForm).then(response => {
                        //提示成功
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });
                        // 关闭对话框
                        this.dialogFormVisible = false;
                        // 刷新表格
                        this.getUserList();
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        clearForm() {
            this.userInfoForm = {},
                this.$refs.userInfoFormRef.clearValidate();
        },
        openEditUI(uid) {
            if (uid == null) {
                this.title = '添加用户';
            } else {
                this.title = '修改用户';
                userApi.getUserById(uid).then(response => {
                    this.userInfoForm = response.data.user;
                });
            }
            this.dialogFormVisible = true;

        },
        handleSizeChange(pageSize) {
            this.searchParameter.pageSize = pageSize;
            this.getUserList();
        },
        handleCurrentChange(pageNo) {
            this.searchParameter.pageNo = pageNo;
            this.getUserList();
        },
        getUserList() {
            userApi.getUserList(this.searchParameter).then(response => {
                this.userList = response.data.rows;
                this.total = response.data.total;
            });
        },

    },
    created() {
        this.getUserList();
    }


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
