import TuiCalendar from './calendar.vue';
import GenCalendar from './GenCalendar.vue';
import Calendar, { Day, Month, TZDate, Week, EventObject, ExternalEventTypes, Options } from '@toast-ui/calendar';
import { ComponentTemplateRef, CalendarInfo } from './types/index';
import { generateTheme } from './defaults/theme';
import { getTemplate } from './defaults/template'
import calendarLocales from './locales/index';
import vuetify from './plugins/vuetify';
function createCalendar() {
	return {
		install(Vue: any) {
			Vue.component('TuiCalendar', TuiCalendar);
			Vue.component('GenCalendar', GenCalendar);
			Vue.use(vuetify);
		},
	};
}


export { createCalendar, calendarLocales, getTemplate };

export default createCalendar();

export type { ComponentTemplateRef, EventObject, ExternalEventTypes, Options, CalendarInfo };
export { Calendar, Day, Month, TZDate, Week, generateTheme };
