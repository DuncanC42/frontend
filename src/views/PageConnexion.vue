<script setup>
import FondDecran from '../components/FondDecran.vue';
import ButtonIdenticator from '../components/buttons/ButtonIdenticator.vue';
import ButtonBack from '@/components/buttons/ButtonBack.vue';
import { useRouter } from 'vue-router';
import { fetchBackend } from '@/composable/fetchBackend.js';
import { ref } from 'vue';
const router = useRouter();

const handleBienvenue = () => {
    router.push('/bienvenue');
}

const pseudo = ref('');
const email = ref('');

const handleConnexion = () => {
    fetchBackend('api/login', 'POST', { email: email.value, pseudo: pseudo.value }).then((response) => {
        if (response.status === 200) {
            router.push({ name: 'home', query: { loader: true } });
        } else {
            console.log('Erreur');
        }
    });
}

</script>

<template>
    <FondDecran />
    <ButtonBack @click="handleBienvenue" />
    <div class="container">

        <div class="connectez-vous">
            <p>Connectez-vous</p>
        </div>

        <div class="form">

            <div class="input-container">
                <img src="../assets/images/pseudo.png" alt="Pseudo Icon" class="input-icon">
                <input v-model="pseudo" type="text" id="pseudo" name="pseudoname" placeholder="Pseudo">
            </div>
            <div class="input-container">
                <img src="../assets/images/email.png" alt="Email Icon" class="input-icon">
                <input v-model="email" type="email" id="email" name="email" placeholder="Email">
            </div>

            <div class="button-container">
                <ButtonIdenticator id="btn-primary" label="Se connecter" classArray="primary" @click="handleConnexion">
                </ButtonIdenticator>
            </div>
        </div>
    </div>
</template>

<style>
/* Conteneur principal */
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

/* Section "Connectez-vous" */
.connectez-vous {
    position: relative;
    top: 100px;
    text-align: center;
    font-size: 2.3em;
    color: white;
    font-weight: 500;
    margin-bottom: 20px;
    /* Ajoute de l'espace sous "Connectez-vous" */
    z-index: 1;
}

/* Formulaire */
.form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    top: 120px;
}

/* Conteneur pour les champs de saisie */
.input-container {
    position: relative;
    width: 100%;
    max-width: 300px;
    /* Limite la largeur des champs */
    margin-bottom: 15px;
}

.button-container {
    position: relative;
    width: 100%;
    max-width: 300px;
    /* Limite la largeur des champs */
    top: 50px;
}

/* Icône à l'intérieur du champ */
.input-icon {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    pointer-events: none;
    /* Empêche l'icône d'interférer avec les clics */
}

/* Champs de saisie */
input {
    width: 100%;
    padding: 12px 20px 12px 40px;
    /* Ajoute un espace pour l'icône */
    font-size: 1.3em;
    margin: 8px 0;
    border: 2px solid #ccc;
    border-radius: 10px;
    box-sizing: border-box;
    background-color: transparent;
    /* Enlève la couleur de fond */
    color: white;
    /* Texte blanc */
}

/* Placeholder */
input::placeholder {
    color: #ccc;
    /* Couleur du placeholder */
    font-size: 0.9em;
}
</style>