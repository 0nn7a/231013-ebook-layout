export function imgCompressor(file, width) {
  return new Promise((resolve, reject) => {
    // 創建一個新的Image物件
    const img = new Image();
    img.src = file;

    // 等待圖片加載：使用 Canvas 重繪壓縮
    img.onload = () => {
      // 創建一個 Canvas 物件
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // 設置 Canvas 的尺寸
      canvas.width = width;
      canvas.height = (width * img.height) / img.width;

      // 把圖片繪製到 Canvas，使用 toDataURL 轉換為 base64 格式
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 調整圖片壓縮程度並回傳
      resolve(canvas.toDataURL("image/jpeg"));
    };
  });
}
