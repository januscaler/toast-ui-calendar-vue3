<template>
	<div class="tw:h-screen tw:p-[30px]">
		<v-btn @click="toggleDarkMode">
			{{ darkMode ? 'Light Mode' : 'Dark Mode' }}
		</v-btn>
		<gen-calendar v-model:events="events" :darkMode="darkMode" style="height: 100%" class="my-calendar" ref="calendarRef" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const darkMode = ref(false);
function toggleDarkMode() {
	darkMode.value = !darkMode.value;
}
const events = ref([]);
</script>

<style scoped></style>
