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
    background-color: rgba(0,0,0, 0.4);
    backdrop-filter: blur(3px);
    z-index: 2;
    transition: all ease 1s;
}

.filterInactiv {
    background-color: rgba(0,0,0, 0);
    backdrop-filter: blur(0px);
}

</style>