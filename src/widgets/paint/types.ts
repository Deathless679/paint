import type { DrawingOptions, HDrawingReturn } from '@/widgets/paint/drawing/types.ts'
import { type PCanvasStateResponse } from '@/widgets/paint/state'
import type { Ref } from 'vue'

export interface POptions {
  size: POptionsSize
}

export type POptionsSize = number | {
  height: number,
  width: number
}

export interface PReturn {
  onDrawing: (options: DrawingOptions) => HDrawingReturn
  state: PCanvasStateResponse
}

export interface UPaintReturn {
  instance: Ref<PReturn | null>;
  onReady: () => Promise<PReturn>
}