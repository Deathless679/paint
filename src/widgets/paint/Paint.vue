<script lang="ts" setup>
import { computed, ref } from 'vue'
import { usePaint } from '@/widgets/paint/index.ts'

const paintRoot = ref<HTMLElement | null>(null)

const paint = usePaint(paintRoot);

const lineWidthRef = ref(0);
const lineColor = ref()

paint.onReady().then((pt) => {
  const { stop } = pt.onDrawing({
    lineWidth: computed(() => lineWidthRef.value),
    lineColor: computed(() => lineColor.value)
  })
})
</script>

<template>
  <div class="paint">
    <header class="paint__header" >
      <input class="paint__number" type="number" v-model="lineWidthRef" >
      <input class="paint__number" type="color" v-model="lineColor" >
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
    display: flex;
    align-items: center;
    gap: 10px;
    height: 40px;
    width: 100%;
    background: rgba(0, 0, 0, 0.2);
  }

  .paint__content {
    width: fit-content;
    max-width: 100%;
    overflow: auto;
    border: 1px solid gray;
  }

  .paint__number {
    border: 1px solid black;
    max-width: 50px;
  }

}
</style>