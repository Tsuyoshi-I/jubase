const file = document.getElementById('file');
const result = document.getElementById('result');

const loadLocalImage = (e) => {
  // ファイル情報を取得
  const fileData = e.target.files[0];
  console.log(fileData); // 取得した内容の確認用
  console.log(fileData[0])
  // 画像ファイル以外は処理を止める
  // if (!fileData.type.match('image.*')) {
  //   alert('画像を選択してください');
  //   return;
  // }

  // // FileReaderオブジェクトを使ってファイル読み込み
  const reader = new FileReader();
  // // ファイル読み込みに成功したときの処理
  reader.onload = () => {
    const img = document.createElement('img');
    img.src = reader.result;
    console.log(reader.result)
    result.appendChild(img);
  }
  // ファイル読み込みを実行
  reader.readAsDataURL(fileData);
}
file.addEventListener('change', loadLocalImage, false);
