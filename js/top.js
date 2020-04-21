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
    audio.currentTime = 0
    audio.play()
    modal.classList.toggle('toggle')
  }
  modalLink.addEventListener('click', toggleModal)
  closeBtn.addEventListener('click', toggleModal)
})