import { http } from "../index"


export function getSongDetail(ids){
    return http.get({
        url: "/song/detail",
        data:{ ids }
    })
}


export function getSongLyric(id){
    return http.get({
        url:"/lyric",
        data: { id }
    })
}

