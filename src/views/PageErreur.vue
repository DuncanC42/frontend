<script setup>
import FondEcran from '../components/FondEcran.vue'
import Fond from '../assets/images/Appartement.png'
</script>

<template>

    <div class="text">
        <p class="error">Erreur !</p>
        <p>La résolution votre écran est <br>
            trop élévée pour pouvoir jouer à <br>
            nos jeux.</p>
        <img src="../assets/images/qrcode.png" id="qr" alt="QR Code" width="300" height="300">
        <p>Veuillez scanner notre QR code <br>
            pour jouer sur un appareil adapté.</p>
    </div>
    <FondEcran :image="Fond" style="
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);">
    </FondEcran>
</template>

<style scoped>
.text {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-evenly;
    height: 100%;
}

.error {
    font-size: 5em;
    margin-bottom: 0.5em;
}

p {
    text-align: center;
    font-size: 2em;
    margin: 0;
    font-family: SourceSansPro-Regular, sans-serif;
}
</style>