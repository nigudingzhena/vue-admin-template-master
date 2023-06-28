import request from '@/utils/request'

export default{
  getCosttbBar(year){
    return request({
      url:'/costtb/costtbbar',
      // url:`/user/${id}`,
      method:'get',
      params:{
        year:year,
      }
    })
  },
}