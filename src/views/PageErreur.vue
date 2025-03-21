<script setup>
    import Header from '../components/Header.vue';
    import FondDecran from '@/components/FondDecran.vue';
    import FondEcran from '@/components/FondEcran.vue';
</script>

<template>
    <div class="text">
        <p class="error">Erreur !</p>
        <p>La résolution votre écran est
            trop élévée pour pouvoir jouer à <br>
            nos jeux.</p>
        <img src="../assets/images/qrcode.png" id="qr" alt="QR Code" width="300" height="300">
        <p class="qr-code-message">Veuillez scanner notre QR code <br>
            pour jouer sur un appareil adapté.</p>
    </div>
    <FondEcran :image="Fond" style="
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);">
    </FondEcran>
    <FondDecran />
</template>

<style scoped>
.text {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-evenly;
    height: 100%;
    color: white;
    overflow: hidden;
}

.error {
    font-size: 5em;
    color:white;
    margin-top: 1em
}

p {
    text-align: center;
    font-size: 2em;
    margin: 0;
    font-family: SourceSansPro-Regular, sans-serif;
}

.qr-code-message{
    margin-bottom: 2.5em;
}
</style>