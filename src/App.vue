<script setup>
    import ButtonIdenticator from './components/buttons/ButtonIdenticator.vue';
    import ButtonMenu from './components/buttons/ButtonMenu.vue';

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
    
</template>
