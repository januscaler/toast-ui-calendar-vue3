<template>
	<div class="play-container">
		<button @click="toggle">toggle</button>
		<button @click="next">next</button>
		<button @click="prev">prev</button>
		<gen-calendar
			class="my-calendar"
			ref="calendarRef"
			:view="currentView"
			@beforeCreateEvent="createEvent"
      @beforeDeleteEvent="deleteEvent"
			@beforeUpdateEvent="updateEvent"
			:use-form-popup="true"
			:use-detail-popup="true"
			:week="options.week"
			:timezone="options.timezone"
			:calendars="calendars"
			:events="myEvents"
		/>
	</div>
</template>

<script setup lang="ts">
/** for local dev */
import { ComponentTemplateRef, CalendarInfo, EventObject } from '../../src';
import '../../dist/genCalendar.css';
/** for npm pkg test */
// import GenCalendar  from '@genesistechcorp/calendar';
// import  '@genesistechcorp/calendar/style.css';

import { events } from './mock-data.js';
import { computed, ref, onMounted } from 'vue';

const calendarRef = ref<ComponentTemplateRef | undefined>();
const myEvents = ref<EventObject[]>([]);
const zones = [
	{
		timezoneName: 'Asia/Kolkata',
		displayLabel: 'Delhi',
		tooltip: 'India Standard Time (UTC+05:30)',
	},
	{
		timezoneName: 'Asia/Seoul',
		displayLabel: 'Seoul',
		tooltip: 'Seoul Time',
	},
];
const defaultTimezoneName = computed(() => zones[0].timezoneName);
const calendars = computed<CalendarInfo[]>(() => [
	{
		id: 'home',
		color: 'red',
		name: 'Home',
		backgroundColor: '#69ff7061',
		borderColor: '#69ff7061',
		dragBackgroundColor: '#69ff7061',
	},
	{
		id: 'work',
		name: 'Work',
		color: 'yellow',
		backgroundColor: '#2d9fff61',
		borderColor: '#2d9fff61',
		dragBackgroundColor: '#2d9fff61',
	},
]);

onMounted(() => {
	myEvents.value = events;
});

const next = () => {
	calendarRef.value?.getInstance().next();
};
const prev = () => {
	calendarRef.value?.getInstance().prev();
};
const viewOptions = ['day', 'week', 'month'] as const;
type ViewOption = (typeof viewOptions)[number];
const currentView = ref<ViewOption>('month');

const toggle = () => {
	const currentIndex = viewOptions.findIndex((v) => v === currentView.value);
	const nextIndex = (currentIndex + 1) % viewOptions.length; // Corrected circular logic
	currentView.value = viewOptions[nextIndex];
};

function toDefaultTimeZone(event: EventObject) {
	return {
		...event,
		start: event.start.local(defaultTimezoneName.value),
		end: event.end.local(defaultTimezoneName.value),
	};
}

function updateEvent({ event, changes }: { event: EventObject; changes: any }) {
	const updateIndex = myEvents.value.findIndex((innerEvent: any) => innerEvent.title === event.title);
	const updatedEvent = {
		...event,
		...changes,
	};
	myEvents.value[updateIndex] = toDefaultTimeZone(updatedEvent);
}

function createEvent(event: EventObject) {
	myEvents.value.push(toDefaultTimeZone(event));
}
function deleteEvent(event: EventObject) {
  const deleteIndex = myEvents.value.findIndex((innerEvent: any) => innerEvent.title === event.title);
  myEvents.value.splice(deleteIndex, 1);
}

/**
 * Calendar 配置项
 * @see https://github.com/nhn/tui.calendar/blob/main/docs/en/apis/options.md
 */
const options = computed(() => ({
	timezone: {
		zones,
	},
	week: {
		showNowIndicator: true,
		showTimezoneCollapseButton: false,
		timezonesCollapsed: false,
		hourStart: 0,
		hourEnd: 24,
		eventView: ['time'],
		taskView: false,
		collapseDuplicateEvents: true,
	},
}));
</script>

<style scoped>
.play-container {
	display: flex;
	flex-direction: column;
	padding: 8px;
}
</style>

<style>
.my-calendar {
	border: solid 1px #eee;
	border-radius: 4px;

	.toastui-calendar-day-names {
		border: none !important;
	}
}
</style>
