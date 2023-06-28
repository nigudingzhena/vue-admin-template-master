import request from '@/utils/request'

export default{
  getPayList(searchParameter){
    return request({
      url:'/costtb/paylist',
      method:'get',
      params:{
        pageNo:searchParameter.pageNo,
        pageSize:searchParameter.pageSize,
        username:searchParameter.username,
      }
    })
  },
  updatePay(id){
    var charge={id:id,pay:"已支付"}
    return request({
      url:'/costtb/updatepay',
      method:'put',
      data:charge
    })
  },
  paymentFun(id){
    return request({
      url:'/costtb/payment/'+id,
      // url:`/user/${id}`,
      method:'get'
    })
  },
}