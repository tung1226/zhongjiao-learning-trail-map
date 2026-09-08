# 中角國小學習步道地圖

這是一個可直接部署到 GitHub Pages 的純靜態網站，不需要 Node.js、不需要資料庫。

## 網站內容

- 首頁全螢幕 MP4 動畫（可開啟/關閉聲音、可跳過）
- 動畫結束後進入「中角國小學習步道地圖」
- 校園平面圖上標示 01–30 學習步道號碼
- 點擊號碼會跳出學道名稱與簡介
- 可搜尋學道名稱或序號
- 右側「學道總覽」可快速選擇
- 支援手機、平板、電腦
- Google Sites 尚未完成時顯示「學習內容建置中」
- 附 `position-editor.html`，可拖曳調整 30 個號碼的位置

## 檔案結構

```text
index.html
styles.css
trail-data.js
app.js
position-editor.html
assets/
  campus-map.jpg
  intro.mp4
  intro-poster.jpg
  favicon.svg
```

## 未來加入 Google Sites 連結

打開 `trail-data.js`，找到對應學道，例如：

```js
{ id: 29, name: "3D創客衝浪板", x: 25.2, y: 62.5, url: "" }
```

將 `url` 改成 Google Sites 網址：

```js
{ id: 29, name: "3D創客衝浪板", x: 25.2, y: 62.5, url: "https://sites.google.com/..." }
```

存檔後重新部署即可。網址有填寫時，彈出卡片會自動出現「進入學習 →」按鈕。

## 調整地圖上的號碼位置

1. 在瀏覽器開啟 `position-editor.html`。
2. 直接拖曳地圖上的 01–30 號碼。
3. 按「複製座標」。
4. 將輸出的 x / y 數值更新回 `trail-data.js` 對應項目。

目前座標為依學道名稱與平面圖判讀的**第一版位置**，建議部署前再依實際校園學道位置微調。

## GitHub Pages 部署方式

1. 在 GitHub 建立一個新的 Repository，例如 `zhongjiao-learning-trail-map`。
2. 將本資料夾內**所有檔案與 assets 資料夾**上傳到 Repository 根目錄。
3. 到 Repository → **Settings** → **Pages**。
4. 在 **Build and deployment**：
   - Source：選 `Deploy from a branch`
   - Branch：選 `main`
   - Folder：選 `/ (root)`
5. 按 Save，稍等約 1–3 分鐘即可取得 GitHub Pages 網址。

## 注意：首頁動畫聲音

Chrome、Safari 與手機瀏覽器通常禁止「有聲音的自動播放」。因此本網站會先靜音自動播放，右上角有「開啟聲音」按鈕。若瀏覽器連靜音自動播放也阻擋，網站會顯示「播放動畫」按鈕讓使用者手動開始。

## 2026-08-07 地圖座標更新

已依照使用者提供的「1～30 學道地圖標註圖」重新校正全部互動按鈕位置。各按鈕仍依原序號對應各學道項目；Google Sites 網址尚未提供，因此 `url` 欄位仍維持空白，未來可直接填入連結。


## 2026-08-07 滾動操作修正
- 修正滑鼠游標停在校園地圖上時，整頁無法順暢上下滾動的問題。
- 桌機滑鼠滾輪／觸控板上下滑：改為捲動整個頁面。
- 地圖仍保留左右捲動與縮放功能。
- 手機／平板上下滑動可直接繼續瀏覽頁面，不必先點擊頁首。
