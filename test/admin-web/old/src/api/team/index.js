import request from '@/router/axios'

export function fetchTeamList(query) {
  return request({
    url: '/admin/team/paginate',
    method: 'get',
    params: query
  })
}
export function fetchTeamDetail(id) {
  return request({
    url: `/admin/team/get/${id}`,
    method: 'get',
  })
}

export function addTeam(obj) {
  return request({
    url: '/admin/team/add',
    method: 'post',
    data: obj
  })
}
export function delTeam(id) {
  return request({
    url: '/admin/team/del/' + id,
    method: 'delete'
  })
}

export function getTeamDetail(id) {
  return request({
    url: '/admin/team/get/' + id,
    method: 'get'
  })
}



export function putTeam(obj) {
  return request({
    url: '/admin/team/edit',
    method: 'put',
    data: obj
  })
}
export function putTeamMember(obj, id) {
  return request({
    url: '/admin/team/user/kickout/' + id,
    method: 'delete',
    data: obj
  })
}
export function teamOpportunityList(query) {
  return request({
    url: '/opportunity/opportunity/getNumsByTeamId',
    method: 'get',
    params: query
  })
}
export function teamClueList(query) {
  return request({
    url: '/clue/clue/getNumsByTeamId',
    method: 'get',
    params: query
  })
}
