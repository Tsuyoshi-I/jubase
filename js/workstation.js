const audioImport = document.getElementById('audioImportBtn')
const trackList = document.getElementById('trackList')
let idManege = 0

const createTrack = (e) => {
  const trackElement = document.createElement('li')
  trackElement.classList.add("trackIndex")
  trackElement.id = `track${idManege}`
  idManege++

  const audioElement = document.createElement('audio')

  const trackName = document.createElement('p')
  trackName.classList.add('trackName')

  const audioData = e.target.files[0]
  if (!audioData.type.match('audio.*')) {
    alert('音声を選択してください')
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    audioElement.src = reader.result
    console.log(audioData.name)
    trackName.textContent = audioData.name
    trackElement.appendChild(trackName)
    trackElement.appendChild(audioElement)
    trackList.appendChild(trackElement)
  }
  reader.readAsDataURL(audioData)
}

audioImport.addEventListener('input', createTrack, false)


// 以下再生処理

const playBtn = document.getElementById('playBtn')

const playAudio = () => {
  const audioCtx = new AudioContext()
  const audioElements = document.querySelectorAll('#trackList audio')[0]//とりあえず
  const trackCtx = audioCtx.createMediaElementSource(audioElements)
  trackCtx.connect(audioCtx.destination)

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  // play or pause track depending on state
  if (playBtn.dataset.playing === 'false') {
    audioElement.play();
    playBtn.dataset.playing = 'true';
  } else if (playBtn.dataset.playing === 'true') {
    audioElement.pause();
    playBtn.dataset.playing = 'false';
  }
}
playBtn.addEventListener('click', playAudio)


