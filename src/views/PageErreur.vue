<script setup>
    import Header from '../components/Header.vue';
    import FondDecran from '@/components/FondDecran.vue';
</script>

<template>
    <Header/>
    <FondDecran/>
    <div class="text">
        <p class="error">Erreur !</p>
        <p>La résolution votre écran est <br>
        trop élévée pour pouvoir jouer à <br>
        nos jeux.</p>
        <img src="../assets/images/qrcode.png" alt="QR Code" width="300" height="300">
        <p>Veuillez scanner notre QR code <br>
        pour jouer sur un appareil adapté.</p>
    </div>
</template>

<style>

.text {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    text-align: center;
    z-index: 1;
    font-family: SourceSansPro-Light, sans-serif;
}

.error {
    font-size: 5em;
    margin-bottom: 0.5em;
}

p {
    font-size: 2em;
    margin: 0;
    font-family: SourceSansPro-Regular, sans-serif;
}

</style>