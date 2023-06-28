<template>
    <div>
        <el-card v-if="roles=='admin'">
            <el-row>
                <el-col align="right">
                    <el-button @click="openEditUI" type="primary" round>新增公告</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-timeline>
            <el-timeline-item v-for="(item, index) in announcementList" :timestamp=item.time placement="top" :key="index">
                <el-card>
                    <el-col :span="20">
                        <h4>{{ item.title }}</h4>
                        <p>{{ item.content }}</p>
                    </el-col>
                    <el-col :span="4" align="center" v-if="roles=='admin'">
                        <el-button @click="deleteAnnouncementInfo(item)" type="danger" round>删除公告</el-button>
                    </el-col>
                </el-card>
            </el-timeline-item>
        </el-timeline>
        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchParameter.pageNo" :page-sizes="[5, 10, 20, 30]" :page-size="searchParameter.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 发布公告对话框 -->
        <el-dialog @close="clearForm" title="发布公告" :visible.sync="dialogFormVisible">
            <el-form :model="announcementInfoForm" :rules="rules" ref="announcementInfoFormRef">
                <el-form-item label="公告标题" prop="title" :label-width="formLabelWidth">
                    <el-input v-model="announcementInfoForm.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content" :label-width="formLabelWidth">
                    <el-input style="width: 80%;" type="textarea" :rows="10" v-model="announcementInfoForm.content" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="日期" prop="time" :label-width="formLabelWidth">
                    <el-input type="date" v-model="announcementInfoForm.time" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="发布人id" prop="adminid" :label-width="formLabelWidth">
                    <el-input v-model="announcementInfoForm.adminid" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAnnouncementInfo">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import store from '@/store'
import announcementApi from '@/api/announcementManage'
export default {
    data() {
        return {
            roles:store.getters.roles,
            rules: {
                title: [
                    { required: true, message: '请输入公告标题', trigger: 'blur' },
                ],
                content: [
                    { required: true, message: '请输入公告内容', trigger: 'blur' },
                ],
                time: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ],
                adminid: [
                    { required: false, message: '请输入管理员id', trigger: 'blur' },
                ],
            },
            formLabelWidth: '130px',
            total:0,
            announcementInfoForm:{
                time:new Date().toISOString().slice(0, 10),
            },
            dialogFormVisible: false,
            announcementList: [],
            searchParameter: {
                pageSize: 5,
                pageNo: 1,
            },
        };
    },
    methods: {
        deleteAnnouncementInfo(item) {
            this.$confirm(`是否确认删除${item.title}的信息?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                announcementApi.deleteAnnouncementById(item.id).then(response => {
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                    this.getAnnouncementList();
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        addAnnouncementInfo(){//确定按钮
            //确定按钮触发验证表单
            this.$refs.announcementInfoFormRef.validate((valid) => {
                if (valid) {
                    //提交请求到后台
                    announcementApi.addAnnouncement(this.announcementInfoForm).then(response => {
                        //提示成功
                        this.$message({
                            message: response.message,
                            type: 'success'
                        });
                        // 关闭对话框
                        this.dialogFormVisible = false;
                        // 刷新表格
                        this.getAnnouncementList();
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        clearForm(){
            this.announcementInfoForm={time:new Date().toISOString().slice(0, 10),};
            this.$refs.announcementInfoFormRef.clearValidate();
        },
        openEditUI() {
            this.dialogFormVisible = true;
        },
        getAnnouncementList() {
            announcementApi.getAnnouncementList(this.searchParameter).then(response => {
                this.announcementList = response.data.rows;
                this.total = response.data.total;
            });
            // console.log(this.announcementList);
        },
        handleSizeChange(pageSize) {
            this.searchParameter.pageSize = pageSize;
            this.getAnnouncementList();
        },
        handleCurrentChange(pageNo) {
            this.searchParameter.pageNo = pageNo;
            this.getAnnouncementList();
        },
        
    },
    created(){
        this.getAnnouncementList();
    },
};
</script>
<style>
.el-dialog .el-input {
    width: 80%;
}
</style>
    