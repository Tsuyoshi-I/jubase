const audioImport = document.getElementById('audioImportBtn')
const trackList = document.getElementById('trackList')
const playBtn = document.getElementById('playBtn')
const audioCtx = new AudioContext()

let idManege = 0

const tracks = [] // ここにトラックが全部入る
// tracks = [
// {
//   trackElement: trackElemtnt,
//   
// },
// ]

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
    tracks.push({
      trackElement: trackElement
    })

    tracks.forEach(track => trackList.appendChild(track.trackElement))
    audioImport.value = "" // こいつのお陰で同じファイルを連続選択出来る
  }
  reader.readAsDataURL(audioData)

}

audioImport.addEventListener('input', renderTrack, false)

// 以下再生処理
// 以下は確か再生しなければ関係ない。一旦置いておいて再考。
const playAudio = () => {
  const audio1 = tracks[0].trackElement.children[1]
  const audio2 = tracks[1].trackElement.children[1]
  const trackCtx1 = audioCtx.createMediaElementSource(audio1)
  const trackCtx2 = audioCtx.createMediaElementSource(audio2)
  trackCtx1.connect(audioCtx.destination)
  trackCtx2.connect(audioCtx.destination)

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  // play or pause track depending on state
  if (playBtn.dataset.playing === 'false') {
    audio1.play();
    audio2.play();
    playBtn.dataset.playing = 'true';
  } else if (playBtn.dataset.playing === 'true') {
    audio1.pause();
    audio2.pause();
    playBtn.dataset.playing = 'false';
  }
}
playBtn.addEventListener('click', playAudio)


