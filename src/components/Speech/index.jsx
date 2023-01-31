import React, { useContext, useState } from "react"
import regeneratorRuntime from "regenerator-runtime"
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition"
import { useEffect } from "react"
import { ControlContext } from "../ControlContext"

export default function Speech() {
    const contronContext = useContext(ControlContext)
    // console.log(contronContext)
    const [speech, setSpeech] = useState(null)

    function speak ({text, volume, lang, rate, pitch, voice}) {
        speech.text = text
        speech.volume = volume / 100 || 1
        speech.lang = lang || "en-IN"
        speech.rate = rate || 1
        speech.pitch = pitch || 1
        voice ? speech.voice = voice || speechSynthesis.getVoices()[13] : null
        speechSynthesis.speak(speech)
    }

    useEffect(() => {
        if ('speechSynthesis' in window) {
            const synth = new SpeechSynthesisUtterance()
            synth.lang = "en-IN"
            synth.text = "Hello !"
            synth.rate = 1
            synth.voice = speechSynthesis.getVoices()[13]
            speechSynthesis.speak(synth)
            setSpeech(synth)
        }
    }, [])

    const commands = [
        {
            command: "play (the) (song) *",
            callback: async (track, ...rest) => {
                console.log(track, rest)
                const data = await contronContext.search(track)
                speak({text: "Playing " + data.tracks.items[0].name + " by " + data.tracks.items[0].artists[0].name})
                await contronContext.playSong(data.tracks.items[0])
                resetTranscript()
            },
            isFuzzyMatch: true,
            fuzzyMatchingThreshold: 0.4,
            bestMatchOnly: true,
        },
        {
            command: "play (the) (song) * (by) (artist) (from album) (from) *",
            callback: async (track, artist, ...rest) => {
                console.log(track, artist, rest)
                const data = await contronContext.search(track + " " + artist)
                speak({ text: "Playing " + data.tracks.items[0].name + " by " + data.tracks.items[0].artists[0].name })
                await contronContext.playSong(data.tracks.items[0])
                resetTranscript()
            },
        },
        {
            command: ["show controls", "so controls", "more controls", 'show next button', "show volume", "controls"],
            callback: ({ resetTranscript }) => {
                contronContext.setHeight(160)
                resetTranscript()
            },
        },
        {
            command: ["hide controls", "hide next button", "hide volume", "hide control", "height control", "height controls"],
            callback: ({ resetTranscript }) => {
                contronContext.setHeight(112)
                resetTranscript()
            }
        },
        {
            command: ["stop", "start", "resume", "go back", "previous song", "continue", "pause", "next", "skip",
                      "skip next", "play next", "change", "change song", "another song", "previous", "volume up",
                      "volume down", "volume mute", "volume unmute", "mute", "unmute", "increase volume", "decrease volume",
                      "volume increase", "volume decrease", "lower volume", "raise volume", "volume lower", "volume raise",
                      "quite", "louder", "quiet", "loud", "volume quite", "volume louder", "volume quiet", "volume loud",
                      "quieter", "silent", "volume quieter", "volume silent", "volume quieter", "volume silent", "volume quieter",
                    ],
            callback: ({ command, resetTranscript }) => {
                console.log("executed ", command)
                let vol = 0
                switch (command) {
                    case "resume":
                    case "continue":
                    case "pause":
                    case "stop":
                    case "start":
                        contronContext.togglePlay()
                        speak({ text: "Resuming" })
                        break
                    case "next":
                    case "skip":
                    case "skip next":
                    case "play next":
                    case "change":
                    case "change song":
                    case "another song":
                        speak({ text: "Playing next song" })
                        contronContext.next()
                        break
                    case "previous":
                    case "go back":
                    case "previous song":
                        speak({ text: "Playing previous song" })
                        contronContext.prev()
                        break
                    case "volume up":
                    case "volume increase":
                    case "increase volume":
                    case "raise volume":
                    case "volume raise":
                    case "louder":
                    case "volume louder":
                        vol = parseInt(contronContext.volumeRef.current.value)
                        if (vol + 32 < 255) vol += 32
                        else vol = 255

                        contronContext.volumeRef.current.value = vol
                        contronContext.changeVolume({ target: { value: vol } })
                        if (vol === 255)
                            speak({ text: "Volume is at maximum", volume: 100, lang: "en-IN", rate: 1, pitch: 1 })
                        else
                            speak({ text: "Volume is at " + vol, volume: 100, lang: "en-IN", rate: 1, pitch: 1 })
                        break
                    case "volume down":
                    case "volume decrease":
                    case "decrease volume":
                    case "lower volume":
                    case "volume lower":
                    case "quieter":
                    case "volume quieter":
                        vol = parseInt(contronContext.volumeRef.current.value)
                        if (vol - 32 > 0) vol -= 32
                        else vol = 0

                        contronContext.volumeRef.current.value = vol
                        contronContext.changeVolume({ target: { value: vol } })
                        if (vol === 0)
                            speak({ text: "Volume is at minimum", volume: 100, lang: "en-IN", rate: 1, pitch: 1 })
                        else
                            speak({ text: "Volume is at " + vol, volume: 100, lang: "en-IN", rate: 1, pitch: 1 })
                        break
                    case "volume mute":
                    case "mute":
                    case "quiet":
                    case "volume quiet":
                    case "quite":
                    case "volume quite":
                    case "silent":
                    case "volume silent":
                        contronContext.volumeRef.current.value = 0
                        contronContext.changeVolume({ target: { value: 0 } })
                        break
                    case "volume unmute":
                    case "unmute":
                    case "loud":
                    case "volume loud":
                        contronContext.volumeRef.current.value = 255
                        contronContext.changeVolume({ target: { value: 255 } })
                        speak({ text: "Volume is at maximum", volume: 100, lang: "en-IN", rate: 1, pitch: 1 })
                        break
                    default:
                        break
                }

                resetTranscript()
            },
        },
        {
            command: "(set) volume (to) :value (percent)",
            callback: (volume, ...rest) => {
                const percent = parseInt(volume.match(/\d+/)[0]) / 100
                const vol = percent * 255
                contronContext.volumeRef.current.value = vol
                contronContext.changeVolume({ target: { value: vol } })
                speak({ text: "Volume is at " + (percent * 100) + " percent.", volume: 100, lang: "en-IN", rate: 1, pitch: 1 })
                resetTranscript()
            },
            bestMatchOnly: true,
        },
        {
            command: ["search *", "search for *", "search for the song *", "search for the song by *", "search for song by *", "search for * by *", "search for the song * by *", "search for song * by *"],
            callback: (query, query2, ...rest) => {
                console.log(query, query2, rest)
            },
        },
        {
            command: "clear",
            callback: ({ resetTranscript }) => resetTranscript(),
        },
        {
            command: ["well done", "good job", "nice", "awesome", "great", "good", "cool", "nice job", "good work", "very good"],
            callback: () => speak({ text: "Thank you chutiya", volume: 100, lang: "HI", rate: 1, pitch: 1 }),
        },
        {
            command: ["chutiya", "bhosdike", "madarchod", "gadha", "chutiya hai tu", "bhosdike hai tu", "madarchod hai tu", "gadha hai tu", "chutiya hai tum", "bhosdike hai tum", "madarchod hai tum", "gadha hai tum", "chutiya hai", "bhosdike hai", "madarchod hai", "gadha hai", "sala"],
            callback: () => speak({ text: "jaadey mat bol BC", volume: 100, lang: "HI", rate: 1, pitch: 1 }),
        },
    ]
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({ commands})

    useEffect(() => {
        if (transcript !== "") {
            console.log(transcript)
            // resetTranscript()
        }
    }, [transcript])

    // add a play song by name function here



    return (
        <div
            className="playArrow"
            style={{
                height: "48px",
                width: "48px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "var(--container)",
                borderRadius: 16,
            }}
        >
            <span
                className="material-icons-outlined"
                style={{
                    fontSize: 32,
                    color: browserSupportsSpeechRecognition ? listening ? "blue" : "green" : "red",
                }}
                onClick={() => {
                    if (browserSupportsSpeechRecognition) {
                        if (listening) {
                            SpeechRecognition.stopListening()
                        } else {
                            SpeechRecognition.startListening({ continuous: true, language: "en-IN" })
                        }
                    }
                }}
            >
                mic
            </span>
        </div>
    )
}
