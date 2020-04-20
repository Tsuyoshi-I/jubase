let trackNum = 0
const createTrack = () => {
  const track = document.createElement('li')
  const audioElement = document.createElement('audio')
  track.id = `track${trackNum}`
  trackNum++
  audioElement.src // = fileなんちゃらで作ったやつ 
  track.appendChild(audioElement)
}

// ↓ inputでのイベント(change)に登録する必要がある
const loadAudioFile = (e) => {
  const fileData = e.target.files[0]

  const reader = new FileReader()

  reader.readAsDataURL(fileData)// こいつぅ！！！！！
}


class CombineTrackMaterial {
  constructor() {
    this.trackItem = trackItem
    this.track = track
  }
  createTrackElement() {
    this.track = document.createElement('li')
    track.id// = 保留!!!
  }
  createAudioElement() {

  }
}


class SetAudio {
  constructor() {

  }
}


// 再生は後回し。
// 今はとにかく個別トラックに追加することだけ

// オブジェクト
const audio = {
  // <プロパティ>
  // ■ 挿入する場所
  // ■ 挿入するもの
  // <メソッド>
  // ■ 

}