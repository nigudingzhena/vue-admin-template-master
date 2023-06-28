<template>
    <div>
        <!-- 操作栏 -->
        <el-card id="search">
            <el-row>
                <el-col :span="20">
                    <el-input v-model="searchParameter.housename" placeholder="房屋名" clearable></el-input>
                    <el-input v-model="searchParameter.ownerid" placeholder="业主id" clearable></el-input>
                    <el-input type="date" v-model="searchParameter.time" placeholder="时间" clearable></el-input>
                    <el-button @click="getMaintenanceList" type="primary" round>查询</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 结果表 -->
        <el-card>
            <el-table :data="maintenanceList" stripe style="width: 100%">
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
                        <el-button v-if="scope.row.status == '待处理'" @click="updateMaintenanceInfo(scope.row.id)" type="primary"
                            round>处理</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchParameter.pageNo" :page-sizes="[5, 10, 15, 20]" :page-size="searchParameter.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>
    

<script>
import maintenanceApi from '@/api/maintenanceManage'
export default {
    data() {
        return {
            formLabelWidth: '130px',
            maintenanceInfoForm: {},
            dialogFormVisible: false,
            title: "",
            total: 0,
            searchParameter: {
                pageSize: 5,
                pageNo: 1,
                // time: new Date().toISOString().slice(0, 10),
                time: '',
            },
            maintenanceList: [],


        }
    },
    methods: {
        updateMaintenanceInfo(id) {
            maintenanceApi.updateMaintenance(id).then(response => {
                this.$message({
                    message: response.message,
                    type: 'success'
                });
                // 刷新表格
                this.getMaintenanceList();
            });
        },
        handleSizeChange(pageSize) {
            this.searchParameter.pageSize = pageSize;
        },
        handleCurrentChange(pageNo) {
            this.searchParameter.pageNo = pageNo;
        },
        getMaintenanceList() {
            maintenanceApi.getMaintenanceList(this.searchParameter).then(response => {
                this.maintenanceList = response.data.rows;
                this.total = response.data.total;
            });
        },
    },
    created() {
        this.getMaintenanceList();
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
    