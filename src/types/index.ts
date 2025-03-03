import Calendar from '@toast-ui/calendar';

export interface ComponentTemplateRef {
    getRootElement: () => HTMLElement | SVGElement | null | undefined;
    getInstance: () => Calendar
}

export interface CalendarInfo {
    id: string;
    name: string;
    color?: string;
    backgroundColor?: string;
    dragBackgroundColor?: string;
    borderColor?: string;
}