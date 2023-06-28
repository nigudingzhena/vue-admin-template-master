import request from '@/utils/request'

export default{
  getOwnerComplaintsList(searchParameter){
    return request({
      url:'/complaints/ownercomplaintslist',
      method:'get',
      params:{
        pageNo:searchParameter.pageNo,
        pageSize:searchParameter.pageSize,
        username:searchParameter.username,
      }
    })
  },

  saveComplaintsInfo(complaints){
    return request({
      url:'/complaints',
      method:'post',
      data:complaints
    })
  },
  deleteComplaintsById(id){
    return request({
      url:'/complaints/'+id,
      // url:`/user/${id}`,
      method:'delete'
    })
  },
}