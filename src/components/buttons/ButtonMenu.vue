<template>
    <button>
        <font-awesome-icon :class="classArray" class="icon, button" :icon="['fas', icon ]" /> <!-- icon="play, pause, rotate-right, door-open exit" -->
    </button>  
</template>

<script setup>
    const props = defineProps({
        icon : {
            type: String,
            required: true,
        },
        classArray: Array
    });
</script>

<style scoped>
    button {
        border-radius: 50px;
        border: none;
        transition: all ease 0.2s;
    }

    .icon {
        color: black;
        font-size: 30px;
    }

    .normalSize {
        font-size: 20px;
        width: 60px;
        height: 60px;
    }

    .littleSize {
        font-size: 10px;
        width: 40px;
        height: 40px;
    }
    
</style>