<template>
  <div class="root-container">
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

        <div class="boutons">
          <ButtonEndGame 
            :classArray="['share']" 
            id="boutons"
            @click="handleShare"
            text="Partager"
          />
          <ButtonEndGame 
            :classArray="['continue']" 
            id="boutons"
            @click="handleContinue"
            text="Continuer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import ButtonEndGame from './buttons/ButtonEndGame.vue';

// Import pour la musique
import ambianceSound from '@/assets/sons/musiques/ambiance/flow.mp3';
import { volumeStore } from '@/stores/volume';
import { useMusic } from '@/composable/volumes';

// Gestion de la musique
const audio = ref(null);
const volumes = volumeStore();
const { switchAudio } = useMusic();

// Initialiser l'audio lorsque le composant est monté
onMounted(() => {
  switchAudio(ambianceSound);
});

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value = null;
  }
});

// Surveillance du volume
watch(
  () => volumes.effet_sonore,
  (newVolume) => {
    if (audio.value) audio.value.volume = newVolume
  }
)

const router = useRouter();
const toast = useToast();

const props = defineProps({
  joueurs: {
    type: Array,
    required: false,  
    default: () => [],
  },
  currentPlayerId: {
    type: String,
    required: true
  },
  currentScore: {
    type: Number,
    required: false,
    default: 0
  }
});


const classementComplet = computed(() => {
  const baseJoueurs = props.joueurs.length ? props.joueurs : [
    { id: props.currentPlayerId, name: "Vous", score: props.currentScore }
  ];
  
  return [...baseJoueurs]
    .sort((a, b) => b.score - a.score)
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

const emit = defineEmits(['quit']);

const handleContinue = () => {
  router.push('/home'); 
};

const handleShare = async () => {
  const shareData = {
    title: 'Mon score',
    text: `J'ai obtenu ${props.currentScore} points !`,
    url: window.location.href,
  };

  try {
    // 1. Essayer l'API Web Share (mobile)
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    
    // 2. Fallback pour desktop/navigateurs non supportés
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(
        `${shareData.text}\n${shareData.url}`
      );
      toast.success('Score copié dans le presse-papiers !'); // Ou alert()
      return;
    }
    
    // 3. Fallback ultime
    fallbackShare(shareData.text);
  } catch (err) {
    console.error('Erreur de partage:', err);
    fallbackShare(shareData.text);
  }
};

const fallbackShare = (text) => {
  // Solution alternative pour les vieux navigateurs
  const textArea = document.createElement('textarea')
  textArea.value = `${text}\n${window.location.href}`
  document.body.appendChild(textArea)
  textArea.select()
  
  try {
    document.execCommand('copy')
    toast.info('Score copié !') // Ou alert()
  } catch (err) {
    toast.error('Impossible de copier le score') // Ou alert()
    console.error('Fallback copy failed:', err)
  }
  
  document.body.removeChild(textArea)
  
  // Option: Ouvrir un mail ou autre
  window.open(
    `mailto:?subject=Mon score&body=${encodeURIComponent(text)}`,
    '_blank'
  )
};
</script>

<style scoped>

.root-container {
  position: relative;
  width: 100%;
}

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

.boutons{
  z-index: 100;
  display: flex;
  padding-top: 2em;
}

#boutons{
  margin: 0em 1em;
}
</style>