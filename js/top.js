// ロード用
// window.onload = () => {
//   document.querySelector(".mask").style.display = "block"
//   document.querySelector(".modal").style.display = "block"
//   document.getElementById('test').style.display = "none"
// }

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal')
  const modalLink = document.getElementById('modalLink')
  const closeBtn = document.getElementById('closeBtn')
  const audio = document.getElementById('audio')

  const toggleModal = () => {
    // このaudioを変数(引数にできる)
    audio.currentTime = 0
    audio.play()
    modal.classList.toggle('toggle')
  }
  // https://idotdesign.net/blog/web/htmlcss/audio-se-btn/
  // クラス化出来るか？
  // modalLinkcloseBtnが引数か？→一旦保留で
  modalLink.addEventListener('click', toggleModal)
  closeBtn.addEventListener('click', toggleModal)
})