import request from '@/utils/request'

export default{
  getUserList(searchParameter){
    return request({
      url:'/user/userlist',
      method:'get',
      params:{
        pageNo:searchParameter.pageNo,
        pageSize:searchParameter.pageSize,
        username:searchParameter.username,
        uid:searchParameter.uid
      }
    })
  },
  addUser(user){
    return request({
      url:'/user',
      method:'post',
      data:user
    })
  },
  updateUser(user){
    return request({
      url:'/user',
      method:'put',
      data:user
    })
  },
  saveUserInfo(user){
    if(user.uid==null&&user.uid==undefined)  {
      return this.addUser(user);
    }
    return this.updateUser(user);
  },
  getUserById(uid){
    return request({
      url:'/user/'+uid,
      // url:`/user/${id}`,
      method:'get'
    })
  },
  deleteUserById(uid){
    return request({
      url:'/user/'+uid,
      // url:`/user/${id}`,
      method:'delete'
    })
  },

}