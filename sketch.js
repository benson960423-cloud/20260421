let capture;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 取得攝影機影像
  capture = createCapture(VIDEO);
  
  // 隱藏預設產生的 HTML 影片元件，只在畫布 (Canvas) 上顯示
  capture.hide();
}

function draw() {
  // 設定背景顏色為 #bde0fe
  background('#bde0fe');

  // 計算影像顯示的寬度與高度 (畫布寬高的 60%)
  let videoW = width * 0.6;
  let videoH = height * 0.6;

  // 計算置中座標
  let x = (width - videoW) / 2;
  let y = (height - videoH) / 2;

  // 修正左右顛倒問題：使用鏡射處理
  push();
  translate(x + videoW, y); // 將原點移至影像顯示區域的右側
  scale(-1, 1);            // 水平翻轉座標軸
  image(capture, 0, 0, videoW, videoH);
  pop();
}

// 當視窗大小改變時，自動調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
