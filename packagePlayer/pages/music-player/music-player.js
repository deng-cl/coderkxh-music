import { playingStore, audioContext } from "../../../stores/playingStore"
const app = getApp()
Page({
    data: {
        // -- Listenning properties key in "playStore"
        stateKeys: ["id", "currentSong", "currentTime", "durationTime", "lyricInfos", "currentLyricText", "currentLyricIndex", "isPlaying", "playMode", "playingList"],
        pageTitles: ["歌曲", "歌词"],

        id: -1,
        playingList: [],
        currentSong: {},
        currentTime: 0,
        durationTime: 0,
        lyricInfos: [],
        currentLyricText: "",
        currentLyricIndex: -1,
        playMode: "order",
        isPlaying: true,

        currentPage: 0,
        contentHeight: 500,

        scrollPositionTop: 0,


        isSliderChanging: false,
        isWaiting: false,

        // playingIndex: -1,
    },

    onLoad(options) {
        this.setData({ id: options.id, contentHeight: app.globalData.contentHeight })

        if (options.id) playingStore.dispatch("playMusicWithSongIdActionc", this.data.id)

        playingStore.onStates(this.data.stateKeys, this.getPlayerInfos)
    },

    // -------- Change store props and update info for current page
    // -------- Update info for current page by listenning properties in "playStore"
    getPlayerInfos({ id, currentSong, currentTime, durationTime, lyricInfos, currentLyricText, currentLyricIndex, isPlaying, playMode, playingList }) {
        if (id !== undefined) this.setData({ id })
        if (currentSong) this.setData({ currentSong })
        if (currentTime !== undefined) {
            if (!this.data.isSliderChanging && !this.data.isWaiting) {
                this.setData({ currentTime })
            }
        }
        if (durationTime !== undefined) this.setData({ durationTime })
        if (lyricInfos) this.setData({ lyricInfos })
        if (currentLyricText) this.setData({ currentLyricText })
        if (currentLyricIndex !== undefined) this.setData({ currentLyricIndex, scrollPositionTop: currentLyricIndex * 40 })
        if (isPlaying !== undefined) this.setData({ isPlaying })
        if (playMode) {
            this.setData({ playMode })
            if (playMode === 'repeat') audioContext.loop = true
            else audioContext.loop = false
        }
        if (playingList) this.setData({ playingList })
    },

    changeSwiper(e) {
        this.setData({ currentPage: e.detail.current })
    },

    updateCurrentPage(e) {
        const updatePageCode = e.currentTarget.dataset.pagecode
        this.setData({ currentPage: updatePageCode })
    },

    onSiderChange(e) {

        this.data.isWaiting = true
        setTimeout(() => { this.data.isWaiting = false }, 1500)


        const updateTime = e.detail.value
        audioContext.seek(updateTime)
        this.setData({ currentTime: updateTime })
        this.data.isSliderChanging = false

        if (!this.data.isPlaying) playingStore.dispatch("switchMusicStatusAction")
    },
    onSiderChanging() {
        this.data.isSliderChanging = true
    },

    onPlayOrPauseTap() {
        playingStore.dispatch("switchMusicStatusAction")
    },

    onSwitchNewSongPlaying(e) {
        const isNext = e && e.currentTarget.dataset.type === "next"
        playingStore.dispatch("switchNewSongPlaying", isNext)
    },

    onSwitchPlayMode() {
        playingStore.dispatch("switchPlayMode")
    },


    onUnload() {
        playingStore.offStates(this.data.stateKeys, this.getPlayerInfos)
    }
})