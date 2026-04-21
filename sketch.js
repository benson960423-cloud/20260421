let capture;
let pg;
let bubbles = [];

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 取得攝影機影像
  capture = createCapture(VIDEO);
  
  // 隱藏預設產生的 HTML 影片元件，只在畫布 (Canvas) 上顯示
  capture.hide();

  // 產生一個與視訊畫面比例相同的繪圖緩衝區 (Graphics 物件)
  pg = createGraphics(windowWidth * 0.6, windowHeight * 0.6);

  // 初始化泡泡
  for (let i = 0; i < 30; i++) {
    bubbles.push(new Bubble(pg.width, pg.height));
  }
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
  
  // 實作馬賽克與黑白化處理
  capture.loadPixels();
  let stepSize = 20; // 設定單位大小為 20x20
  
  if (capture.pixels.length > 0) {
    noStroke();
    for (let vY = 0; vY < capture.height; vY += stepSize) {
      for (let vX = 0; vX < capture.width; vX += stepSize) {
        // 取得該單位的像素索引 (RGBA)
        let index = (vX + vY * capture.width) * 4;
        let r = capture.pixels[index];
        let g = capture.pixels[index + 1];
        let b = capture.pixels[index + 2];
        
        // 計算平均值取得黑白顏色值 (R+G+B)/3
        let avg = (r + g + b) / 3;
        fill(avg);
        
        // 將攝影機座標映射到畫布顯示區域的寬高 (60%)
        let drawX = map(vX, 0, capture.width, 0, videoW);
        let drawY = map(vY, 0, capture.height, 0, videoH);
        let drawW = map(stepSize, 0, capture.width, 0, videoW);
        let drawH = map(stepSize, 0, capture.height, 0, videoH);
        
        rect(drawX, drawY, drawW, drawH);
      }
    }
  }
  pop();

  // 在 graphics 緩衝區上進行繪製
  pg.clear();
  for (let b of bubbles) {
    b.update(pg.width, pg.height);
    b.show(pg);
  }

  // 將 graphics 內容顯示在視訊畫面的上方 (座標與影像對齊)
  image(pg, x, y);
}

// 當視窗大小改變時，自動調整畫布大小以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 同步調整 graphics 的大小，使其維持在 60%
  pg.resizeCanvas(windowWidth * 0.6, windowHeight * 0.6);
}

class Bubble {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.reset(true); // 初始啟動時隨機分佈高度
  }

  reset(initial = false) {
    this.x = random(this.w);
    this.y = initial ? random(this.h) : this.h + random(20, 100);
    this.r = random(5, 15); // 泡泡半徑
    this.speed = random(1, 3); // 往上漂浮的速度
    this.noiseOffset = random(1000); // 用於左右晃動的隨機偏移
  }

  update(currentW, currentH) {
    this.w = currentW;
    this.h = currentH;
    this.y -= this.speed; // 向上移動
    this.x += sin(frameCount * 0.02 + this.noiseOffset) * 0.5; // 輕微晃動

    // 如果泡泡超出頂端，重新從底部產生
    if (this.y < -this.r) {
      this.reset(false);
    }
  }

  show(canvas) {
    canvas.noStroke();
    canvas.fill(255, 255, 255, 150); // 半透明白色
    canvas.circle(this.x, this.y, this.r * 2);
    // 加一個小高光讓它看起來更像泡泡
    canvas.fill(255, 255, 255, 200);
    canvas.circle(this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.6);
  }
}
