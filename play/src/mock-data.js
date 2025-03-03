import { TZDate } from '@toast-ui/calendar';

export function clone(date) {
	return new TZDate(date);
}

export function addHours(d, step) {
	const date = clone(d);
	date.setHours(d.getHours() + step);

	return date;
}

export function addDate(d, step) {
	const date = clone(d);
	date.setDate(d.getDate() + step);

	return date;
}

export function subtractDate(d, steps) {
	const date = clone(d);
	date.setDate(d.getDate() - steps);

	return date;
}

const today = new TZDate();
const tommorow = addDate(today, 1);

export const events = [
	{
		id: '1',
		calendarId: 'home',
		title: 'Home',
		category: 'time',
		start: today,
		end: addHours(today, 2),
		isReadonly: true,
	},
	{
		id: '2',
		calendarId: 'work',
		title: 'Work',
		category: 'time',
		start: tommorow,
		end: addHours(tommorow, 6),
		isReadonly: true,
	},
];
