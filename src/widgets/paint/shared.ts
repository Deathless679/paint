import type { POptionsSize } from '@/widgets/paint/types.ts'

export function handleCanvasSize(size: POptionsSize): Record<string, number> {
  if (typeof size === 'number') return { height: size, width: size }
  return { height: size.height, width: size.width }
}

