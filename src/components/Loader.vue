<script setup>
import BlurFilter from './BlurFilter.vue';
</script>

<template>
    <BlurFilter :isOpen="true"></BlurFilter>
    <div class="loader">
        <div class="iconLoader">
            <svg width="64px" height="48px">
                <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
                <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
            </svg>
        </div>
        <p>Chargement...</p>
    </div>
</template>

<style scoped>
    /* From Uiverse.io by milley69 */ 
.iconLoader svg polyline {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;

}

.iconLoader svg polyline#back {
  fill: none;
  stroke: white;
}

.iconLoader svg polyline#front {
  fill: none;
  stroke: #015BA7;
  stroke-dasharray: 48, 144;
  stroke-dashoffset: 192;
  animation: dash_682 1.4s linear infinite;
}

.iconLoader {
    display: flex;
    justify-content: center;
    z-index: 3;
    position: relative; 
}

.loader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: 100;
}

@keyframes dash_682 {
  72.5% {
    opacity: 0;
  }

  to {
    stroke-dashoffset: 0;
  }
}

p {
    font-size: 20px;
    font-family: 'source sans pro';
    color: white;

}
</style>