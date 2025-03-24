<template>
  <!--  <FondEcran image="assets/mon-fond.jpg" />-->
  <BlurFilter :isOpen="true" />
  <div class="classement-component-container">
    <div class="classement-container">
      <div class="podium">
        <div v-if="podium[1]" class="place second">
          <div class="circle">2</div>
          <div class="name">{{ podium[1].name ? podium[1].name : "-"}}</div>
        </div>
        <div v-if="podium[0]" class="place first">
          <div class="crown">👑</div>
          <div class="circle">1</div>
          <div class="name">{{ podium[0].name ? podium[0].name : "-"}}</div>
        </div>
        <div v-if="podium[2]" class="place third">
          <div class="circle">3</div>
          <div class="name">{{ podium[2].name ? podium[2].name : "-" }}</div>
        </div>
      </div>

      <div class="classement-list">
        <h3>Classement :</h3>

        <div
            v-for="(joueur) in podium"
            :key="joueur.rank"
            :class="{
          'you': joueur.id === currentPlayerId,
          'first-place': joueur.rank === 1,
          'second-place': joueur.rank === 2,
          'third-place': joueur.rank === 3
        }"
        >
          <span>{{ joueur.rank ? joueur.rank : "-" }}. {{ joueur.name ? joueur.name : "-" }}</span>
          <span>{{ joueur.score ? joueur.score : "-" }}</span>
        </div>

        <hr v-if="yourIndex >= 3" class="white-separator" />

        <div
            v-for="joueur in joueurContexte"
            v-if="yourIndex >= 3"
            :key="'context-' + joueur.rank"
            :class="{
            'you': joueur.id === currentPlayerId,
            'first-place': joueur.rank === 1,
            'second-place': joueur.rank === 2,
            'third-place': joueur.rank === 3
          }"
        >
          <span>{{ joueur.rank ? joueur.rank : "-" }}. {{ joueur.name ? joueur.name : "-" }}</span>
          <span>{{ joueur.score ?joueur.score : "-" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue';
import BlurFilter from './BlurFilter.vue';

const props = defineProps({
  joueurs: {
    type: Array,
    required: true,
    default: () => []
  },
  currentPlayerId: {
    type: String,
    required: true
  }
});


const classementComplet = computed(() => {
  return [...props.joueurs]
      .sort((a, b) => parseFloat(a.score.replace(',', '.')) - parseFloat(b.score.replace(',', '.')))
      .map((joueur, index) => ({
        ...joueur,
        rank: index + 1
      }));
});

const podium = computed(() => classementComplet.value.slice(0, 3));

const yourIndex = computed(() =>
    classementComplet.value.findIndex(joueur => joueur.id === props.currentPlayerId)
);

// Contexte modifié pour éviter d'afficher le joueur 3 s'il est déjà dans le podium
const joueurContexte = computed(() => {
  if (yourIndex.value < 3) return [];

  const start = Math.max(yourIndex.value - 1, 0);
  const joueurs = classementComplet.value.slice(start, start + 3);

  // Filtrer pour ne pas afficher les joueurs déjà présents dans le podium
  return joueurs.filter(joueur => !podium.value.some(podiumJoueur => podiumJoueur.id === joueur.id));
});
</script>

<style scoped>

.classement-component-container {
  width: 100vw;
  display: flex;
  justify-content: center;

}

/* Styles existants */
.classement-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: fixed;
  z-index: 100;
  padding: 2rem;
  color: white;
  text-align: center;
}

.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 1rem;
}

.place {
  background: gold;
  border-radius: 0.5rem;
  padding: 0.5rem;
  width: 80px;
  position: relative;
}

.first { height: 120px; background: gold; }
.second { height: 100px; background: silver; }
.third { height: 80px; background: #cd7f32; }

.circle {
  background: #fff;
  color: #000;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.crown {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.2rem;
}

.name {
  margin-top: 0.5rem;
  font-weight: bold;
}

.score {
  font-size: 0.8rem;
}

.classement-list {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
}

.classement-list h3 {
  margin-bottom: 0.5rem;
}

.classement-list div {
  display: flex;
  justify-content: space-between;
  padding: 0.2rem 0;
}

.you {
  color: #ffcc00;
  font-weight: bold;
  background-color: rgba(255, 204, 0, 0.1);
  border-radius: 0.3rem;
  padding: 0.2rem 0.5rem;
}

/* Couleurs pour les places dans le classement */
.first-place {
  color: gold;
  font-weight: bold;
}

.second-place {
  color: silver;
  font-weight: bold;
}

.third-place {
  color: #cd7f32; /* bronze */
  font-weight: bold;
}

/* Nouveau style pour le séparateur blanc */
.white-separator {
  border: none;
  border-top: 1px solid white;
  margin: 0.5rem 0;
}
</style>