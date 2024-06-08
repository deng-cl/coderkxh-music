
import { http } from "../index"

export function getTopMVList(offset = 0,limit = 20){ 
    return http.get({
        url:"/top/mv",
        data:{
            limit,
            offset
        }
    })
}

export function getMVUrl(id){ 
    return http.get({
        url:"/mv/url",
        data:{ id }
    })
}

export function getMVInfo(mvid){ 
    return http.get({ 
        url:"/mv/detail",
        data:{ mvid }
    })
}



export function getSimiMV(mvid) {
    return http.get({
        url:"/simi/mv",
        data: { mvid }
    })
}



