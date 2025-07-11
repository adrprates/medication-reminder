import * as FileSystem from 'expo-file-system';

const remindersFile = FileSystem.documentDirectory + 'reminders.json';

export async function loadReminders() {
  try {
    const fileInfo = await FileSystem.getInfoAsync(remindersFile);
    if (!fileInfo.exists) return [];

    const json = await FileSystem.readAsStringAsync(remindersFile);
    return JSON.parse(json);
  } catch (error) {
    console.error('Erro ao carregar lembretes:', error);
    return [];
  }
}

export async function saveReminders(reminders) {
  try {
    const json = JSON.stringify(reminders);
    await FileSystem.writeAsStringAsync(remindersFile, json);
  } catch (error) {
    console.error('Erro ao salvar lembretes:', error);
  }
}

export async function addReminder(reminder) {
  const reminders = await loadReminders();
  reminders.push(reminder);
  await saveReminders(reminders);
}

export async function removeReminder(reminderId) {
  const reminders = await loadReminders();
  const filtered = reminders.filter(r => r.id !== reminderId);
  await saveReminders(filtered);
}