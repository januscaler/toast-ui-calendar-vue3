import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';
import 'element-plus/dist/index.css';
import { createCalendar,calendarLocales } from '../src/index';
import { createI18n } from 'vue-i18n'

// main
(async () => {
	const apps = import.meta.glob('./src/*.vue');
	const name = location.pathname.replace(/^\//, '') || 'App';
	const file = apps[`./src/${name}.vue`];
	if (!file) {
		location.pathname = 'App';
		return;
	}

	const i18n = createI18n({
		messages:calendarLocales,
	})

	// @ts-ignore
	const App = (await file()).default;
	const app = createApp(App);
	const calendar = createCalendar()


	app.use(i18n)
	app.use(VXETable);
	app.use(ElementPlus);
	app.use(calendar);

	app.mount('#play');
})();
