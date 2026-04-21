let capture;
let pg;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 取得攝影機影像
  capture = createCapture(VIDEO);
  
  // 隱藏預設產生的 HTML 影片元件，只在畫布 (Canvas) 上顯示
  capture.hide();

  // 產生一個與視訊畫面比例相同的繪圖緩衝區 (Graphics 物件)
  pg = createGraphics(windowWidth * 0.6, windowHeight * 0.6);
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

  // 在 graphics 緩衝區上進行繪製
  pg.clear(); // 清除上一幀內容，保持背景透明
  pg.fill(255, 255, 0, 150); // 設定半透明黃色
  pg.noStroke();
  pg.ellipse(pg.width / 2, pg.height / 2, 50, 50); // 在圖層中間畫一個圓

  // 將 graphics 內容顯示在視訊畫面的上方 (座標與影像對齊)
  image(pg, x, y);
}

// 當視窗大小改變時，自動調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 同步調整 graphics 的大小，使其維持在 60%
  pg.resizeCanvas(windowWidth * 0.6, windowHeight * 0.6);
}
