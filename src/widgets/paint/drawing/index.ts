import { reactive, ref, unref, watch } from 'vue'
import type { DrawingOptions, HDrawingReturn } from '@/widgets/paint/drawing/types.ts'

const defaultOptions: DrawingOptions = {
  cbDraw: undefined,
  cbDrawMove: undefined,
  cbDrawEnd: undefined,
  lineWidth: 1,
  lineColor: '#000000'
}

export function handleDrawing(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, saveState: () => void): HDrawingReturn {
  return {
    drawing: (options: DrawingOptions = {}) => {
      const reactiveOptions = reactive({ ...defaultOptions, ...options })
      const isDrawing = ref<boolean>(false)
      const isStopping = ref<boolean>(false)

      const stop = () => isStopping.value = true
      const resume = () => isStopping.value = false

      watch(isStopping, (v) => {
        if (v) {
          canvas.onmousedown = null
          canvas.onmousemove = null
          canvas.onmouseup = null
        } else {
          canvas.onmousedown = ({ offsetX, offsetY }) => {
            saveState()
            isDrawing.value = true
            if (context) {
              context.beginPath()
              context.moveTo(offsetX, offsetY)
            }
            reactiveOptions?.cbDraw && reactiveOptions.cbDraw()
          }

          canvas.onmousemove = ({ offsetX, offsetY }) => {
            if (isDrawing.value) {
              if (context) {
                context.lineTo(offsetX, offsetY)
                context.lineWidth = unref(reactiveOptions.lineWidth);
                context.strokeStyle = unref(reactiveOptions.lineColor);
                context.stroke()
              }
              reactiveOptions?.cbDrawMove && reactiveOptions.cbDrawMove()
            }
          }

          canvas.onmouseup = () => {
            isDrawing.value = false
            reactiveOptions?.cbDrawEnd && reactiveOptions.cbDrawEnd()
          }
        }
      }, { immediate: true })

      return { stop, resume }
    }
  }
}