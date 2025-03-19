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
const mainColor = '#444444'; 
const secondaryColor = '#8E8E8E'; 

// Liste des liens et icônes associées
const links = ref([
  { path: '/', icon: 'house' },
  { path: '/about', icon: 'trophy' },
  { path: '/services', icon: 'chart-simple' },
  { path: '/contact', icon: 'gift' }
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
  background: #dfdfdf94;
  padding: 8px 40px;
  border-radius: 50px; 
  width: fit-content; 
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); 
}


.nav-link {
  text-decoration: none;
  font-size: 18px;
  padding: 8px 20px;
  border-radius: 5px;
  transition: background 0.3s ease;
}

</style>
