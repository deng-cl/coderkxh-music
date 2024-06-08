import { http } from "../index"

/**
 * 根据 id 获取对应歌曲详情
 * @param {*} id 歌曲 id
 */
export function getSongDetail(ids){
    return http.get({
        url: "/song/detail",
        data:{ ids }
    })
}

/**
 * 根据 id 获取对应歌曲的歌词
 * @param {*} id 歌曲 id
 */
export function getSongLyric(id){
    return http.get({
        url:"/lyric",
        data: { id }
    })
}

