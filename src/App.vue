<script setup>
    import ButtonIdenticator from './components/buttons/ButtonIdenticator.vue';
    import ButtonMenu from './components/buttons/ButtonMenu.vue';
    import ButtonNextPrevious from './components/buttons/ButtonNextPrevious.vue';
    import ButtonEndGame from './components/buttons/ButtonEndGame.vue';

</script>

<template>
    <div>
        <ButtonIdenticator label="Primary" classArray="primary"></ButtonIdenticator>
        <ButtonIdenticator label="Secondary" classArray="secondary"></ButtonIdenticator>
    </div>
	
    <div style="display: flex; justify-content: space-around;">
        <ButtonMenu classArray="normalSize" icon="door-open"></ButtonMenu>
        <ButtonMenu classArray="normalSize" icon="rotate-right"></ButtonMenu>
        <ButtonMenu classArray="normalSize" icon="play"></ButtonMenu>
        <ButtonMenu classArray="littleSize" icon="pause"></ButtonMenu>
    </div>
    <div style="background-color: black; display: flex; justify-content: space-around;">
        <ButtonNextPrevious classArray="previous" />
        <ButtonNextPrevious classArray="next" />
    </div>
    <div>
        <ButtonEndGame classArray="share" />
        <ButtonEndGame classArray="continue" />
        <ButtonEndGame classArray="retry" />
    </div>
    
</template>
