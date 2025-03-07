# A-Frame GIF Shader

這是一個整合了 [mayognaise/aframe-gif-shader](https://github.com/mayognaise/aframe-gif-shader) 和 [mayognaise/aframe-gif-component](https://github.com/mayognaise/aframe-gif-component) 的 TypeScript 重寫版本，擴展了對 A-Frame 版本的支援（1.3.0 至 1.7.0）。原作者的 shader 是受到 [@gtk2k 的範例](https://github.com/gtk2k/gtk2k.github.io/tree/master/animation_gif)啟發，而本版本將 shader 和 component 的功能整合成單一套件。我們使用 [gifuct-js](https://github.com/matt-way/gifuct-js) 進行高效的 GIF 解碼，並加入了完整的 TypeScript 支援。

[English](README.md) | 繁體中文

## 功能特點

- 整合 shader 和 component 功能於單一套件
- 完整的 TypeScript 支援與型別定義
- 擴展的 A-Frame 版本相容性（1.3.0 至 1.7.0）
- 在 A-Frame 場景中高效顯示動態 GIF
- 支援動畫控制（播放、暫停、切換播放狀態）
- 與 A-Frame 的材質系統完全相容
- 使用 gifuct-js 優化的渲染性能
- 支援透明度和顏色調整
- 逐幀 GIF 控制
- 正確的幀處理方法
- 支援透明 GIF

## 安裝

### CDN 安裝（推薦）

```html
<script src="https://aframe.io/releases/1.7.0/aframe.min.js"></script>
<!-- 使用 jsDelivr CDN（推薦） -->
<script src="https://cdn.jsdelivr.net/gh/gloomcheng/aframe-gif-shader@latest/dist/aframe-gif-shader.min.js"></script>

<!-- 或使用 GitHub 原始檔（不建議用於生產環境） -->
<script src="https://raw.githubusercontent.com/gloomcheng/aframe-gif-shader/main/dist/aframe-gif-shader.min.js"></script>
```

### 本地安裝

1. 複製專案：

```bash
git clone https://github.com/gloomcheng/aframe-gif-shader.git
```

2. 安裝依賴並建置：

```bash
cd aframe-gif-shader
npm install
npm run build
```

3. 在專案中引入：

```html
<script src="path/to/aframe-gif-shader/dist/aframe-gif-shader.min.js"></script>
```

注意：此套件無法透過 npm 安裝，因為原始套件名稱已被註冊。

## 基本用法

### 使用 GIF 組件（推薦）

```html
<a-entity
  gif="
  src: url(animation.gif);
  autoplay: true;
  repeat: 1 1;
"
></a-entity>
```

### 使用 GIF Shader

```html
<a-entity
  gif-shader="
  src: url(animation.gif);
  autoplay: true;
  repeat: 1 1;
  opacity: 1.0;
  transparent: true;
"
></a-entity>
```

## 組件屬性

### GIF 組件屬性

| 屬性     | 描述                    | 預設值 |
| -------- | ----------------------- | ------ |
| src      | GIF 圖片的 URL 或選擇器 | null   |
| autoplay | 是否自動播放動畫        | true   |
| repeat   | 紋理重複（x, y）        | 1 1    |

### GIF Shader 屬性

| 屬性        | 描述                    | 預設值 |
| ----------- | ----------------------- | ------ |
| src         | GIF 圖片的 URL 或選擇器 | null   |
| autoplay    | 是否自動播放動畫        | true   |
| color       | 基礎顏色                | none   |
| fog         | 是否受霧效影響          | true   |
| opacity     | 不透明度                | 1.0    |
| alphaTest   | Alpha 測試閾值          | 0.0    |
| repeat      | 紋理重複（x, y）        | 1 1    |
| depthTest   | 是否進行深度測試        | true   |
| depthWrite  | 是否寫入深度緩衝區      | true   |
| transparent | 是否啟用透明            | true   |

## 方法

### GIF 組件方法

```javascript
const entity = document.querySelector("[gif]");

// 播放動畫
entity.components.gif.play();

// 暫停動畫
entity.components.gif.pause();
```

### GIF Shader 方法

```javascript
const entity = document.querySelector("[gif-shader]");

// 播放動畫
entity.components["gif-shader"].play();

// 暫停動畫
entity.components["gif-shader"].pause();

// 切換播放/暫停狀態
entity.components["gif-shader"].togglePlayback();
```

## 使用範例

### 基本動畫

```html
<a-scene>
  <a-assets>
    <img id="gif-texture" src="animation.gif" />
  </a-assets>

  <!-- 使用 GIF 組件 -->
  <a-box position="-1 1 -3" gif="src: #gif-texture"></a-box>

  <!-- 使用 GIF Shader -->
  <a-sphere
    position="1 1 -3"
    gif-shader="
    src: url(animation.gif);
    color: #FFF;
    opacity: 0.9;
  "
  ></a-sphere>
</a-scene>
```

### 控制動畫播放

```html
<a-scene>
  <a-box
    id="animated-box"
    position="0 1.5 -3"
    gif="src: url(animation.gif); autoplay: false;"
  >
  </a-box>

  <script>
    // 點擊時播放動畫
    document
      .querySelector("#animated-box")
      .addEventListener("click", function () {
        this.components.gif.play();
      });
  </script>
</a-scene>
```

## 瀏覽器支援

- Chrome（桌面版和 Android 版）
- Firefox（桌面版和 Android 版）
- Safari（macOS 和 iOS）

## 已知問題

- **渲染殘影**：某些 GIF 動畫可能出現殘影或視覺破損。這是當前渲染實現的已知限制，在具有複雜透明度或處置方法的 GIF 中特別明顯。
- **大型 GIF 檔案的效能**：由於目前採用逐幀渲染的方式，較大的 GIF 檔案（高解析度或多幀數）可能會影響效能。

我們正在積極解決這些問題。如果您遇到這些問題，可以嘗試以下解決方案：

- 使用較小的 GIF 檔案
- 減少場景中動態 GIF 的數量
- 調整元素位置以減少右側殘影的可見性

## 開發建置

```bash
git clone https://github.com/gloomcheng/aframe-gif-shader.git
cd aframe-gif-shader
npm install
npm run build
```

## 授權和依賴

本專案使用 [MIT 授權](LICENSE) - 詳見 LICENSE 文件。

### 核心依賴

- [A-Frame](https://github.com/aframevr/aframe) (MIT 授權) - 用於建構虛擬實境體驗的網頁框架
- [Three.js](https://github.com/mrdoob/three.js) (MIT 授權) - JavaScript 3D 函式庫
- [gifuct-js](https://github.com/matt-way/gifuct-js) (MIT 授權) - 純 JavaScript GIF 解碼器

### 開發依賴

- TypeScript (Apache-2.0 授權)
- Webpack (MIT 授權)
- 其他 TypeScript 和 Webpack 相關套件 (MIT 授權)

所有依賴都與 MIT 授權條款相容。完整的依賴清單和其授權資訊，請查看 `package.json` 文件。

## 貢獻

歡迎提交 Pull Request 來協助改進這個專案！

## 致謝

- [mayognaise/aframe-gif-shader](https://github.com/mayognaise/aframe-gif-shader) - 原始著作實現
- [A-Frame](https://aframe.io) - 優秀的 WebXR 框架
- [@gtk2k](https://github.com/gtk2k) - 原始 GIF 動畫實現參考
- [gifuct-js](https://github.com/matt-way/gifuct-js) - 快速高效的 GIF 解碼器
- [Matt Way & Nick Drewe](https://github.com/matt-way) - gifuct-js 的作者
