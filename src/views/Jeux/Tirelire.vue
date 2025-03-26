<script setup>
import { ref } from 'vue'

import Jeu from '@/components/tirelire/Jeu.vue'
import PageRegles from '@/components/PageRegles.vue';

// Good pictograms
import hopital from '@/assets/tirelire/images/pictos_bons/Hopital.png';
import auditive from '@/assets/tirelire/images/pictos_bons/AideAuditive.png';
import dentiste from '@/assets/tirelire/images/pictos_bons/Dentiste.png';
import medecin from '@/assets/tirelire/images/pictos_bons/Medecin.png';
import optique from '@/assets/tirelire/images/pictos_bons/Optique.png';
import transport from '@/assets/tirelire/images/pictos_bons/TransportSanitaire.png';

// Bad pictograms
import ampoule from '@/assets/tirelire/images/pictos_faux/ampoule.png';
import courrier from '@/assets/tirelire/images/pictos_faux/courrier.png';
import etude from '@/assets/tirelire/images/pictos_faux/etude.png';
import livre from '@/assets/tirelire/images/pictos_faux/livre.png';
import maison from '@/assets/tirelire/images/pictos_faux/maison.png';
import puzzle from '@/assets/tirelire/images/pictos_faux/puzzle.png';
import telephone from '@/assets/tirelire/images/pictos_faux/telephone.png';

const componentManager = ref({
    jeu: false,
    postit: true,
    regles: true,
    bravo: true,
    classement: true
})

</script>

<template>
    <Jeu v-show="componentManager.jeu"></Jeu>
    <PageRegles v-show="componentManager.regles" @back="componentManager.regles = false" @pageClicked="componentManager.regles = false;">
        <div class="contenu-regles">
            <p>Mets dans la tirelire tout ce qu’une complémentaire santé prend en charge !</p>
            <div>
                <p>Voici les pièces que tu dois récolter :</p>
                <div class="list-images">
                    <img :src="hopital" alt="hopital">
                    <img :src="auditive" alt="auditive">
                    <img :src="dentiste" alt="dentiste">
                    <img :src="medecin" alt="medecin">
                    <img :src="optique" alt="optique">
                    <img :src="transport" alt="transport">
                </div>
            </div>
            <div>
                <p>Mais ne récolte surtout pas celles-ci !</p>
                <div class="list-images">
                    <img :src="ampoule" alt="ampoule">
                    <img :src="courrier" alt="courrier">
                    <img :src="etude" alt="etude">
                    <img :src="livre" alt="livre">
                    <img :src="maison" alt="maison">
                    <img :src="puzzle" alt="puzzle">
                    <img :src="telephone" alt="telephone">
                </div>
            </div>
        </div>
    </PageRegles>
</template>

<style scoped>
.contenu-regles {
    display: flex;
    flex-direction: column;
    gap: 3vh;
}

.contenu-regles>p {
    font-size: larger;
}

.list-images {
    display: flex;
    justify-content: space-around;
}

.list-images img {
    width: 12vw;
    height: 12vw;
}
</style>