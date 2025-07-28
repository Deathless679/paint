function getImagesSource(e: ClipboardEvent) {
  if (e.clipboardData) {
    const items = e.clipboardData.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const blob = items[i].getAsFile();
          const URLObj = window.URL || window.webkitURL;
          return URLObj.createObjectURL(blob)
        }
      }
    }
  }
}

export function handlePasteImage(e: ClipboardEvent, context: CanvasRenderingContext2D, offset: { x: number, y: number }) {
  const pastedImage = new Image();
  pastedImage.onload = () => context.drawImage(pastedImage, offset.x, offset.y)
  pastedImage.src = getImagesSource(e);
}
