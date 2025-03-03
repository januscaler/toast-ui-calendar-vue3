import TuiCalendar_ from './tui-calendar.vue'
import Calendar, { Day, Month, TZDate, Week, EventObject, ExternalEventTypes, Options } from '@toast-ui/calendar';
import { ComponentTemplateRef, CalendarInfo } from './types/index'
import type { App } from 'vue'
import defaultTheme from './theme'

const install = (app: App) => {
  app.component('TuiCalendar', TuiCalendar_)
}
export const TuiCalendar = TuiCalendar_
TuiCalendar.install = install

export default TuiCalendar
export type { ComponentTemplateRef, EventObject, ExternalEventTypes, Options, CalendarInfo }
export { Calendar, Day, Month, TZDate, Week, defaultTheme }
