import request from '@/utils/request'

export default{
  getHouseList(searchParameter){
    return request({
      url:'/house/houselist',
      method:'get',
      params:{
        pageNo:searchParameter.pageNo,
        pageSize:searchParameter.pageSize,
        housename:searchParameter.housename,
        state:searchParameter.state,
        ownerid:searchParameter.ownerid
      }
    })
  },
  addHouse(house){
    return request({
      url:'/house',
      method:'post',
      data:house
    })
  },
  updateHouse(house){
    return request({
      url:'/house',
      method:'put',
      data:house
    })
  },
  saveHouseInfo(house){
    if(house.id==null&&house.id==undefined)  {
      return this.addHouse(house);
    }
    return this.updateHouse(house);
  },
  getHouseById(id){
    return request({
      url:'/house/'+id,
      // url:`/user/${id}`,
      method:'get'
    })
  },
  deleteHouseById(id){
    return request({
      url:'/house/'+id,
      // url:`/user/${id}`,
      method:'delete'
    })
  },

}