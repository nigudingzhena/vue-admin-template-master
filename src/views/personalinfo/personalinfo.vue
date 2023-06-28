<template>
    <div class="personal-info">
        <el-card>
            <el-row>
                <el-col :span="24" align="center">
                    <div style="font-weight: bold; font-size: 32px; margin-top: 20px; margin-bottom: 20px;">个人信息</div>
                </el-col>
            </el-row>
            <el-row class="padding-right150">
                <el-col :span="24" align="left">
                    <el-form :model="personalInfoForm">
                        <el-form-item label="头像:" :label-width="formLabelWidth">
                            <el-avatar :size="65" :src="circleUrl"></el-avatar>
                        </el-form-item>
                        <el-form-item label="用户id:" prop="id" :label-width="formLabelWidth">
                            <el-input :disabled="true" v-model="personalInfoForm.id" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名:" prop="username" :label-width="formLabelWidth">
                            <el-input :disabled="true" v-model="personalInfoForm.username" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="业主名称:" prop="ownername" :label-width="formLabelWidth">
                            <el-input :disabled="true" v-model="personalInfoForm.ownername" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式:" prop="ownerphone" :label-width="formLabelWidth">
                            <el-input :disabled="true" v-model="personalInfoForm.ownerphone" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col>
                    <div style="text-align: right; margin-right: 0">
                        <el-button type="primary" @click="updateInfo">修 改 信 息</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-card>

        <!-- 修改信息对话框 -->
        <el-dialog @close="clearForm" title="修改个人信息" :visible.sync="dialogFormVisible">
            <el-form :model="updatePersonalInfoForm" :rules="rules" ref="updatePersonaInfoFormRef">
                <el-form-item label="业主名称:" prop="ownername" :label-width="formLabelWidth">
                    <el-input v-model="updatePersonalInfoForm.ownername" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系方式:" prop="ownerphone" :label-width="formLabelWidth">
                    <el-input v-model="updatePersonalInfoForm.ownerphone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码:" prop="password" :label-width="formLabelWidth">
                    <el-input v-model="updatePersonalInfoForm.password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInfo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
import personalinfoApi from '@/api/personalinfoManage'
import store from '@/store'

export default {
    data() {
        return {
            rules: {
                ownername: [
                    { required: true, message: '请输入您的姓名', trigger: 'blur' },
                ],
                ownerphone: [
                    { required: true, message: '请输入您的联系电话', trigger: 'blur' },
                    { min: 11, max: 11, message: '联系方式为11个字符', trigger: 'blur' }
                ],
                password: [
                    { required: false, message: '请输入您的姓名', trigger: 'blur' },
                ],
            },
            updatePersonalInfoForm: {
                username: store.getters.name,
            },
            dialogFormVisible: false,
            username: store.getters.name,
            formLabelWidth: '100px',
            personalInfoForm: {},
            circleUrl: "https://img2.baidu.com/it/u=388488455,763753823&fm=253&fmt=auto&app=138&f=JPEG", // Replace this with the actual avatar URL
        };
    },
    methods: {
        saveInfo() {
            this.$refs.updatePersonaInfoFormRef.validate((valid) => {
                if (valid) {
                    //提交请求到后台
                    personalinfoApi.updatePersonalInfo(this.updatePersonalInfoForm).then(response => {
                        //提示成功
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });
                        // 关闭对话框
                        this.dialogFormVisible = false;
                        // 刷新表格
                        this.getPersonalinfoByUserName();
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        clearForm() {
            this.updatePersonalInfoForm = {};
            this.$refs.updatePersonaInfoFormRef.clearValidate();
        },
        updateInfo() {
            personalinfoApi.getPersonalinfoByUserName(this.username).then(response => {
                this.updatePersonalInfoForm = response.data.data;
            });
            this.dialogFormVisible = true;
        },
        getPersonalinfoByUserName() {
            personalinfoApi.getPersonalinfoByUserName(this.username).then(response => {
                this.personalInfoForm = response.data.data;
                // this.houseInfoForm.ownerid=response.data.house.ownerid.toString();
            });
        },
    },
    created() {
        this.getPersonalinfoByUserName();
    },
};
</script>
  
<style scoped>
.personal-info {
    max-width: 900px;
    margin: 0 auto;
}

.padding-right150 .el-input {
    padding-right: 100px;
}


textarea {
    font-size: 1rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
}
</style>
