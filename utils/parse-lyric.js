const timeReg = /\[(\d{2}):(\d{2}).(\d{2,3})\]/
export function parseLyrics(lryString){ // -- 歌词解析工具函数
    const lyricInfos = []
    const lyricLines = lryString.split("\n")
    for(const lyricLine of lyricLines){
        const reslut = timeReg.exec(lyricLine)
        if(!reslut) continue
        const minute = reslut[1] * 60 * 1000
        const second = reslut[2] * 1000
        const mSecond = reslut[3].length === 2 ? reslut[3] * 10 : reslut[3] * 1
        const time = minute + second + mSecond
        const text = lyricLine.replace(timeReg,"")
        lyricInfos.push({ time, text })
    }
    return lyricInfos
}



