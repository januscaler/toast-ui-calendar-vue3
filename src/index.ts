import GenCalendar from './calendar.vue';
import Calendar, { Day, Month, TZDate, Week, EventObject, ExternalEventTypes, Options } from '@toast-ui/calendar';
import { ComponentTemplateRef, CalendarInfo } from './types/index';
import defaultTheme from './theme';
import callsLocales from './locales/index';
function createCalendar() {
	return {
		install(Vue: any) {
			Vue.component('GenCalendar', GenCalendar);
		},
	};
}

export { createCalendar, callsLocales };

export default createCalendar();

export type { ComponentTemplateRef, EventObject, ExternalEventTypes, Options, CalendarInfo };
export { Calendar, Day, Month, TZDate, Week, defaultTheme };
