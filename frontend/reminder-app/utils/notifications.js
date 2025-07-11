import notifee, { AndroidStyle, TimestampTrigger, TriggerType, RepeatFrequency } from '@notifee/react-native';

function formatReminderMessage({ title, hour, weekDays }) {
  if (!title || !hour || !weekDays?.length) return 'Lembrete de medicamento';

  const daysPt = {
    MONDAY: 'Segunda-feira',
    TUESDAY: 'Terça-feira',
    WEDNESDAY: 'Quarta-feira',
    THURSDAY: 'Quinta-feira',
    FRIDAY: 'Sexta-feira',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo',
  };

  const daysStr = weekDays
    .map(day => daysPt[day] || day)
    .join(', ');

  return `⏰ Hora do lembrete: ${hour}\n💊 ${title}\n📅 Dias: ${daysStr}`;
}

function getDayNumber(day) {
  const map = {
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
  };
  return map[day];
}

export async function scheduleReminderNotification(reminder) {
  const { id, title, hour, weekDays } = reminder;
  const [hours, minutes] = hour.split(':').map(Number);

  for (const weekDay of weekDays) {
    const dayNumber = getDayNumber(weekDay);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    while (date.getDay() !== dayNumber) {
      date.setDate(date.getDate() + 1);
    }

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.WEEKLY,
    };

    const bodyMessage = formatReminderMessage(reminder) || 'Lembrete de medicamento';

    await notifee.createTriggerNotification(
      {
        id: `${id}-${weekDay}`,
        title: `Hora de tomar ${title}`,
        body: bodyMessage,
        android: {
          channelId: 'default',
          smallIcon: 'ic_launcher',
          style: {
            type: AndroidStyle.BIGTEXT,
            text: bodyMessage, 
          },
        },
      },
      trigger
    );
  }
}

export async function cancelReminderNotifications(reminderId) {
  const allWeekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  for (const day of allWeekDays) {
    await notifee.cancelNotification(`${reminderId}-${day}`);
  }
}
