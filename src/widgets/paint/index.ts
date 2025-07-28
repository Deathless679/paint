import type { Ref } from 'vue'
import { onMounted, ref, watch } from 'vue'
import {
  type DrawingOptions,
  type HDrawingReturn,
  handleDrawing,
} from '@/widgets/paint/drawing'
import { handlePasteImage } from '@/widgets/paint/paste/images.ts'
import { useEventListener, useMagicKeys, useMouse } from '@vueuse/core'
import { PCanvasStateResponse, useCanvasState } from '@/widgets/paint/state.ts'
import { handleCanvasSize } from '@/widgets/paint/shared.ts'

interface POptions {
  size: POptionsSize
}

type POptionsSize = number | {
  height: number,
  width: number
}

interface PReturn {
  onDrawing: (options: DrawingOptions) => HDrawingReturn
  state: PCanvasStateResponse
}

interface UPaintReturn {
  instance: Ref<PReturn | null>;
  onReady: () => Promise<PReturn>
}

const defaultOptions: POptions = {
  size: {
    height: window.innerHeight - 50,
    width: window.innerWidth - 10
  }
}

function initPaint(root: Ref<HTMLElement>, options: POptions = defaultOptions): PReturn {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  root.value.appendChild(canvas)

  const { Ctrl_Z } = useMagicKeys();
  const { x, y } = useMouse();

  const state: PReturn["state"] = useCanvasState(canvas, context);

  watch(Ctrl_Z, (v) => v && state.undoState())

  const canvasSize = handleCanvasSize(options.size)
  canvas.width = canvasSize.width
  canvas.height = canvasSize.height

  const onDrawing: PReturn["onDrawing"] = (options) => handleDrawing(canvas, context, state.saveState).drawing(options);

  useEventListener('paste', (e) => {
    state.saveState();
    handlePasteImage(e, context, { x: x.value, y: y.value })
  })

  return { onDrawing, state }
}

export const usePaint = (root: Ref<HTMLElement | null>, options?: POptions): UPaintReturn => {
  const result = ref(null) as UPaintReturn['instance']
  const isMounted = ref<boolean>(false)

  onMounted(() => {
    if (root.value instanceof HTMLElement)
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


