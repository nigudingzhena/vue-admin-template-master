import request from '@/utils/request'

export default {
  getPersonalinfoByUserName(username){
    return request({
      url:'/user/personalinfo/'+username,
      // url:`/user/${id}`,
      method:'get'
    })
  },
  updatePersonalInfo(personalinfo){
    return request({
      url:'/user/personalinfo',
      method:'put',
      data:personalinfo
    })
  },
}