const audioImport = document.getElementById('audioImport')
const trackList = document.getElementById('trackList')
let idManege = 0

const allProcess = (e) => {
  // li(track)作成
  const trackElement = document.createElement('li')
  trackElement.classList.add("trackIndex")
  trackElement.id = `track${idManege}`
  idManege++

  // file読み込み
  const audioData = e.target.files[0]
  if (!audioData.type.match('audio.*')) {
    // チェック
    alert('音声を選択してください')
    return
  }
  const reader = new FileReader()
  reader.readAsDataURL(audioData)// reader.resultにdataURLになる

  // audio要素作成
  reader.onload = () => {
    const audioElement = document.createElement('audio')
    audioElement.src = reader.result
    trackElement.appendChild(audioElement)
    trackList.appendChild(trackElement)
  }
}

audioImport.addEventListener('input', allProcess, false)


