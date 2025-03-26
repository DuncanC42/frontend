<template>
    <button>
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
    </button>
</template>

<style scoped>
button {
    position: absolute;
    top: 12vh;
    z-index: 10;
    color: white;
    border-radius: 100%;
    width: 60px;
    height: 60px;
    background-color: rgba(0, 0, 0, 0.3);
    border: none;
    backdrop-filter: blur(2px);
    transition: all ease-in-out 0.3s;
    left: 2vh;
    font-size: x-large;
}

button:active {
    transform: scale(0.5);
}
</style>