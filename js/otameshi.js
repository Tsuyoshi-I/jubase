const audioImport = document.getElementById('audioImportBtn')
const trackList = document.getElementById('trackList')
const playBtn = document.getElementById('playBtn')
const audioCtx = new AudioContext()

let idManege = 0

const tracks = [] // ここにトラックが全部入る

const createElement = (audioData) => {
  // li作ってクラスとid当ててid加算
  const trackElement = document.createElement('li')
  trackElement.classList.add("trackIndex")
  trackElement.id = `track${idManege}`
  idManege++

  // audio作成
  const audioElement = document.createElement('audio')
  // トラック名用pタグ作成
  const trackName = document.createElement('p')
  trackName.classList.add('trackName')

  // 組み立て
  trackElement.appendChild(trackName)
  trackElement.appendChild(audioElement)
  trackName.textContent = audioData.name

  return [trackElement, audioElement, trackName]
}

const renderTrack = (e) => {
  // これは絶対クリックされたらの処理
  // 選択されたファイルを変数audioDataに格納＆ファイル種別チェック
  const audioData = e.target.files[0]
  if (!audioData.type.match('audio.*')) {
    alert('音声を選択してください')
    return
  }
  // audioDataの中身を解析して要素に当てるための処理。
  const reader = new FileReader()
  // onloadが働くのはreadAsDataURLが成功したら
  reader.onload = () => {
    const [trackElement, audioElement, trackName] = createElement(audioData)
    audioElement.src = reader.result // srcにファイルソースをセット

    const trackCtx = audioCtx.createMediaElementSource(trackElement.children[1])
    trackCtx.connect(audioCtx.destination)// ↓
    tracks.push({
      trackElement: trackElement,
    })
    tracks.forEach(track => trackList.appendChild(track.trackElement))
    audioImport.value = "" // こいつのお陰で同じファイルを連続選択出来る
  }
  reader.readAsDataURL(audioData)
}

audioImport.addEventListener('input', renderTrack, false)

// 以下再生処理
const playAudio = () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  if (playBtn.dataset.playing === 'false') {
    tracks.forEach(track => track.trackElement.children[1].play())
    playBtn.dataset.playing = 'true';
  } else if (playBtn.dataset.playing === 'true') {
    tracks.forEach(track => track.trackElement.children[1].play())
    playBtn.dataset.playing = 'false';
  }
}
playBtn.addEventListener('click', playAudio)


