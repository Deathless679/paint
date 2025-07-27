import type { Ref } from 'vue'
import { onMounted, ref, watch } from 'vue'

interface POptions {
  size: POptionsSize
}

interface PReturn {
  onDrawing: () => PDrawingReturn
}

type POptionsSize = number | {
  height: number,
  width: number
}

interface PDrawingOptions {
  cbDraw?: (...args: any) => void,
  cbDrawMove?: (...args: any) => void,
  cbDrawEnd?: (...args: any) => void,
}

interface PDrawingReturn {
  resume: () => void;
  stop: () => void;
  undoLastDrawing: () => void;
}

const defaultOptions: POptions = {
  size: 1000
}

function initPaint(root: Ref<HTMLElement>, options: POptions = defaultOptions): PReturn {
  const canvas: HTMLCanvasElement = document.createElement('canvas')
  const context = canvas.getContext('2d')
  root.value.appendChild(canvas)

  const canvasSize = handleCanvasSize(options.size)
  canvas.width = canvasSize.width
  canvas.height = canvasSize.height

  function handleCanvasSize(size: POptionsSize): Record<string, number> {
    if (typeof size === 'number') return { height: size, width: size }
    return { height: size.height, width: size.width }
  }


  const drawingHistory: ImageData[] = []
  let currentStep = -1

  function onDrawing(options?: PDrawingOptions) {
    const isDrawing = ref<boolean>(false)
    const isStopping = ref<boolean>(false)

    const saveCanvasState = () => {
      if (!context) return

      while (currentStep < drawingHistory.length - 1) drawingHistory.pop()

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      drawingHistory.push(imageData)
      currentStep++
    }

    const undoLastDrawing = () => {
      if (currentStep <= 0 || !context) return

      currentStep--
      const imageData = drawingHistory[currentStep]
      context.putImageData(imageData, 0, 0)

      options?.cbDrawUndo && options.cbDrawUndo()
    }

    const stop = () => isStopping.value = true
    const resume = () => isStopping.value = false

    watch(isStopping, (v) => {
      if (v) {
        canvas.onmousedown = null
        canvas.onmousemove = null
        canvas.onmouseup = null
      } else {
        canvas.onmousedown = ({ offsetX, offsetY }) => {
          saveCanvasState()
          isDrawing.value = true
          if (context) {
            context.beginPath()
            context.moveTo(offsetX, offsetY)
          }
          options?.cbDraw && options.cbDraw()
        }

        canvas.onmousemove = ({ offsetX, offsetY }) => {
          if (isDrawing.value) {
            if (context) {
              context.lineTo(offsetX, offsetY)
              context.stroke()
            }
            options?.cbDrawMove && options.cbDrawMove()
          }
        }

        canvas.onmouseup = () => {
          isDrawing.value = false
          options?.cbDrawEnd && options.cbDrawEnd()
        }
      }
    }, { immediate: true })

    return { stop, resume, undoLastDrawing }
  }

  return { onDrawing }
}

interface UPaintReturn {
  instance: Ref<PReturn | null>;
  onReady: () => Promise<PReturn>
}


export const usePaint = (root: Ref<HTMLElement | null>, options?: POptions): UPaintReturn => {
  const result = ref(null) as UPaintReturn['instance']
  const isMounted = ref<boolean>(false)

  onMounted(() => {
    if (root.value !== null)
      result.value = initPaint.call(this, root, options)

    isMounted.value = true
  })

  return {
    instance: result,
    onReady: () => new Promise<PReturn>((resolve) => {
      watch(isMounted, () => result.value && resolve(result.value), { once: true })
    })
  }
}

