<template>
    <div class="tw:h-[inherit] ">
        <div class=" tw:flex tw:flex-col tw:w-full  tw:dark:bg-black tw:h-[inherit] ">
            <div class="tw:flex tw:items-center tw:p-[10px] tw:gap-x-[10px]">
                <v-btn variant="outlined" flat @click="goToToday" rounded style="outlined">Today</v-btn>
                <v-btn @click="prev" elevation="0" color="transparent" size="30px" icon>
                    <v-icon size="22px" class="tw:dark:text-white tw:text-black " icon="fas fa-chevron-left" />
                </v-btn>
                <v-btn @click="next" elevation="0" color="transparent" size="30px" icon>
                    <v-icon size="22px" class="tw:dark:text-white tw:text-black" icon="fas fa-chevron-right" />
                </v-btn>
                <p class="tw:w-[120px]">{{ currentSelection }}</p>
                <v-select hide-details rounded density="compact" max-width="120px" :model-value="currentView"
                    @update:model-value="toggle" variant="outlined" flat :items="viewOptions"></v-select>
                <GenCalendarSettings v-model:primary-timezone="primaryTimezone"
                    v-model:secondary-timezone="secondaryTimezone" :time-zones="allTimeZones" :save-form="saveForm"
                    v-model="modalValue">
                    <template v-slot:activator="{ props: activatorProps }">
                        <v-btn v-bind="activatorProps" @click="settings" elevation="0" color="transparent" size="30px"
                            icon>
                            <v-icon size="22px" class="tw:dark:text-white tw:text-black" icon="fas fa-gear" />
                        </v-btn>
                    </template>
                </GenCalendarSettings>

            </div>
            <tui-calendar class="my-calendar" ref="calendarRef" :view="currentView" @beforeCreateEvent="createEvent"
                @beforeDeleteEvent="deleteEvent" @beforeUpdateEvent="updateEvent" :use-form-popup="true"
                :use-detail-popup="true" :template="template" :week="options.week" :timezone="options.timezone"
                :calendars="calendars" :events="myEvents" />
        </div>
    </div>
</template>

<script setup lang="ts">
import TuiCalendar from './calendar.vue'
import { ComponentTemplateRef, CalendarInfo, EventObject, getTemplate, generateTheme, TZDate } from './index';
import { computed, onMounted, ref, watch } from 'vue';
import GenCalendarSettings from './GenCalendarSettings.vue'
import { getFormattedTimeZones } from './utils/index'
import mitt from 'mitt';
import './styles/main.css'
const calendarRef = ref<ComponentTemplateRef | undefined>();
const template = ref(getTemplate())
const emitter = mitt();
const modalValue = ref(false)
const primaryTimezone = ref()
const secondaryTimezone = ref()
const saveForm = () => {
    modalValue.value = false
}
const allTimeZones = getFormattedTimeZones()
const zones = ref<any[]>([]);

onMounted(() => {
    syncDateState()
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    primaryTimezone.value = timeZone
})
watch([primaryTimezone, secondaryTimezone], ([primary, secondary]) => {
    const primaryTimezone = allTimeZones.find((tz) => tz.timezoneName === primary)
    const secondaryTimezone = allTimeZones.find((tz) => tz.timezoneName === secondary)
    const tempZones:any=[]
    if(primaryTimezone){
        tempZones.push(primaryTimezone)
    }
    if(secondaryTimezone){
        tempZones.push(secondaryTimezone)
    }
    zones.value = tempZones
})
const myEvents = ref<any[]>([]);
const options = computed(() => ({
    timezone: {
        zones: zones.value,
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

const theme = computed(() => generateTheme())

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
const settings = () => {

}
const next = () => {
    emitter.emit('date-move', 1)
    calendarRef.value?.getInstance().next();

};
const prev = () => {
    emitter.emit('date-move', -1)
    calendarRef.value?.getInstance().prev();
};
const goToToday = () => {
    calendarRef.value?.getInstance().today()
    syncDateState()
}
function syncDateState() {
    const currentDate = calendarRef.value?.getInstance().getDate()
    selectedDateState.value = currentDate
    calendarRef.value?.getInstance().setDate(currentDate?.toDate()!)
}

const selectedDateState = ref<TZDate>()
emitter.on('date-move', (value: any) => {
    if (currentView.value === 'day') {
        selectedDateState.value = new TZDate(selectedDateState.value?.addDate(value))
    }
    if (currentView.value === 'month') {
        selectedDateState.value = new TZDate(selectedDateState.value?.addMonth(value))
    }
    if (currentView.value === 'week') {
        selectedDateState.value = new TZDate(selectedDateState.value?.addDate(value * 7))
    }
})
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const currentSelection = computed(() => {
    if (currentView.value === 'day') {
        return `${months[selectedDateState.value?.getMonth()!]} ${selectedDateState.value?.getDate()}, ${selectedDateState.value?.getFullYear()}`
    }
    if (currentView.value === 'week') {
        return `${months[selectedDateState.value?.getMonth()!]} ${selectedDateState.value?.getFullYear()}`
    }
    if (currentView.value === 'month') {
        return `${months[selectedDateState.value?.getMonth()!]} ${selectedDateState.value?.getFullYear()}`
    }
});
const viewOptions = ['day', 'week', 'month'] as const;
type ViewOption = (typeof viewOptions)[number];
const currentView = ref<ViewOption>('week');

const toggle = (newOption) => {
    currentView.value = newOption
};

function toDefaultTimeZone(event: EventObject, timeZone: string) {
    return {
        ...event,
        start: event.start.local(timeZone),
        end: event.end.local(timeZone),
    };
}

function updateEvent({ event, changes }: { event: EventObject; changes: any }) {
    const updateIndex = myEvents.value.findIndex((innerEvent: any) => innerEvent.title === event.title);
    const updatedEvent = {
        ...event,
        ...changes,
    };
    myEvents.value[updateIndex] = toDefaultTimeZone(updatedEvent, primaryTimezone.value);
}

function createEvent(event: EventObject) {
    myEvents.value.push(toDefaultTimeZone(event, primaryTimezone.value));
}
function deleteEvent(event: EventObject) {
    const deleteIndex = myEvents.value.findIndex((innerEvent: any) => innerEvent.title === event.title);
    myEvents.value.splice(deleteIndex, 1);
}

</script>

<style></style>

<style></style>
