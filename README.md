# 中角國小學習步道地圖

這個資料夾可直接部署到 GitHub Pages，不需要 Node.js 或資料庫。

## 本版修正
1. 開場影片：網站已指定 `assets/開場影片.mp4`
2. 平面圖：已改為 `assets/中角學習步道圖(文字)正確.jpg`
3. 30 個學道：已全部加入對應 Google Sites 連結
4. 每一個地圖號碼與下方學道卡片都可點擊，再由「進入學習步道」前往 Google Sites

## GitHub Pages 部署
1. 建立新的 GitHub Repository。
2. 將此資料夾內所有檔案上傳到 repository 根目錄。
3. 到 Settings → Pages。
4. Source 選 Deploy from a branch。
5. Branch 選 main、資料夾選 /(root)。
6. 儲存後等待 GitHub Pages 網址產生。

## 開場影片
目前執行環境未能取得新上傳影片的實體檔案，因此網站已先設定好檔名與播放邏輯。請把「開場影片.mp4」放入 assets 資料夾即可完成。

## 調整學道位置
開啟 `position-editor.html`，拖曳 01～30 號，再把座標更新回 `trail-data.js`。
