<script setup>

import { ref } from 'vue'
import { fetchBackend } from '@/composable/fetchBackend';
import { useInfiniteScroll } from '@vueuse/core'

const list = ref(null)

const props = defineProps({
    route: {
        type: String,
        required: true,
    }
})

let page = 1
const myPlace = ref(0)
const isLoading = ref(false)

useInfiniteScroll(list, () => {
    if (isLoading.value) return

    isLoading.value = true
    fetchBackend(`api/leaderboard/${props.route}`, 'GET', null, { limit: 10, page: page })
        .then(response => {
            if (response.status === 200) {
                const data = response.data
                if (data.leaderboard && data.leaderboard.players && data.leaderboard.players.length > 0) {
                    classement.value.push(...data.leaderboard.players)
                    page++
                }
                if (data.currentPlayer) {
                    myPlace.value = data.currentPlayer.position
                }
            } else {
                console.error('Error fetching leaderboard:', response.statusText)
            }
        })
        .catch(error => {
            console.error('Failed to fetch leaderboard:', error)
        })
        .finally(() => {
            isLoading.value = false
        })
},
    {
        distance: 1,
        canLoadMore: () => {
            return !isLoading.value
        },
    }
)

const classement = ref([])

</script>

<template>
    <div class="leaderboard" ref="list">
        <div v-for="(score, index) in classement" :key="index" class="row-container">

            <hr v-if="index == myPlace" />
            <div class="row"
                :class="{ 'gold-text': index === 0, 'silver-text': index === 1, 'copper-text': index === 2, 'sticky': index > 2 && myPlace == index + 1 }">
                <span>{{ index + 1 }}</span>
                <span>{{ score.username }}</span>
                <span>{{ score.score }} pts</span>
            </div>
            <!-- Only add hr if not the last item -->
            <hr v-if="index !== classement.length - 1 && index + 1 != myPlace" />
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
    backdrop-filter: blur(10px);
    font-weight: bold;
}

.sticky span {
    color: #0a004e;
}

.gold-text,
.silver-text,
.copper-text,
.sticky>span {
    animation: ping 1s linear infinite;
}

@keyframes ping {

    50% {
        scale: 1.02;
    }

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