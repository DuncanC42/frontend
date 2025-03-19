<template>
    <button :style="buttonStyle">
        <font-awesome-icon :class="classArray" class="icon, button" :icon="['fas', icon ]" /> <!-- icon="play, pause, rotate-right, door-open exit" -->
    </button>  
</template>

<script setup>
    import { computed } from 'vue';
    const props = defineProps({
        icon : {
            type: String,
            required: true,
        },
        classArray: Array
    });

    const buttonStyle = computed(() => {
    if (props.classArray?.includes("littleSize")) {
        return {
            width: "40px",
            height: "40px"
        };
    }
    return {
        width: "60px",
        height: "60px"
    };
});
</script>

<style scoped>
    button {
        border-radius: 50px;
        border: none;
        transition: all ease 0.2s;
    }

    button:active {
        transform: scale(0.9);
        transition: all ease 0.2s;
    }

    .icon {
        color: black;
        font-size: 30px;
    }

    .normalSize {
        font-size: 30px;
    }

    .littleSize {
        font-size: 20px;
    }
    
</style>