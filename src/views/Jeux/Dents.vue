<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';

  import ThootbrushGame from '../../components/jeu-dents/ToothbrushGame.vue';

  const width = ref(window.innerWidth);
  const updateWidth = () => {
    width.value = window.innerWidth;
  };
  onMounted(() => {
    window.addEventListener('resize', updateWidth);
  });
  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
  });
</script>

<template>
    <div class="jeu-dents">
        <ThootbrushGame />
    </div>
</template>

<style>
  .jeu-dents {
      background-color: #1A203B;
  }
</style>