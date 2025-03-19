<template>
    <button :class="classArray">{{label}}</button> 
</template>

<script setup>
    const props = defineProps({
        label: {
            type: String, 
            default:'Connexion'
        },
        classArray: Array 
    });

    //exemple d'utilisation : <ButtonIdenticator label="Primary" classArray="primary"></ButtonIdenticator>
</script>

<style scoped>



button {
    padding: 10px 20px;
    font-size: 20px;
    width: 240px;
    height: 60px;
    border-radius: 50px;
    border: none;
    transition: all ease 0.2s;
}

button:active {
    transform: scale(0.9);
    transition: all ease 0.2s;
}

.primary {
    background-color: var(--primary-color);
    color: var(--secondary-color);
}

.secondary {
    background-color: var(--secondary-color);
    border: solid 1px var(--primary-color);
    color: var(--primary-color);
}

</style>