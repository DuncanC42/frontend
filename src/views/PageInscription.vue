<script setup>
    import FondDecran from '../components/FondDecran.vue';
    import ButtonIdenticator from '../components/buttons/ButtonIdenticator.vue';
    import ButtonBack from '@/components/buttons/ButtonBack.vue';
    import { useRouter } from 'vue-router';
    import {fetchBackend} from '@/composable/fetchBackend.js';
    import {ref} from 'vue';
    const router = useRouter();

    const handleBienvenue = () => {
        router.push('/bienvenue');
    }

    const pseudo = ref('');
    const email = ref('');
    const acceptConditions = ref(false);


    const handleInscription = () => {

        if (!acceptConditions.value) {
            errorMessage.value = "Veuillez accepter les conditions d'utilisation";
            return;
        }

        if (!pseudo.value || !email.value) {
            errorMessage.value = "Veuillez remplir tous les champs";
            return;
        }


        fetchBackend('api/register', 'POST', {email : email.value, pseudo : pseudo.value}).then((response) => {
            if (response.status === 201){
                router.push('/bienvenue');
            }else {
                errorMessage.value = "Une erreur s'est produite lors de l'inscription";
            }
        }).catch(error => {
            errorMessage.value = "Erreur de connexion au serveur";
            console.error(error);
        });
    }

</script>

<template>
    <FondDecran />
    <ButtonBack @click="handleBienvenue"/>
    <div class="container">

        <div class="inscrivez-vous">
            <p>Inscrivez-vous</p>
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

            <div class="conditions">
                <input id="conditions" type="checkbox" name="conditions" value="conditions" v-model="acceptConditions">
                <label for="conditions">J'accepte les <a href="#">conditions d'utilisation</a></label>
            </div>
            
            <div class="button-container">
                <ButtonIdenticator id="btn-primary" label="S'inscrire" classArray="primary" @click="handleInscription"></ButtonIdenticator>
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
    .inscrivez-vous {
        position: relative;
        top: 100px;
        text-align: center;
        font-size: 2.3em;
        color: white;
        font-weight: 500;
        margin-bottom: 20px; /* Ajoute de l'espace sous "Connectez-vous" */
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
    
    /* Style pour la section des conditions */
    .conditions {
        position: relative;
        top: 30px;
        left: 20px;
        color: white;
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        max-width: 300px;
    }

    /* Style pour la case à cocher */
    .conditions input[type="checkbox"] {
        width: auto;
        height: 18px;
        width: 18px;
        margin: 0;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        border: 2px solid white;
        border-radius: 4px;
        background-color: transparent;
        padding: 0;
    }

    /* Style pour la case à cocher lorsqu'elle est cochée */
    .conditions input[type="checkbox"]:checked {
        background-color: #4CAF50;
        border-color: #4CAF50;
        position: relative;
    }

    /* Ajouter une coche lorsque la case est cochée */
    .conditions input[type="checkbox"]:checked::after {
        content: '✓';
        position: absolute;
        color: white;
        font-size: 14px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    /* Style pour le label des conditions */
    .conditions label {
        font-size: 0.9em;
        cursor: pointer;
    }

    /* Style pour le lien dans les conditions */
    .conditions a {
        color: #4CAF50; /* Changer la couleur du lien */
        text-decoration: none; /* Enlever le soulignement */
    }

    /* Style pour le lien au survol */
    .conditions a:hover {
        text-decoration: underline; /* Ajouter un soulignement au survol */
    }

    /* Conteneur pour les champs de saisie */
    .input-container {
        position: relative;
        width: 100%;
        max-width: 300px; /* Limite la largeur des champs */
        margin-bottom: 15px;
    }

    .button-container {
        position: relative;
        width: 100%;
        max-width: 300px; /* Limite la largeur des champs */
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
        pointer-events: none; /* Empêche l'icône d'interférer avec les clics */
    }

    /* Champs de saisie */
    input {
        width: 100%;
        padding: 12px 20px 12px 40px; /* Ajoute un espace pour l'icône */
        font-size: 1.3em;
        margin: 8px 0;
        border: 2px solid #ccc;
        border-radius: 10px;
        box-sizing: border-box;
        background-color: transparent; /* Enlève la couleur de fond */
        color: white; /* Texte blanc */
    }

    /* Placeholder */
    input::placeholder {
        color: #ccc; /* Couleur du placeholder */
        font-size: 0.9em;
    }

</style>