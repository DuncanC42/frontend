<script setup>
import NavBar from '@/components/NavBar.vue';
import podium from '@/assets/images/podium.png';
import FondEcran from '@/components/FondEcran.vue';
import appartement from '@/assets/images/Appartement.png';
import BlurFilter from '@/components/BlurFilter.vue';
import ButtonNextPrevious from '@/components/buttons/ButtonNextPrevious.vue';
import TableauLeaderboard from '@/components/TableauLeaderboard.vue';
import { ref } from 'vue';


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

const page = ref(2)

const title_ref = {
    1: 'Général',
    2: 'Carte vitale',
    3: 'C2S',
    4: 'RIB',
    5: 'Examen de prévention',
    6: 'M\'T dents'
}


</script>

<template>
    <div class="main">
        <div class="content">
            <div class="title">
                <img :src="podium" :alt="podium">
                <h2>{{ title_ref[page] }}</h2>
            </div>
            <TableauLeaderboard route="taquin"></TableauLeaderboard>
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