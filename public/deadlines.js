export function sortByDue(tasks) {
  return [...tasks].sort((first, second) => first.due.localeCompare(second.due));
}

export function localDate(today = new Date()) {
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function dateValue(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(timestamp)) return NaN;
  return new Date(timestamp).toISOString().slice(0, 10) === value ? timestamp : NaN;
}

export function daysUntil(due, today = localDate()) {
  return (dateValue(due) - dateValue(today)) / 86_400_000;
}

export function remainingLabel(days) {
  if (days < 0) return '期限切れ';
  if (days === 0) return '今日';
  return `あと${days}日`;
}

export function validateTask({ title, due }) {
  if (typeof title !== 'string' || !title.trim()) {
    return { ok: false, error: '課題名を入力してください。' };
  }
  if (!Number.isFinite(dateValue(due))) {
    return { ok: false, error: '有効な締切日を入力してください。' };
  }
  return { ok: true, error: '' };
}