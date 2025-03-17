<script setup>
import VolumeMenu from './views/VolumeMenu.vue'

import {useMusique} from './composable/volumes'
useMusique();

</script>

<template>
	<VolumeMenu></VolumeMenu>
</template>
