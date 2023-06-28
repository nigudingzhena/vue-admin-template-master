import request from '@/utils/request'

export default{
    getParkingList(searchParameter){
    return request({
      url:'/parking/parkinglist',
      method:'get',
      params:{
        pageNo:searchParameter.pageNo,
        pageSize:searchParameter.pageSize,
        parkingname:searchParameter.parkingname,
        licenceplate:searchParameter.licenceplate,
        status:searchParameter.status,
        ownerid:searchParameter.ownerid
      }
    })
  },
  addParking(parking){
    return request({
      url:'/parking',
      method:'post',
      data:parking
    })
  },
  updateParking(parking){
    return request({
      url:'/parking',
      method:'put',
      data:parking
    })
  },
  saveParkingInfo(parking){
    if(parking.id==null&&parking.id==undefined)  {
      return this.addParking(parking);
    }
    return this.updateParking(parking);
  },
  getParkingById(id){
    return request({
      url:'/parking/'+id,
      // url:`/user/${id}`,
      method:'get'
    })
  },
  deleteParkingById(id){
    return request({
      url:'/parking/'+id,
      // url:`/user/${id}`,
      method:'delete'
    })
  },

}