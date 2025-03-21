<template>
  <nav class="navbar">
    <router-link
      v-for="(link, index) in links"
      :key="index"
      :to="link.path"
      class="nav-link"
      @click="activeIndex = index"
    >
      <font-awesome-icon
        :icon="['fas', link.icon]"
        :style="{ color: activeIndex === index ? mainColor : secondaryColor }"
      />
    </router-link>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

// Définition des couleurs
const mainColor = '#1a1a1a'; 
const secondaryColor = '#00000049'; 

// Liste des liens et icônes associées
const links = ref([
  { path: 'home', icon: 'house' },
  { path: 'classement', icon: 'trophy' },
  { path: 'stats', icon: 'chart-simple' },
  { path: 'recompenses', icon: 'gift' }
]);

// Suivi de l'icône active
const activeIndex = ref(0);
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: center;
  align-items: center; 
  position: fixed;
  bottom: 20px;
  left: 50%; 
  transform: translateX(-50%); 
  background: #757575c2;
  padding: 8px 40px;
  border-radius: 50px; 
  width: fit-content; 
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.navbar *, .navbar{
  z-index: 200;
}


.nav-link {
  text-decoration: none;
  font-size: 18px;
  padding: 8px 20px;
  border-radius: 5px;
  transition: background 0.3s ease;
}

</style>
