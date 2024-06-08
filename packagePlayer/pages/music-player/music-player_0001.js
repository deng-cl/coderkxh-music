import { getSongDetail, getSongLyric } from "../../services/handleRequest/player"
import { playingStore } from "../../stores/playingStore"
import { parseLyrics } from "../../utils/parse-lyric"

const app = getApp()
const audioContext = wx.createInnerAudioContext() // -- 创建内部 audio 播放器

Page({
    data:{
        id: -1,
        pageTitles:["歌曲","歌词"],
        
        currentSong: {}, // -- 歌曲详情
        lyricInfos: [], // -- 歌词
        currentLyricText: "", // -- 当前行歌词
        currentLyricIndex: -1, // -- 当前行索引: 用于优化匹配歌词的重复执行...
        
        currentPage:0, // -- 当前页（歌曲/歌词）
        contentHeight: 500, // -- 动态决定该页的 content 内容的高度（设备总高度去statusBar与navBar的高度）

        currentTime: 0, // -- 当前播放进度
        durationTime: 0, // -- 当前歌曲的总时长
        isSliderChanging: false,
        isWaiting: false,
        isPlaying: true,

        scrollPositionTop: 0,

        playingList: [],
        playingIndex: -1,
        playMode: "order"
    },

    onLoad(options){
        this.setData({ id: options.id, contentHeight: app.globalData.contentHeight }) // -- 获取 song ID，并获取页面内容的高度（动态设置内容高度）

        // console.log("ID", options.id);

        this.fetchSongInfo() // -- 获取歌曲基本信息

        // -- 获取共享数据的播放列表
        playingStore.onStates(["playingList","playingIndex","playMode"], this.getPlayInfosHandler) // -- 获取播放信息（事件监听）
        audioContext.autoplay = true
        audioContext.onTimeUpdate(this.onTimeUpdate)
        audioContext.onWaiting(() => { // -- 处理跳转播放位置的问题 ↓ onWaiting/onCanplay : 通过 seek 方法使歌曲跳到指定的时间位置，需要先缓存后面的数据，所以在该 onWaiting 等待的缓存的实践回调中先暂停等待（否则上面的 onTimeUpdate 事件的监听可能会由问题，导致无法监听等）
            audioContext.pause()
        })
        audioContext.onCanplay(() => { // -- 监听歌曲已可以播放事件回调
            audioContext.play()
        })
        audioContext.onEnded(() => { 
            if(playingStore.playMode === 'repeat') return // -- 单曲循环，不执行下面播放下一首的操作
            this.onSwitchNewSongPlaying()
        })
    },

    // async fetchSongDetail() {
    //     const res = await getSongDetail(this.data.id) // -- 获取歌曲详情
    //     this.setData({ currentSong: res.songs[0] })
    //     this.setData({ durationTime: res.songs[0].dt / 1000 }) // -- 获取当前歌曲总时长（s）
    // },

    // async fetchSongLyric(){
    //     const res = await getSongLyric(this.data.id) // -- 获取歌曲歌词
    //     const lyric = res.lrc.lyric
    //     const lyricInfos = parseLyrics(lyric ? lyric : '') // -- 歌词解析
    //     this.setData({ lyricInfos })
    // },

    fetchSongInfo(){
        getSongDetail(this.data.id) // -- 获取歌曲详情
            .then(res => {
                this.setData({
                    currentSong: res.songs[0],
                    durationTime: res.songs[0].dt / 1000 // -- 获取当前歌曲总时长（s）
                })
            })
            getSongLyric(this.data.id) // -- 获取歌曲歌词
            .then(res => {
                const lyric = res.lrc.lyric
                const lyricInfos = parseLyrics(lyric ? lyric : '') // -- 歌词解析
                this.setData({ lyricInfos })
            })
    },

    // -- event
    changeSwiper(e){
        this.setData({ currentPage: e.detail.current })
    },
    
    updateCurrentPage(e){
        const updatePageCode = e.currentTarget.dataset.pagecode
        this.setData({ currentPage: updatePageCode })
    },

    onTimeUpdate(){ // -- 监听当前部分进度发生改变时触发该回调（回调函数没有参数，要想拿当前进入直接在 audioContext 中的 currentTime 属性中获取）
        const currentTime = audioContext.currentTime
        // -- 更新歌曲进度
        if(!this.data.isSliderChanging && !this.data.isWaiting){
            this.setData({ currentTime }) // -- isSliderChanging 当正在滑动进度条时，先不对 currentTime 进行更新（避免进度条反复横跳）
        }
        // -- 匹配歌词
        const len = this.data.lyricInfos.length
        if(!len) return
        let index = len - 1
        for(let i = 0; i < len; i++){
            const info = this.data.lyricInfos[i]
            if(info.time > currentTime * 1000){
                index = i - 1
                break
            }
        }   
        if(index === this.data.currentLyricIndex) return // -- 当 currentLyricIndex === index 直接返回，不执行下面的 setData -> 避免同一句歌词重复赋值（多次重复调用 this.setData 函数）
        const text = this.data.lyricInfos[index] ? this.data.lyricInfos[index].text : false
        if(text) {
            this.setData({ 
                currentLyricText: text, 
                currentLyricIndex: index,
                scrollPositionTop: index * 40
            })
        }
    },

    onSiderChange(e){ // -- 监听点击歌曲进度条时间
        // -- isWaiting 先为 true，等待一段时间后再为 false（非等待） : 因为 audioContext.seek 方法会由前面的一点时间的缓存（该变量用于延迟 onTimeUpdate 时间中的修改 currentTime 值）
        this.data.isWaiting = true
        setTimeout(() => { this.data.isWaiting = false }, 1500)

        // -- 设置当前跳转时间
        const updateTime = e.detail.value
        audioContext.seek(updateTime) // -- 设置歌曲跳转时间
        this.setData({ currentTime: updateTime }) 
        this.data.isSliderChanging = false

        if(!this.data.isPlaying) this.setData({ isPlaying: true })
    },
    onSiderChanging(){ // -- 监听滑动歌曲进度条时间
        this.data.isSliderChanging = true
    },

    onPlayOrPauseTap(){ // -- 监听歌曲播放与暂停事件 ------ ....
        if(!audioContext.paused){
            audioContext.pause()
            this.setData({ isPlaying: false })
        }else {
            audioContext.play()
            this.setData({ isPlaying: true })
        }
    },
    onSwitchNewSongPlaying(e){
        // if(this.data.playMode === "repeat"){ // -- 当为 "单曲循环" 模式播放时 <模式2: 单曲循环时，点击上或下一首也为该曲> <已使用模式1: 可以上下曲切换，自然播放完的为单曲> 
        //     audioContext.stop()
        //     audioContext.src = `https://music.163.com/song/media/outer/url?id=${this.data.id}.mp3`
        //     audioContext.play()
        //     return 
        // }
        const isPrev = e && e.currentTarget.dataset.type === "prev"
        playingStore.dispatch("switchNewSongPlaying", isPrev )
    },
    onSwitchPlayMode(){
        playingStore.dispatch("switchPlayMode")
    },

    getPlayInfosHandler({playingList,playingIndex,playMode}){
        if(playingList) this.setData({ playingList })
        if(playingIndex !== undefined) {
            this.setData({id: this.data.playingList[playingIndex].id}) // -- 当 playingIndex 发生改变后更新当前 id 并更新对应歌曲数据 ↓
            this.fetchSongInfo()
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${this.data.id}.mp3` // -- 更新歌曲播放
            console.log("Coderkxh:",playingIndex);
        }
        if(playMode) { 
            this.setData({ playMode })
            // -- ↓ <已使用模式1: 可以上下曲切换，自然播放完的为单曲> <模式2: 单曲循环时，点击上或下一首也为该曲> 
            if(playMode === 'repeat') audioContext.loop = true // -- 是否为单曲循环，改变对应 audioContext 的 loop 使其循环播放
            else audioContext.loop = false
        }
        console.log(this.data.playMode);
    },

    // -- 页面取消挂载(取消对应的事件监听)
    onUnload(){
        audioContext.offTimeUpdate(this.onTimeUpdate)
        audioContext.offEnded(() => { this.onSwitchNewSongPlaying() })
        audioContext.offWaiting(() => { audioContext.pause() })
        audioContext.offCanplay(() => { audioContext.play() })
    }
})