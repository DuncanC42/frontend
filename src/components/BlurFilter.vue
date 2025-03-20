<template>
    <div :class="isOpen ? '' : 'filterInactiv'" class="filter"></div>
</template>

<script setup>
const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
});
</script>


<style scoped>

.filter {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    background-color: rgba(49,46,46, 0.7);
    backdrop-filter: blur(7px);
    z-index: 99;
    transition: all ease 1s;
}

.filterInactiv {
    background-color: rgba(0,0,0, 0);
    backdrop-filter: blur(0px);
}

</style>