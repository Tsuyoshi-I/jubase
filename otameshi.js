// 削除は一旦考えるな

const audioImport = document.getElementById('audioImport')

// こいつが絶対味噌っぽいんだよな
const track1 = document.getElementById('track100')

const loadLocalAudio = (e) => {
  // これは依存していない。
  // 実行される度に対象が入る。問題ない。
  const fileData = e.target.files[0]

  if (!fileData.type.match('audio.*')) {
    alert('画像を選択してください')
    return
  }

  // これは外に出しても平気。
  const reader = new FileReader()
  // readerはインスタンス(コンテキスト)
  reader.onload = () => {
    // これは共通処理
    const audio = document.createElement('audio')
    // これも
    audio.src = reader.result
    audio.controls = true
    // track100がどう考えも依存
    track100.appendChild(audio)
  }

  reader.readAsDataURL(fileData)
}
audioImport.addEventListener('change', loadLocalAudio, false)


/////////////////////////////////
以下master再生ボタン押した時の処理 //
/////////////////////////////////

const playBtn = document.getElementById('playBtn')

playBtn.addEventListener('click', () => {
  const track100Audio = document.querySelector('#track100>audio')
  track100Audio.currentTime = 0
  track100Audio.play()
})

class Aaaa {
  constructor() {
    console.log(this)
    console.log(this.id)
  }
  static id = 10000
  increment() {
    this.id++
  }
}


// 仮に全て一つの関数でやるとして何が不具合ある？
