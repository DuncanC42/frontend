<script setup>

import { ref } from 'vue'
import { fetchBackend } from '@/composable/fetchBackend';
import { useInfiniteScroll } from '@vueuse/core'

const list = ref(null)

let counter = 1


const props = defineProps({
    route: {
        type: String,
        required: true,
    },
    myPlace: {
        type: Number,
        required: true,
    }
})

useInfiniteScroll(list, () => {
    classement.value.push({
        place: counter,
        pseudo: 'Player ' + counter,
        points: Math.round(2000 / counter),
    })
    counter++
},
    {
        distance: 1,
        canLoadMore: () => {
            return true
        },
    }
)

const classement = ref([])


</script>

<template>
    <div class="leaderboard" ref="list">
        <div v-for="(score, index) in classement" :key="index" class="row-container">

            <hr v-if="score.place - 1 == myPlace" />
            <div class="row"
                :class="{ 'gold-text': score.place === 1, 'silver-text': score.place === 2, 'copper-text': score.place === 3, 'sticky': myPlace == score.place }">
                <span>{{ score.place }}</span>
                <span>{{ score.pseudo }}</span>
                <span>{{ score.points }} pts</span>
            </div>
            <!-- Only add hr if not the last item -->
            <hr v-if="index !== classement.length - 1 && score.place != myPlace" />
        </div>
    </div>

</template>


<style scoped>
.leaderboard {
    background-color: #ffffff9f;
    height: 60vh;
    width: 85vw;
    border-radius: 20px;
    overflow-y: auto;
    color: black;
    font-size: x-large;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    z-index: 102;
    /* Added for sticky to work correctly */
    position: relative;
    /* Add padding at the top of the scroll area */
}

.row-container {
    width: 85%;
    position: relative;
    /* Important for sticky positioning context */
}

.row-container:first-of-type {
    padding-top: 10px;
}

.row {
    display: grid;
    grid-template-columns: 2fr 4fr 3fr;
    width: 100%;
    padding: 15px 0;
}

.rank {
    justify-self: start;
}

.player {
    justify-self: center;
}

.points {
    justify-self: end;
}

hr {
    height: 1px;
    background-color: rgba(0, 0, 0, 0.523);
    border: none;
    margin: 0;
}

.gold-text {
    color: rgb(255, 217, 0);
    animation: pulse-gold 5s infinite;
}

.silver-text {
    color: #ffffff;
}

.copper-text {
    color: #ff9100;
}

.copper-text,
.silver-text,
.gold-text {
    font-weight: bold;
}

.sticky {
    position: sticky;
    top: 0;
    position: relative;
    backdrop-filter: blur(4px);
    font-weight: bold;
    color: rgb(0, 68, 24);
}

.sticky span {
    animation: pulse-self 3s linear infinite;
}

.gold-text, .silver-text, .copper-text, .sticky>span {
    animation: ping 1s linear infinite;
}

@keyframes pulse-self {
    50% {
        color: rgb(24, 0, 54);
        }
}

@keyframes ping {

    50% {
        scale: 1.02;    }

}

/* Make the container of the sticky row also sticky */
.row-container:has(.sticky) {
    position: sticky;
    top: 0;
    bottom: 0;
    z-index: 5;
    margin: 0;
    padding: 0;
}

/* Fix for the last item's hr condition */
.row-container:last-child hr {
    display: none;
}
</style>