<script setup>
import NavBar from '@/components/NavBar.vue';
import podium from '@/assets/images/podium.png';
import FondEcran from '@/components/FondEcran.vue';
import appartement from '@/assets/images/Appartement.png';
import BlurFilter from '@/components/BlurFilter.vue';
import ButtonNextPrevious from '@/components/buttons/ButtonNextPrevious.vue';
import { fetchBackend } from '@/composable/fetchBackend';
import { useInfiniteScroll } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue';

const props = defineProps({
    route: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    page: {
        type: Number,
        required: true,
    }
})

const list = ref(null)

useInfiniteScroll(list, () => {
    console.log('fetch new data')
},
    {
        distance: 10,
        canLoadMore: () => {
            return true
        },
    }
)


</script>

<template>
    <div class="main">
        <div class="content">
            <div class="title">
                <img :src="podium" :alt="podium">
                <h2>{{ title }}</h2>
            </div>
            <div class="leaderboard" ref="list">
                <div v-for="(r, index) in 100" :key="index">
                    <div class="row" :class="{ 'gold-text': r === 1, 'silver-text': r === 2, 'copper-text': r === 3 }">
                        <span>{{ r }}</span>
                        <span>Joueur {{ r }}</span>
                        <span>{{ (100 - Number(r)) * 100 }} pts</span>
                    </div>
                    <!-- Only add hr if not the last item -->
                    <hr v-if="index < 99">
                </div>
            </div>
            <div class="pagination">
                <ButtonNextPrevious :class="page === 1 ? 'hidden' : ''" :classArray="['previous']" />
                <div class="dot" v-for="i in 6" :id="i + 1" :class="i === page ? 'lighter-dot' : ''"></div>
                <ButtonNextPrevious :class="page === 6 ? 'hidden' : ''" :classArray="['next']" />
            </div>
        </div>
        <FondEcran style="z-index : 10; " :image="appartement"></FondEcran>
        <BlurFilter :is-open="true"></BlurFilter>
        <NavBar></NavBar>
    </div>
</template>


<style scoped>
.main {
    background-color: #9a615a;
    /* Remove negative z-index as it can cause interaction issues */
    height: 100%;
    position: relative;
}

.content {
    z-index: 101;
    color: white;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    height: 90%;
    position: relative;
}

.title {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.leaderboard {
    background-color: #ffffff78;
    height: 60vh;
    width: 85vw;
    border-radius: 20px;
    overflow-y: auto;
    color: black;
    font-size: x-large;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 0;
    z-index: 102;
}

.leaderboard>div {
    width: 85%;
    /* Add some margin between items */
}

.row {
    display: flex;
    width: 100%;
    justify-content: space-between;
    /* Remove the global outline */
}

hr {
    height: 1px;
    background-color: rgba(0, 0, 0, 0.523);
    border: none;
    margin: 0;
    margin: 10px 0;
}

.pagination {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 90vw;
}

.dot {
    height: 20px;
    width: 20px;
    background-color: #ffffff78;
    border-radius: 30px;
}

.lighter-dot {
    background-color: #ffffff;
}

.hidden {
    visibility: hidden;
}

/* Medal colors for top three ranks */
.gold-text {
    color: rgb(255, 217, 0);
}

.silver-text {
    color: #ffffff;
}

.copper-text {
    color: #ffa938;
}

.copper-text,
.silver-text,
.gold-text {
    font-weight: bold;
}
</style>