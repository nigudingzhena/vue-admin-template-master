import request from '@/utils/request'

export default {
    getAnnouncementList(searchParameter) {
        return request({
            url: '/announcement/announcementlist',
            method: 'get',
            params: {
                pageNo: searchParameter.pageNo,
                pageSize: searchParameter.pageSize,
            }
        })
    },
    addAnnouncement(announcement){
        return request({
          url:'/announcement',
          method:'post',
          data:announcement
        })
      },
      deleteAnnouncementById(id){
        return request({
          url:'/announcement/'+id,
          // url:`/user/${id}`,
          method:'delete'
        })
      },
}