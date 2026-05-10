import request from '@/router/axios'
/**
 * 名片
 */
export function getCarduserList(data) {
    return request({
        url: '/card/web/card/user/paginate',
        method: 'get',
        params: data
    })
}
export function getCardCardList(data, id) {
    return request({
        url: '/card/web/card/paginate/' + id,
        method: 'get',
        params: data
    })
}
export function getCardContacterList(data) {
    return request({
        url: '/card/web/card/contacter/paginate',
        method: 'get',
        params: data
    })
}
export function getContacterDetail(id) {
    return request({
        url: '/card/web/card/contacter/get/' + id,
        method: 'get',
    })
}
export function getCardDetail(id, data) {
    return request({
        url: '/card/web/card/get/' + id,
        method: 'get',
        params: data
    })
}
export function getCardDetailInfo(id) {
    return request({
        url: '/card/web/card/info/' + id,
        method: 'get',
    })
}
export function getRemarkAndTag(id) {
    return request({
        url: '/card/web/card/getRemarkAndTag/' + id,
        method: 'get',
    })
}
export function setRemarkAndTag(data) {
    return request({
        url: '/card/web/card/setRemarkAndTag',
        method: 'post',
        data: data
    })
}
export function editCardDetail(data) {
    return request({
        url: '/card/web/card/edit',
        method: 'put',
        data: data
    })
}
export function addCard(data) {
    return request({
        url: '/card/web/card/add',
        method: 'post',
        data: data
    })
}
export function delCard(id, data) {
    return request({
        url: '/card/web/card/del/' + id,
        method: 'delete',
        params: data
    })
}
export function addContacter(data) {
    return request({
        url: '/card/web/card/contacter/save',
        method: 'post',
        data: data,
    })
}
export function exportContacter(data) {
    return request({
        url: '/card/web/card/contacter/export',
        method: 'get',
        params: data,
        header: {
            headers: {
                "Content-Type": "application/x-download"
            }
        },
        responseType: "blob"
    })
}
export function exportUser(data) {
    return request({
        url: '/card/web/card/user/export',
        method: 'get',
        params: data,
        header: {
            headers: {
                "Content-Type": "application/x-download"
            }
        },
        responseType: "blob"
    })
}
export function getCardUserList() {
    return request({
        url: '/card/web/card/user/list',
        method: 'get',
    })
}
// 名片标签
export function getTagList(data) {
    return request({
        url: '/card/web/card/tag/list',
        method: 'get',
        params: data
    })
}

export function addTags(data) {
    return request({
        url: '/card/web/card/tag/add',
        method: 'post',
        data: data
    })
}
export function editTags(data) {
    return request({
        url: '/card/web/card/tag/edit',
        method: 'put',
        data: data
    })
}
export function delTags(id) {
    return request({
        url: '/card/web/card/tag/del/' + id,
        method: 'delete',
    })
}