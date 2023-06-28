import request from '@/utils/request'

export default{
  getCosttbPie(username,month){
    return request({
      url:'/costtb/costtbpie',
      // url:`/user/${id}`,
      method:'get',
      params:{
        month:month,
        username:username,
      }
    })
  },
}