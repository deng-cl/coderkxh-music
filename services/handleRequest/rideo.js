// -- 对每一个页面的请求进行抽取但对应的一个页面中（网络的分层架构: 方便如果当请求 API 地址发生改变时，不用一个一个页面的去找对应的请求等）

import { http } from "../index"

export function getTopMVList(offset = 0,limit = 20){ // -- 获取视频列表数据
    return http.get({
        url:"/top/mv",
        data:{
            limit,
            offset
        }
    })
}

export function getMVUrl(id){ // -- 获取MV详情的对应视频 url 地址
    return http.get({
        url:"/mv/url",
        data:{ id }
    })
}

export function getMVInfo(mvid){ // -- 获取MV详情的对应视频信息
    return http.get({ 
        url:"/mv/detail",
        data:{ mvid }
    })
}

// export function getMVRelate(id){ // -- 获取MV详情的相关视频信息
//     return http.get({
//         url:"/related/allvideo",
//         data:{ id }
//     })
// }

export function getSimiMV(mvid) {
    return http.get({
        url:"/simi/mv",
        data: { mvid }
    })
}



