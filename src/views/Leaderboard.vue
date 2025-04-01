<script setup>
import NavBar from '@/components/NavBar.vue';
import podium from '@/assets/images/podium.png';
import FondEcran from '@/components/FondEcran.vue';
import appartement from '@/assets/images/Appartement.png';
import BlurFilter from '@/components/BlurFilter.vue';
import ButtonNextPrevious from '@/components/buttons/ButtonNextPrevious.vue';
import TableauLeaderboard from '@/components/TableauLeaderboard.vue';
import { ref, onMounted } from 'vue';

const page = ref(2);
const scrollContainer = ref(null);

const title_ref = {
    1: { title: 'Général', route: '' },
    2: { title: 'Carte vitale', route: 'taquin' },
    3: { title: 'C2S', route: 'tirelire' },
    4: { title: 'RIB', route: 'dino' },
    5: { title: 'Examen de prévention', route: 'fruitninja' },
    6: { title: 'M\'T dents', route: 'dents' }
}

// Function to handle scrolling to a specific page
const scrollToPage = (targetPage) => {
    if (targetPage < 1) targetPage = 1;
    if (targetPage > Object.keys(title_ref).length) targetPage = Object.keys(title_ref).length;
    
    page.value = targetPage;
    
    // Get the element to scroll to
    const targetElement = document.getElementById(`leaderboard-${targetPage}`);
    if (targetElement && scrollContainer.value) {
        scrollContainer.value.scrollTo({
            left: targetElement.offsetLeft,
            behavior: 'smooth'
        });
    }
}

// Handle next/previous button clicks
const handleNavigation = (direction) => {
    if (direction === 'next' && page.value < Object.keys(title_ref).length) {
        scrollToPage(page.value + 1);
    } else if (direction === 'previous' && page.value > 1) {
        scrollToPage(page.value - 1);
    }
}

// Handle dot click for direct navigation
const handleDotClick = (dotIndex) => {
    scrollToPage(dotIndex);
}

onMounted(() => {
    if (scrollContainer.value) {
        // Scroll to initial page on mount
        scrollToPage(page.value);
        
        // Add scroll event listener
        scrollContainer.value.addEventListener('scroll', () => {
            if (!scrollContainer.value) return;
            
            const scrollPosition = scrollContainer.value.scrollLeft;
            const containerWidth = scrollContainer.value.offsetWidth;
            
            // Calculate which page is most visible
            const newPage = Math.round(scrollPosition / containerWidth) + 1;
            if (newPage !== page.value) {
                page.value = newPage;
            }
        });
    }
});
</script>

<template>
    <div class="main">
        <div class="content">
            <div class="title">
                <img :src="podium" :alt="podium">
                <h2>{{ title_ref[page].title }}</h2>
            </div>
            <div class="leaderboard-container" ref="scrollContainer">
                <div v-for="(info, index) in title_ref" :key="index" class="leaderboard-item" :id="`leaderboard-${index}`">
                    <TableauLeaderboard :route="info.route"></TableauLeaderboard>
                </div>
            </div>
            <div class="pagination">
                <ButtonNextPrevious 
                    :class="page === 1 ? 'hidden' : ''" 
                    :classArray="['previous']" 
                    @click="handleNavigation('previous')" 
                />
                <div 
                    class="dot" 
                    v-for="i in 6" 
                    :key="i" 
                    :class="i === page ? 'lighter-dot' : ''" 
                    @click="handleDotClick(i)"
                ></div>
                <ButtonNextPrevious 
                    :class="page === 6 ? 'hidden' : ''" 
                    :classArray="['next']" 
                    @click="handleNavigation('next')" 
                />
            </div>
        </div>
        <FondEcran style="z-index : 10; " :image="appartement"></FondEcran>
        <BlurFilter :is-open="true"></BlurFilter>
        <NavBar></NavBar>
    </div>
</template>


<style scoped>
.main {
    background-color: #9a615a;
    /* Remove negative z-index as it can cause interaction issues */
    height: 100%;
    position: relative;
}

.content {
    z-index: 101;
    color: white;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    height: 90%;
    position: relative;
}

.title {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.leaderboard-container {
    width: 100%;
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none; /* Hide scrollbar for Firefox */
    -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
}

.leaderboard-container::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
}

.leaderboard-item {
    min-width: 100%;
    scroll-snap-align: center;
    display: flex;
    justify-content: center;
}

.pagination {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 90vw;
}

.dot {
    height: 20px;
    width: 20px;
    background-color: #ffffff78;
    border-radius: 30px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.dot:hover {
    background-color: #ffffffaa;
}

.lighter-dot {
    background-color: #ffffff;
}

.hidden {
    visibility: hidden;
}
</style>