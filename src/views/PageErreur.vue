<script setup>
    import Header from '../components/Header.vue';
</script>

<template>
    <Header/>
    <div class="fond-decran">
        <div class="opaque">
        </div>   
    </div>
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

.fond-decran {
    position: fixed;
    background-image: url('../assets/images/Appartement.png');
    background-color: rgba(0, 0, 0, 0.7);
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    filter: blur(3px);
}

.opaque {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
}

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