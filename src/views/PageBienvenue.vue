<script setup>
    import Header from '../components/Header.vue';
    import FondDecran from '../components/FondDecran.vue';
    import ButtonIdenticator from '../components/buttons/ButtonIdenticator.vue';
</script>

<template>
    <FondDecran />

    <div class="container">
        <div class="bienvenue">
            <p>Bienvenue sur <br> le serious game <br> d'Ameli</p>
        </div>
        <div class="text">
            <p>Des jeux pour prendre en main <br> ta santé sans prise de tête</p>
        </div>
        <ButtonIdenticator id="btn-primary" label="Connectez-vous" classArray="primary"></ButtonIdenticator>
        <div class="devider">
            <div class="ligne"></div>
            <span class="ou">ou</span>
            <div class="ligne"></div>
        </div>
        <ButtonIdenticator id="btn-secondary" label="Créer votre compte" classArray="secondary"></ButtonIdenticator>
    </div>
</template>

<style scoped>

/* Conteneur principal */
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
}

/* Section "Bienvenue" */
.bienvenue {
    text-align: center;
    font-size: 2.3em;
    color: white;
    font-weight: 500;
    margin-bottom: 20px; /* Ajoute de l'espace sous "Bienvenue" */
    z-index: 1;
}

/* Texte principal */
.text {
    text-align: center;
    font-size: 1em;
    color: white;
    z-index: 1;
}

#btn-primary {
    margin-top: 40px;
    z-index: 1;
}

#btn-secondary {
    margin-top: 0px;
    z-index: 1;
}

/* Conteneur des lignes + "ou" */
.devider {
    position: relative;
    top: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 10px; /* Espacement entre les éléments */
    z-index: 1;
    padding: 50px 0px 50px 0px;
}

/* Lignes horizontales */
.ligne {
    width: 30%;
    height: 2px;
    background-color: white;
}

/* Texte "ou" centré */
.ou {
    color: white;
    font-size: 1.5em;
    font-weight: bold;
    white-space: nowrap;
}

</style>
