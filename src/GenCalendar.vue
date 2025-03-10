<template>
    <div :style="{ '--timezone-text-color': (darkMode ? darkTextColor : lightTextColor) }" class="tw:h-[inherit] "
        :class="{ 'dark': props.darkMode, }">
        <div :style="{ backgroundColor: props.darkMode ? props.darkBgColor : props.lightBgColor }"
            class="tw:flex tw:flex-col tw:w-full tw:h-[inherit] ">
            <div class="tw:flex tw:items-center tw:p-[10px] tw:gap-x-[10px]">
                <v-btn :style="{ color: darkMode ? darkTextColor : lightTextColor }" variant="outlined" flat
                    @click="goToToday" rounded style="outlined">{{ $t('today') }}</v-btn>
                <v-btn @click="prev" elevation="0" color="transparent" size="30px" icon>
                    <v-icon :style="{ color: darkMode ? darkTextColor : lightTextColor }" size="22px"
                        icon="fas fa-chevron-left" />
                </v-btn>
                <v-btn @click="next" elevation="0" color="transparent" size="30px" icon>
                    <v-icon :style="{ color: darkMode ? darkTextColor : lightTextColor }" size="22px"
                        class="tw:dark:text-white tw:text-black" icon="fas fa-chevron-right" />
                </v-btn>
                <p class="tw:w-[120px]" :style="{ color: darkMode ? darkTextColor : lightTextColor }">
                    {{ currentSelection }}
                </p>
                <v-select :bg-color="darkMode ? darkBgColor : lightBgColor" :theme="darkMode ? 'dark' : 'light'"
                    :base-color="darkMode ? darkTextColor : lightTextColor"
                    :style="{ color: darkMode ? darkTextColor : lightTextColor }" hide-details rounded density="compact"
                    max-width="150px" 
                 
                    item-title="text"
                    item-value="value"
                    :model-value="currentView" @update:model-value="toggle" variant="outlined" flat
                    :items="viewOptions"></v-select>
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
                :use-detail-popup="true" :template="template":month="options.month" :week="options.week" :timezone="options.timezone"
                :calendars="calendars" :events="myEvents" :theme="generatedTheme" />
        </div>
    </div>
</template>

<script setup lang="ts">
import TuiCalendar from './calendar.vue'
import { useI18n } from 'vue-i18n'
import { ComponentTemplateRef, CalendarInfo, EventObject, getTemplate, generateTheme, TZDate } from './index';
import { computed, onMounted, ref, watch } from 'vue';
import GenCalendarSettings from './GenCalendarSettings.vue'
import { getFormattedTimeZones } from './utils/index'
import mitt from 'mitt';
import './styles/main.css'
const { tm,t } = useI18n()
const props = withDefaults(defineProps<{
    darkMode?: boolean
    darkSelectionColor?: string
    darkSelectionBorder?: string
    lightSelectionBorder?: string
    lightSelectionColor?: string
    darkBgColor?: string
    darkTextColor?: string
    lightBgColor?: string
    lightTextColor?: string
    calendars?: CalendarInfo[]
}>(), {
    calendars: () => ([{
        id: 'home',
        color: 'white',
        name: 'Home',
        backgroundColor: '#006c05',
        borderColor: '#006c05',
        dragBackgroundColor: '#006c05',
    },
    {
        id: 'work',
        name: 'Work',
        color: 'white',
        backgroundColor: '#025aa4',
        borderColor: '#025aa4',
        dragBackgroundColor: '#025aa4',
    }]),
    darkMode: true,
    darkSelectionBorder: '1px solid grey',
    lightSelectionBorder: '1px solid grey',
    darkSelectionColor: '#ffffffc7',
    lightSelectionColor: '#0000008f',
    darkBgColor: '#212121',
    darkTextColor: '#ffffff',
    lightBgColor: '#ffffff',
    lightTextColor: '#212121'
})

const generatedTheme = computed(() => {
    const tempTheme = generateTheme()
    tempTheme.common.backgroundColor = props.darkMode ? props.darkBgColor : props.lightBgColor
    tempTheme.month.weekend.backgroundColor = props.darkMode ? props.darkBgColor : props.lightBgColor
    tempTheme.common.gridSelection.backgroundColor = props.darkMode ? props.darkSelectionColor : props.lightSelectionColor
    tempTheme.common.gridSelection.border = props.darkMode ? props.darkSelectionBorder : props.lightSelectionBorder
    tempTheme.month.weekend.backgroundColor = props.darkMode ? props.darkBgColor : props.lightBgColor
    tempTheme.week.timeGridLeftAdditionalTimezone.backgroundColor = props.darkMode ? props.darkBgColor : props.lightBgColor
    tempTheme.week.timeGridLeft.backgroundColor = props.darkMode ? props.darkBgColor : props.lightBgColor
    tempTheme.week.timeGridLeftAdditionalTimezone.backgroundColor = props.darkMode ? props.darkBgColor : props.lightBgColor
    tempTheme.month.moreViewTitle.backgroundColor = props.darkMode ? props.darkBgColor : props.lightBgColor
    tempTheme.common.dayName.color = props.darkMode ? props.darkTextColor : props.lightTextColor
    tempTheme.week.pastDay.color = props.darkMode ? props.darkTextColor : props.lightTextColor
    tempTheme.week.futureTime.color = props.darkMode ? props.darkTextColor : props.lightTextColor
    tempTheme.week.gridSelection.color = props.darkMode ? props.darkTextColor : props.lightTextColor
    return tempTheme
})
const calendarRef = ref<ComponentTemplateRef | undefined>();
const template = ref(getTemplate({t,tm}))
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
    const tempZones: any = []
    if (primaryTimezone) {
        tempZones.push(primaryTimezone)
    }
    if (secondaryTimezone) {
        tempZones.push(secondaryTimezone)
    }
    zones.value = tempZones
})
const myEvents = ref<any[]>([]);
const options = computed(() => ({
    timezone: {
        zones: zones.value,
    },
    month:{
        dayNames:tm('dayNames')
    },
    week: {
        showNowIndicator: true,
        showTimezoneCollapseButton: false,
        timezonesCollapsed: false,
        hourStart: 0,
        dayNames:tm('dayNames'),
        hourEnd: 24,
        eventView: ['time'],
        taskView: false,
        collapseDuplicateEvents: true,
    },
}));

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

const currentSelection = computed(() => {
    const months = tm('months')
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
const viewOptions = [
        {
            text:t('day'),
            value:'day'
        },
        {
            text:t('week'),
            value:'week'
        },
        {
            text:t('month'),
            value:'month'
        },
    ] as const

const currentView = ref<string>('week');

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

<style>
.toastui-calendar-timezone-labels-slot {
    top: 0px !important;
    background-color: unset !important;
    border-bottom: none !important;
    color: var(--timezone-text-color);
}

.toastui-calendar-timezone-labels-slot .toastui-calendar-timegrid-timezone-label {
    background-color: unset !important;
    border-right: none !important;
}

.toastui-calendar-template-weekDayName {
    display: flex;
    justify-content: center;
}
</style>
