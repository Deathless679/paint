<script lang="ts" setup>
import { ref } from 'vue'
import { usePaint } from '@/widgets/paint/shared.ts'

const paintRoot = ref<HTMLElement | null>(null)

const paint = usePaint(paintRoot)

let handleLastDrawing;
paint.onReady().then((pt) => {
  const { stop, undoLastDrawing } = pt.onDrawing({
    cbDraw: () => console.log(123)
  })
  handleLastDrawing = undoLastDrawing
})
</script>

<template>
  <div class="paint">
    <header class="paint__header" >
      <button @click="handleLastDrawing"><< back</button>
    </header>
    <div class="paint__content" ref="paintRoot" />
    <div class="paint__actions"></div>
  </div>
</template>

<style scoped>
.paint {
  display: flex;
  flex-direction: column;
  width: 100%;

  .paint__header {
    height: 40px;
    width: 100%;
    background: gray;
  }
}
</style>