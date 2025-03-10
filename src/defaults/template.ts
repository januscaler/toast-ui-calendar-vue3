export const getTemplate=({t,tm})=>({
    // "milestone": (event:any) => `<span style='color: red;'>${event.title}</span>`,
    // "milestoneTitle": () => `<span>Milestone events</span>`,
    // "task": (event:any) => `<span style='color: red;'>${event.title}</span>`,
    // "taskTitle": () => `<span>Task events</span>`,
    // "allday": (event:any) => `<span style='color: green;'>${event.title}</span>`,
    // "alldayTitle": () => `<span>Allday events</span>`,
    // "time": (event:any) => `<span style='color: black;'>${event.title}</span>`,
    // "goingDuration": (event:any) => `<span>${event.goingDuration}</span>`,
    // "comingDuration": (event:any) => `<span>${event.comingDuration}</span>`,
    // "monthMoreTitleDate": (moreTitle:any) => `<span>${moreTitle.date}</span>`,
    // "monthMoreClose": () => '',
    // "monthGridHeader": (model:any) => `<div><span>${parseInt(model.date.split('-')[2], 10)}<span style="font-size:0.9rem;">${model.date.split('-')[0]}</span></span></div>`,
    // "monthGridHeaderExceed": (hiddenEvents:any) => `<span>${hiddenEvents} more</span>`,
    // "monthGridFooter": () => '',
    // "monthGridFooterExceed": () => '',
    // "monthDayName": (model:any) => model.label,
    "weekDayName": (model:any) => `<div class="toastui-calendar-day-name-item toastui-calendar-week"><span style="font-size:1.1rem;">${model.date}</span>&nbsp;&nbsp;<span style="font-size:0.9rem;">${model.dayName}</span>&nbsp;&nbsp;<span style="font-size:0.9rem;">${model.dateInstance.getFullYear()}</span></div>`,
    // "weekGridFooterExceed": (hiddenEvents:any) => `+${hiddenEvents}`,
    // "collapseBtnTitle": () => `<span>↑</span>`,
    // "timezoneDisplayLabel": ({ timezoneOffset }:any) => {
    //   const sign = timezoneOffset < 0 ? '-' : '+';
    //   const hours = Math.abs(timezoneOffset / 60);
    //   const minutes = Math.abs(timezoneOffset % 60);
    //   return `GMT${sign}${hours}:${minutes}`;
    // },
    // "timegridDisplayPrimaryTime": ({ time }:any) => `primary timezone: ${time}`,
    // "timegridDisplayTime": ({ time }:any) => `sub timezone: ${time}`,
    // "timegridNowIndicatorLabel": ({ time }:any) => `current time: ${time}`,
    "popupIsAllday": () => t('popup.isAllDay'),
    "popupStateFree": () => t('popup.stateFree'),
    "popupStateBusy": () => t('popup.stateBusy'),
    "titlePlaceholder": () => t('popup.titlePlaceholder'),
    "locationPlaceholder": () => t('popup.locationPlaceholder'),
    "startDatePlaceholder": () => t('popup.startDatePlaceholder'),
    "endDatePlaceholder": () => t('popup.endDatePlaceholder'),
    "popupSave": () => t('popup.save'),
    "popupUpdate": () => t('popup.update'),
    "popupEdit": () => t('popup.edit'),
    "popupDelete": () => t('popup.delete'),
    // "popupDetailTitle": ({ title }:any) => title,
    // "popupDetailDate": ({ start, end }:any) => `${start.toString()} - ${end.toString()}`,
    // "popupDetailLocation": ({ location }:any) => location,
    // "popupDetailAttendees": ({ attendees = [] }) => attendees.join(', '),
    // "popupDetailState": ({ state }:any) => state || 'Busy',
    // "popupDetailRecurrenceRule": ({ recurrenceRule }:any) => recurrenceRule,
    // "popupDetailBody": ({ body }:any) => body
  })
  