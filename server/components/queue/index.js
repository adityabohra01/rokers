import { exec } from "child_process"

class PlaybackQueue {
    constructor() {
        this.queue = []
        this.currentSongIndex = null

        this.playing = false
        this.paused = false
        this.repeat = false
        this.shuffle = false
        this.songInMemory = false
        this.child = null
        this.timeLeft = 0
        this.timer = null
    }

    addSong(song) {
        this.queue.push(song)
        if (!this.playing && !this.paused) {
            this.resumePlayback(0)
        }
    }

    removeSong(index) {
        this.queue.splice(index, 1)
        if (index === this.currentSongIndex) {
            if (this.queue.length === 0) {
                this.stopPlayback()
            } else {
                this.resumePlayback(0)
            }
        }
    }

    resumePlayback(index) {
        if (index >= this.queue.length) throw new Error("Index out of bounds")
        
        this.playing = true
        this.paused = false
        this.currentSongIndex = index

        if (this.songInMemory && this.paused) {
            this.continuePlayback()
        } else if (this.songInMemory && !this.paused) {
            // do nothing
            return
        } else {
            this.playSong(this.queue[index])
        }
    }
    
    // play song with ffplay using exec
    async playSong (url) {
        if (this.child) {
            this.child.kill()
            this.child = null
        }
        this.songInMemory = true
        this.child = exec(`omxplayer "${url}" -o alsa:hw:1`)
        this.child.on('exit', () => {
            this.songInMemory = false
            this.child = null
            if (this.repeat) {
                this.resumePlayback(this.currentSongIndex)
            } else if (this.currentSongIndex + 1 < this.queue.length) {
                this.resumePlayback(this.currentSongIndex + 1)
            } else {
                this.stopPlayback()
            }
        })

    }

    continuePlayback() {
        if (this.child) {
            this.child.send('SIGCONT')
            this.playing = true
            this.paused = false
        }
        else console.log("No child process")
    }

    pausePlayback() {
        if (this.child) {
            this.child.send('SIGSTOP')
            this.playing = false
            this.paused = true
        }
        else console.log("No child process")
    }

    stopPlayback() {
        if (this.child) {
            this.queue = []
            this.child.kill()
            this.child = null
            this.playing = false
            this.paused = false
            this.currentSongIndex = null
        }
        else console.log("No child process")
    }


    
}

export default new PlaybackQueue()