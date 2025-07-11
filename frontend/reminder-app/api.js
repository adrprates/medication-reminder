const BASE_URL = 'https://backend-reminder.onrender.com';

function toFormUrlEncoded(obj) {
  return Object.entries(obj)
    .map(([key, val]) => {
      if (Array.isArray(val)) {
        return val.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
    })
    .join('&');
}


export async function getMedicines(name) {
  const url = name ? `${BASE_URL}/medicine/list?name=${encodeURIComponent(name)}` : `${BASE_URL}/medicine/list`;
  const res = await fetch(url);
  return res.json();
}

export async function getMedicine(id) {
  const res = await fetch(`${BASE_URL}/medicine/show/${id}`);
  return res.json();
}

export async function saveMedicine(medicine) {
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

export async function deleteMedicine(id) {
  const res = await fetch(`${BASE_URL}/medicine/delete/${id}`, {
    method: 'DELETE',
  });
  if (res.ok) return true;
  if (res.status === 404) throw new Error('Medicamento não encontrado');
  throw new Error('Erro ao excluir o medicamento');
}



export async function getReminders(title) {
  const url = title ? `${BASE_URL}/reminder/list?title=${encodeURIComponent(title)}` : `${BASE_URL}/reminder/list`;
  const res = await fetch(url);
  return res.json();
}

export async function getReminder(id) {
  const res = await fetch(`${BASE_URL}/reminder/show/${id}`);
  return res.json();
}

export async function saveReminder(reminder) {

  const bodyObj = {
    id: reminder.id,
    title: reminder.title,
    hour: reminder.hour,  
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
