const audioImport = document.getElementById('audioImportBtn')
const trackList = document.getElementById('trackList')
let idManege = 0

class TrackFormatter {
  createTrack(e) {
    const trackElement = document.createElement('li')
    trackElement.classList.add("trackIndex")
    trackElement.id = `track${idManege}`
    idManege++

    const audioData = e.target.files[0]
    if (!audioData.type.match('audio.*')) {
      alert('音声を選択してください')
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(audioData)

    reader.onload = () => {
      const audioElement = document.createElement('audio')
      audioElement.src = reader.result
      trackElement.appendChild(audioElement)
      trackList.appendChild(trackElement)
    }
  }
}

const newTrack = new TrackFormatter()

audioImport.addEventListener('input', newTrack.createTrack, false)

