const BASE_URL = 'http://192.168.100.14:8080';

function toFormUrlEncoded(obj) {
  return Object.entries(obj)
    .map(([key, val]) => {
      if (Array.isArray(val)) {
        // array -> várias chaves com mesmo nome
        return val.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
    })
    .join('&');
}

// Medicines

export async function getMedicines(name) {
  const url = name ? `${BASE_URL}/medicine/list?name=${encodeURIComponent(name)}` : `${BASE_URL}/medicine/list`;
  const res = await fetch(url);
  return res.json();
}

export async function getMedicine(id) {
  const res = await fetch(`${BASE_URL}/medicine/show/${id}`);
  return res.json();
}

// Para salvar (criar ou editar)
export async function saveMedicine(medicine) {
  // medicine = {id?, name, dosage, format, note}
  const formBody = toFormUrlEncoded(medicine);

  const res = await fetch(`${BASE_URL}/medicine/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
  });
  return res.ok;
}

// Para deletar (via GET, cuidado)
export async function deleteMedicine(id) {
  const res = await fetch(`${BASE_URL}/medicine/delete/${id}`, {
    method: 'DELETE',
  });
  if (res.ok) return true;
  if (res.status === 404) throw new Error('Medicamento não encontrado');
  throw new Error('Erro ao excluir o medicamento');
}


// Reminders

export async function getReminders(title) {
  const url = title ? `${BASE_URL}/reminder/list?title=${encodeURIComponent(title)}` : `${BASE_URL}/reminder/list`;
  const res = await fetch(url);
  return res.json();
}

export async function getReminder(id) {
  const res = await fetch(`${BASE_URL}/reminder/show/${id}`);
  return res.json();
}

// Para salvar reminder (com medicineIds e weekDays)
export async function saveReminder(reminder) {
  // reminder = {id?, title, hour, weekDays: ['MONDAY', 'TUESDAY'], medicineIds: [1, 2, 3]}
  // Note que no backend o binding espera:
  //   - weekDays: List<DayOfWeek>
  //   - medicineIds: List<Long>

  const bodyObj = {
    id: reminder.id,
    title: reminder.title,
    hour: reminder.hour,  // formato 'HH:mm' ou 'HH:mm:ss'?
    // Para os arrays, enviamos múltiplas vezes a mesma chave:
    weekDays: reminder.weekDays,
    medicineIds: reminder.medicineIds,
  };

  const formBody = toFormUrlEncoded(bodyObj);

  const res = await fetch(`${BASE_URL}/reminder/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
  });

  return res.ok;
}

export async function deleteReminder(id) {
  const res = await fetch(`${BASE_URL}/reminder/delete/${id}`);
  return res.ok;
}
