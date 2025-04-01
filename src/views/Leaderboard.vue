<script setup>
import NavBar from '@/components/NavBar.vue';
import podium from '@/assets/images/podium.png';
import FondEcran from '@/components/FondEcran.vue';
import appartement from '@/assets/images/Appartement.png';
import BlurFilter from '@/components/BlurFilter.vue';
import ButtonNextPrevious from '@/components/buttons/ButtonNextPrevious.vue';
import TableauLeaderboard from '@/components/TableauLeaderboard.vue';
import { ref } from 'vue';

const page = ref(2)

const title_ref = {
    1: { title: 'Général', route: '' },
    2: { title: 'Carte vitale', route: 'taquin' },
    3: { title: 'C2S', route: 'tirelire' },
    4: { title: 'RIB', route: 'dino' },
    5: { title: 'Examen de prévention', route: 'fruitninja' },
    6: { title: 'M\'T dents', route: 'dents' }
}


</script>

<template>
    <div class="main">
        <div class="content">
            <div class="title">
                <img :src="podium" :alt="podium">
                <h2>{{ title_ref[page].title }}</h2>
            </div>
            <div>
                <TableauLeaderboard :route="info.route" :key="index" v-for="(info, index) in title_ref"></TableauLeaderboard>
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
</style>