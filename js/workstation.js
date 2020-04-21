// ゴリゴリにグローバルスコープ使ってたりクラス使ってなかったりするのはご愛嬌。（リファクタリングの時間ない）

// インポート・レンダリング
const audioImport = document.getElementById('audioImportBtn')// ローカル音声ファイルインポート用ボタン
const trackList = document.getElementById('trackList')// 音源(audioタグ)貼っ付ける場所 ulタグ
const eventList = document.getElementById('eventList')

// 再生・停止
const playBtn = document.getElementById('playBtn')// 全体(以下master)再生ボタン
const pauseBtn = document.getElementById('pauseBtn')// master一時停止ボタン
const stopBtn = document.getElementById('stopBtn')// master停止ボタン

// master音量コントロールスライダー
const velSlider = document.getElementById('velSlider')// master音量スライダー
const velOutput = document.getElementById('vel')// 数値表示用outputタグ
velOutput.textContent = 0 // この辺は初期化
velSlider.value = 1
velSlider.min = 0
velSlider.max = 3.4
velSlider.step = 0.01

// masterPanコントロールスライダー
const panSlider = document.getElementById('panSlider')
const panOutput = document.getElementById('pan')
panOutput.textContent = 0
panSlider.value = 0
panSlider.min = -1
panSlider.max = 1
panSlider.step = 0.01

// コンテキスト・API・webaudioApiノードとか
const reader = new FileReader()// ローカルファイル読み込み用API
const audioCtx = new AudioContext()// webAudioApiコンテキスト
const gainNode = audioCtx.createGain()// 音量用ノード作成
const pannerOptions = { pan: 0 }
const panner = new StereoPannerNode(audioCtx, pannerOptions)

const WIDTH = 300
const HEIGHT = 300
const analyser = audioCtx.createAnalyser()
analyser.fftSize = 2048
const bufferLength = analyser.frequencyBinCount
const dataArray = new Uint8Array(bufferLength)

// trackListに入れるliタグのid管理(お粗末)
let idManege = 0

// 音源管理 ざっくりこんな構造
//[{音源要素1, プロパティ1, プロパティ2}, {音源要素2...}]→プロパティは随時追加
const tracks = []

/**
 * 【track用要素作成＆整形(※HTMLへのレンダリングはしない)】
 * liタグ・audioタグ・pタグを作ってli > p + audioにする。
 * pタグはトラック名表示用。className付与。
 * liにはid付与(idManege)。idManegeは加算。
 * renderTrack内のreader.onload内で、各要素を渡すために実行。
 * 引数audioDataはrenderTrack内にて、音声ファイルが渡される。
 * @param  {File} 
 * @return {Element, Element} 
 */
const createElement = (audioData) => {
  // li作ってクラスとid当ててid加算
  const trackElement = document.createElement('li')
  trackElement.classList.add("trackIndex")
  trackElement.id = `track${idManege}`
  // idManege++ canvas追加後にお引越し

  // audio作成
  const audioElement = document.createElement('audio')
  // トラック名用pタグ作成
  const trackName = document.createElement('p')
  trackName.classList.add('trackName')

  // 組み立て
  trackElement.appendChild(trackName)
  trackElement.appendChild(audioElement)
  trackName.textContent = audioData.name

  return [trackElement, audioElement]
}

/**
 * 【ファイル読み込み→ノード接続・ファイル格納to配列→レンダリング】
 * @param  {event object(input:input)}
 * @return {undefined} 
 */
const renderTrack = (e) => {
  // 選択されたファイルを変数audioDataに格納＆ファイル種別チェック
  const audioData = e.target.files[0]
  if (!audioData.type.match('audio.*')) {
    alert('音声を選択してください')
    return
  }
  // audioDataの中身を解析して要素に当てるための処理。
  // const reader = new FileReader()
  // onloadが働くのはreadAsDataURLが成功したら
  reader.onload = () => {
    const [trackElement, audioElement] = createElement(audioData)
    audioElement.src = reader.result // audioタグのsrcにファイルソースをセット

    // canvas設定
    const canvas = document.createElement('canvas')
    const canvasElement = document.createElement('li')
    canvas.id = `canvas${idManege}`
    canvasElement.appendChild(canvas)
    idManege++
    canvas.width = WIDTH
    canvas.height = HEIGHT
    const canvasCtx = canvas.getContext('2d')

    // 音声ソース作成
    const trackCtx = audioCtx.createMediaElementSource(trackElement.children[1])

    // 音声ソースを各ノードに接続
    // 末尾(audioCtx.destination)はスピーカだと思えばいい
    // それまでは各処理に必要なエフェクター系
    trackCtx.connect(gainNode).connect(analyser).connect(panner).connect(audioCtx.destination)

    // ソース管理用配列(tracks)にオブジェクトの形式で格納
    tracks.push({
      trackElement: trackElement,
      canvasElement: canvasElement,
      canvasCtx: canvasCtx,
    })

    // trackElement(liタグ)の子要素としてaudioタグをぶち込む
    tracks.forEach(track => {
      trackList.appendChild(track.trackElement)
      eventList.appendChild(track.canvasElement)
    })
    audioImport.value = "" // こいつのお陰で同じファイルを連続選択出来る(※valueが保持されると同じファイルを選択してもinputイベントが発火しない)
  }
  reader.readAsDataURL(audioData)
}
audioImport.addEventListener('input', renderTrack, false)

/**
 * 【track一括同時再生】
 * forEachでtracks内のソースを回してるだけ。
 * メソッドはwebAudioApiのplay()。
 */
const playAudio = () => {
  if (audioCtx.state === 'suspended') {// suspended 一時停止中
    audioCtx.resume();// 一時停止中のものを再開
  }
  draw()
  tracks.forEach(track => track.trackElement.children[1].play())
}
playBtn.addEventListener('click', playAudio)

/**
 * 【track一括同時一時停止(中断)】
 * forEachでtracks内のソースを回してるだけ。
 * メソッドはwebAudioApiのpause()。
 * 再開時は止めたところから。
 */
const pauseAudio = () => {
  tracks.forEach(track => track.trackElement.children[1].pause())
}
pauseBtn.addEventListener('click', pauseAudio)

/**
 * 【track一括同時停止】
 * forEachでtracks内のソースを回してるだけ。
 * メソッドはwebAudioApiのpause()。
 * 再生位置(currentTime)を0にすることで停止処理にしている。
 * 再開は最初から。
 */
const stopAudio = () => {
  console.log('止まり給う')
  tracks.forEach(track => {
    track.trackElement.children[1].currentTime = 0
    track.trackElement.children[1].pause()
  })
  // tracks.forEach(track => )
}
stopBtn.addEventListener('click', stopAudio)

/**
 * 【track一括音量調整】
 * 該当箇所にスライダーのvalueを入れてるだけ。
 * ２行目は数値表示。
 */
const setVelSliderValue = () => {
  gainNode.gain.value = velSlider.value
  velOutput.textContent = velSlider.value
}
velSlider.addEventListener('input', setVelSliderValue, false)

/**
 * 【track一括pan調整】
 * 該当箇所にスライダーのvalueを入れてるだけ。
 * ２行目は数値表示。
 */
const setPanSliderValue = () => {
  panner.pan.value = panSlider.value
  panOutput.textContent = panSlider.value
}
panSlider.addEventListener('input', setPanSliderValue, false)

// ビジュアライザーお試し

const draw = () => {
  drawVisual = requestAnimationFrame(draw)
  analyser.getByteTimeDomainData(dataArray)

  tracks.forEach(track => {
    track.canvasCtx.fillStyle = 'rgb(200,200,200)'
    track.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

    track.canvasCtx.lineWidth = 2
    track.canvasCtx.strokeStyle = 'rgb(0,0,0)'

    track.canvasCtx.beginPath()

    const sliceWidth = WIDTH * 1.0 / bufferLength
    let x = 0

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0
      const y = v * HEIGHT / 2

      if (i === 0) {
        track.canvasCtx.moveTo(x, y)
      } else {
        track.canvasCtx.lineTo(x, y)
      }

      x += sliceWidth
    }
    track.canvasCtx.lineTo(track.canvasElement.children.width, track.canvasElement.children.height / 2)
    track.canvasCtx.stroke()
  })
}