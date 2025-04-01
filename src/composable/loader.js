import { ref } from 'vue';

const isLoading = ref(false);

export function useLoader() {
    const showLoader = () => {
        isLoading.value = true;
    };

    const hideLoader = () => {
        isLoading.value = false;
    };

    return {
        isLoading,
        showLoader,
        hideLoader,
    };
}
