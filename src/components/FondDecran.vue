<template>
    <div class="fond-decran">
        <div class="opaque">
        </div>   
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
</style>