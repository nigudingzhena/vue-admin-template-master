import request from '@/utils/request'

export default{
  getChargeList(searchParameter){
    return request({
      url:'/costtb/costtblist',
      method:'get',
      params:{
        pageNo:searchParameter.pageNo,
        pageSize:searchParameter.pageSize,
        housename:searchParameter.housename,
        pay:searchParameter.pay,
        month:searchParameter.month
      }
    })
  },
  addCharge(charge){
    return request({
      url:'/costtb',
      method:'post',
      data:charge
    })
  },
  updateCharge(charge){
    return request({
      url:'/costtb',
      method:'put',
      data:charge
    })
  },
  saveChargeInfo(charge){
    if(charge.id==null&&charge.id==undefined)  {
      return this.addCharge(charge);
    }
    return this.updateCharge(charge);
  },
  getChargeById(id){
    return request({
      url:'/costtb/'+id,
      // url:`/user/${id}`,
      method:'get'
    })
  },
  deleteChargeById(id){
    return request({
      url:'/costtb/'+id,
      // url:`/user/${id}`,
      method:'delete'
    })
  },

}