import type { MaybeRef } from 'vue'

export interface DrawingOptions {
  cbDraw?: (...args: any) => void,
  cbDrawMove?: (...args: any) => void,
  cbDrawEnd?: (...args: any) => void,
  lineWidth: MaybeRef<number>
  lineColor: MaybeRef<string>
}

export interface DrawingReturn {
  resume: () => void;
  stop: () => void;
}

export interface HDrawingReturn {
  drawing: (options?: DrawingOptions) => DrawingReturn
}