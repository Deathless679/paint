export interface PCanvasStateResponse {
  saveState: () => void,
  undoState: () => void,
}

export function useCanvasState(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): PCanvasStateResponse {
  const canvasHistory: ImageData[] = [];
  let currentStep = 0;

  const saveState = () => {
    if (!context) return

    while (currentStep <= canvasHistory.length - 1) canvasHistory.pop()

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    canvasHistory.push(imageData)
    currentStep++
  }

  const undoState = () => {
    if (currentStep <= 0 || !context) return

    currentStep--
    const imageData = canvasHistory[currentStep]
    context.putImageData(imageData, 0, 0)
  }


  return { saveState, undoState }
}
