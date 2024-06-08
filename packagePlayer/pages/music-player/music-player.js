import { playingStore, audioContext } from "../../../stores/playingStore"
const app = getApp()
Page({
    data:{
        // -- Listenning properties key in "playStore"
        stateKeys: ["id","currentSong","currentTime","durationTime","lyricInfos","currentLyricText","currentLyricIndex","isPlaying","playMode","playingList"], 
        pageTitles:["歌曲","歌词"],
        
        id: -1,
        playingList: [],
        currentSong: {}, // -- 歌曲详情
        currentTime: 0, // -- 当前播放进度
        durationTime: 0, // -- 当前歌曲的总时长
        lyricInfos: [], // -- 歌词
        currentLyricText: "", // -- 当前行歌词
        currentLyricIndex: -1, // -- 当前行索引: 用于优化匹配歌词的重复执行...
        playMode: "order",
        isPlaying: true,

        currentPage:0, // -- 当前页（歌曲/歌词）
        contentHeight: 500, // -- 动态决定该页的 content 内容的高度（设备总高度去statusBar与navBar的高度）

        scrollPositionTop: 0,

        
        isSliderChanging: false,
        isWaiting: false,
        
        // playingIndex: -1,
    },

    onLoad(options){
        this.setData({ id: options.id, contentHeight: app.globalData.contentHeight }) // -- 获取 song ID，并获取页面内容的高度（动态设置内容高度）

        if(options.id) playingStore.dispatch("playMusicWithSongIdActionc",this.data.id) // -- 获取歌曲基本信息并播放当前歌曲

        playingStore.onStates(this.data.stateKeys , this.getPlayerInfos) // -- 监听 store 中当前播放歌曲的相依信息...
    },

    // -------- Change store props and update info for current page
    // -------- Update info for current page by listenning properties in "playStore"
    getPlayerInfos({ id, currentSong, currentTime, durationTime, lyricInfos, currentLyricText, currentLyricIndex, isPlaying, playMode,playingList}){
        if(id !== undefined) this.setData({ id })
        if(currentSong) this.setData({ currentSong })
        if(currentTime !== undefined) {
            if(!this.data.isSliderChanging && !this.data.isWaiting){ // -- 更新歌曲进度 : 进度条在滑动shi，先对应 currentTime 进行赋值（避免进度条反复横跳）
                this.setData({ currentTime })
            }
        }
        if(durationTime !== undefined) this.setData({ durationTime })
        if(lyricInfos) this.setData({ lyricInfos })
        if(currentLyricText) this.setData({ currentLyricText })
        if(currentLyricIndex !== undefined) this.setData({ currentLyricIndex, scrollPositionTop: currentLyricIndex * 40 })
        if(isPlaying !== undefined) this.setData({ isPlaying })
        if(playMode) {
            this.setData({ playMode })
            if(playMode === 'repeat') audioContext.loop = true // -- 是否为单曲循环，改变对应 audioContext 的 loop 使其循环播放
            else audioContext.loop = false
        }
        if(playingList) this.setData({ playingList })
    },

    // -------- Event 
    changeSwiper(e){ // 当前页面(索引): 改变的 tabbar 标题对应文字的样式...
        this.setData({ currentPage: e.detail.current })
    },
    
    updateCurrentPage(e){ // -- 页面切换: 播放页/歌词页
        const updatePageCode = e.currentTarget.dataset.pagecode
        this.setData({ currentPage: updatePageCode })
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

        if(!this.data.isPlaying) playingStore.dispatch("switchMusicStatusAction")
    },
    onSiderChanging(){ // -- 监听滑动歌曲进度条时间
        this.data.isSliderChanging = true
    },

    onPlayOrPauseTap(){ // -- 播放/暂停
        playingStore.dispatch("switchMusicStatusAction")
    },

    onSwitchNewSongPlaying(e){ // 歌曲播放切换: 上一首/下一首
        const isNext = e && e.currentTarget.dataset.type === "next"
        playingStore.dispatch("switchNewSongPlaying", isNext )
    },

    onSwitchPlayMode(){ // 播放模式切换: 顺序/随机/单曲
        playingStore.dispatch("switchPlayMode")
    },

    // -- 页面取消挂载(取消对应的事件监听)
    onUnload(){
        playingStore.offStates(this.data.stateKeys , this.getPlayerInfos)
    }
})