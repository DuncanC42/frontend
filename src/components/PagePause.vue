<script setup>

/**
 * Pour utiliser ce composant il faudra lui donner en props un temps en secondes pour qu'il puisse l'afficher dans le chrono
 * 
 * const emit = defineEmits(['pause', 'unpause', 'retry', 'leave']) permet de faire savoir au parent qu'une action s'est réalisé dans l'enfant
 * 
 * Dans le parent : <PagePause :time="..." @pause="<ta_fonction>" ...>
 * 
 * Ici quand pause sera "activé" dans l'enfant alors le parent executera la fonction (<ta_fonction>) passé en param
 * 
 * Pour pause/unpause le composant gère tout seule la popup mais c'est à vous de mettre en pause votre jeu avec un fonction comme ci-dessus
 * 
 * La redirection se fait toute seule mais attention à vous de modifier la musique si necessaire
 * 
 * Pour le retry je vous conseille de recréer le jeu : game.destroy(true); --> supprime la canva  initJeu(); --> fonction que vous avez fait pour init votre jeu
 * ⚠️ Pensez à bien reset le timer
 * 
 */

import { ref, computed } from 'vue';
import ButtonMenu from './buttons/ButtonMenu.vue';
import BlurFilter from './BlurFilter.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const isPaused = ref(false)

const props = defineProps({
    time: {
        type: Number,
        default: 0
    },
})

const timeToDisplay = computed(() => {
    const minutes = Math.floor(props.time / 60)
        .toString()
        .padStart(2, '0');
    const seconds = (props.time % 60)
        .toString()
        .padStart(2, '0');
    return `${minutes}'${seconds}`;
})

const emit = defineEmits(['pause', 'unpause', 'retry', 'leave'])

const handlePause = () => {
    emit('pause')
    isPaused.value = true
}

const handleUnpause = () => {
    emit('unpause')
    isPaused.value = false
}

const handleLeave = () => {
    emit('leave')
    router.push('home')
}

const handleRetry = () => {
    emit('retry')
    isPaused.value = false
}

</script>

<template>
    <ButtonMenu @click="handlePause" icon="pause" :classArray="['littleSize']" id="bouton"></ButtonMenu>
    <div v-show="isPaused" id="panel">
        <BlurFilter :is-open="true" style="z-index: 100;"></BlurFilter>
        <div id="pause-menu">
            <div>
                <h2>Pause</h2>
                <hr>
            </div>
            <div class="timer">
                <span>{{ timeToDisplay }}</span>
                <font-awesome-icon :icon="['fas', 'stopwatch']" />

            </div>
            <div class="button-list">
                <ButtonMenu @click="handleLeave" icon="door-open" :class-array="['normalSize']"></ButtonMenu>
                <ButtonMenu @click="handleRetry" icon="rotate-right" :class-array="['normalSize']"></ButtonMenu>
                <ButtonMenu @click="handleUnpause" icon="play" :class-array="['normalSize']"></ButtonMenu>
            </div>
        </div>

    </div>
</template>

<style scoped>
#bouton {
    position: absolute;
    top: 70px;
    right: 15px;
    z-index: 100;
}

#panel {
    z-index: 101;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    padding-top: 10vh;
}

.timer {
    font-size: xx-large;
}

.timer span {
    margin-right: 10px;
}

hr {
    width: 40vw;
    height: 2px;
    background-color: white;
    border-radius: 2px;
}

#pause-menu {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 70vh;
    color: white;
    position: relative;
    z-index: 101;
}

h2 {
    font-size: xx-large;
    font-weight: normal;
    text-align: center;
}

.button-list {
    display: flex;
    gap: 10vw;
}
</style>