import { http } from "../index"


export function getMusicBanners(type = 0){ 
    return http.get({ 
        url: "/banner", 
        data: { type } 
    })
}


export function getMusicPlayListDetail(id){
    return http.get({
        url:"/playlist/detail",
        data:{ id }
    })
}


export function getSongMenuList(cat = "全部", limit = 6, offset = 0){ 
    return http.get({
        url: "/top/playlist",
        data:{
            cat, limit, offset
        }
    })
}


export function getSongMenuTags(){
    return http.get({
        url:"/playlist/hot"
    })
}


