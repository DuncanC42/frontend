<script setup>
import VolumeButton from './components/volumes/VolumeButton.vue'

import {useMusique} from './composable/volumes'
useMusique();

</script>

<template>
	<VolumeButton></VolumeButton>
</template>
