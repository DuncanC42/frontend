<script setup>

</script>

<template>
    <div class="page">
        <div class="title">
            <font-awesome-icon class="icon" :icon="['fas', 'gear']" />
            <h1>Sons et musiques</h1>
        </div>
        <div class="slider">
            <font-awesome-icon class="icon" :icon="['fas', 'music']" />
            <input type="range" class="level">
        </div>
        <div class="slider">
            <font-awesome-icon  class="icon" :icon="['fas', 'volume-high']" />
            <input type="range" class="level">
        </div>
    </div>
</template>

<style scoped>
.page {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10vh;
    margin-top: 20vh;
}

.title {
    display: flex;
    align-items: center;
    gap: 20px;

}

.title>h1 {
    font-size: 36px;
}

.icon {
    font-size: larger;
    width: 30px;
    height: 30px;
}


.slider {
    --slider-height: 6px;
    --slider-bg: rgb(82, 82, 82);
    --slider-border-radius: 999px;
    --level-color: #bebebe;
    --level-transition-duration: .1s;
    --icon-margin: 15px;
    --icon-color: var(--slider-bg);
    --icon-size: 25px;
    gap: 10px;
    cursor: pointer;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-orient: horizontal;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.slider .level {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    height: var(--slider-height);
    background: var(--slider-bg);
    overflow: hidden;
    border-radius: var(--slider-border-radius);
    -webkit-transition: height var(--level-transition-duration);
    -o-transition: height var(--level-transition-duration);
    transition: height var(--level-transition-duration);
    cursor: inherit;
}

.slider .level::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 0;
    height: 0;
    -webkit-box-shadow: -200px 0 0 200px var(--level-color);
    box-shadow: -200px 0 0 200px var(--level-color);
}
</style>