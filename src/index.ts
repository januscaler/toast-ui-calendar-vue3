import TuiCalendar from './calendar.vue';
import GenCalendar from './GenCalendar.vue';
import Calendar, { Day, Month, TZDate, Week, EventObject, ExternalEventTypes, Options } from '@toast-ui/calendar';
import { ComponentTemplateRef, CalendarInfo } from './types/index';
import defaultTheme from './theme';
import { getTemplate } from './defaults/template'
import calendarLocales from './locales/index';
function createCalendar() {
	return {
		install(Vue: any) {
			Vue.component('TuiCalendar', TuiCalendar);
			Vue.component('GenCalendar', GenCalendar);
		},
	};
}

export { createCalendar, calendarLocales, getTemplate };

export default createCalendar();

export type { ComponentTemplateRef, EventObject, ExternalEventTypes, Options, CalendarInfo };
export { Calendar, Day, Month, TZDate, Week, defaultTheme };
