import request from '@/utils/request'

export default {
    getMaintenanceList(searchParameter) {
        return request({
            url: '/complaints/maintenance',
            method: 'get',
            params: {
                pageNo: searchParameter.pageNo,
                pageSize: searchParameter.pageSize,
                housename: searchParameter.housename,
                time: searchParameter.time,
                ownerid: searchParameter.ownerid
            }
        })
    },
    updateMaintenance(id){
        var complaints={id:id,status:"已解决"}
        return request({
          url:'/complaints',
          method:'put',
          data:complaints
        })
      },

}