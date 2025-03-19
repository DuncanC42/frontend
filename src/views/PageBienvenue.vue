<script setup>
    import Header from '../components/Header.vue';
    import FondDecran from '../components/FondDecran.vue';
</script>

<template>
    <Header />
    <FondDecran />

    <div class="container">
        <div class="bienvenue">
            <p>Bienvenue sur <br> le serious game <br> d'Ameli</p>
        </div>
        <div class="text">
            <p>Des jeux pour prendre en main ta santé sans prise de tête</p>
        </div>
        <button class="btn">Se connecter</button>
        <div class="devider">
            <div class="ligne"></div>
            <span class="ou">ou</span>
            <div class="ligne"></div>
        </div>
        <button class="btn">S'inscrire</button>
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
    margin-top: 50px; /* Ajuste la distance sous le header */
}

/* Section "Bienvenue" */
.bienvenue {
    text-align: center;
    font-size: 1.5em;
    color: white;
    font-weight: 500;
    margin-bottom: 20px; /* Ajoute de l'espace sous "Bienvenue" */
    z-index: 1;
}

/* Texte principal */
.text {
    text-align: center;
    font-size: 0.8em;
    margin-bottom: 20px; /* Espace avant les lignes */
}

.btn {
    position: relative;
    top: 270px;
    z-index: 1;
    margin: 10px 0; /* Ajoute un espace au-dessus et en dessous des boutons */
    padding: 10px 20px;
    background-color: white;
    color: black;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

/* Conteneur des lignes + "ou" */
.devider {
    position: relative;
    top: 270px;
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
