import { sortByDue, daysUntil, remainingLabel, validateTask, localDate } from './deadlines.js';

const storageKey = 'deadline-list.tasks.v1';
const form = document.querySelector('#task-form');
const titleInput = document.querySelector('#title');
const dueInput = document.querySelector('#due');
const error = document.querySelector('#error');
const status = document.querySelector('#status');
const list = document.querySelector('#task-list');
let tasks = [];

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
  if (!Array.isArray(saved) || !saved.every((task) => task && typeof task.id === 'string' && validateTask(task).ok)) {
    throw new Error('Invalid saved tasks');
  }
  tasks = saved;
} catch {
  error.textContent = '保存した課題を読み込めませんでした。ブラウザの保存設定を確認してください。';
}

function save(nextTasks) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(nextTasks));
    tasks = nextTasks;
    error.textContent = '';
    return true;
  } catch {
    error.textContent = '保存できませんでした。ブラウザの保存設定や空き容量を確認してください。';
    return false;
  }
}

function render() {
  const today = localDate();
  const todayElement = document.querySelector('#today');
  todayElement.dateTime = today;
  todayElement.textContent = today.replaceAll('-', '/');
  list.replaceChildren();
  document.querySelector('#count').textContent = `${tasks.length}件`;
  document.querySelector('#empty').hidden = tasks.length > 0;
  for (const task of sortByDue(tasks)) {
    const row = document.createElement('li');
    row.className = 'task';
    const remaining = document.createElement('span');
    remaining.className = 'remaining';
    remaining.textContent = remainingLabel(daysUntil(task.due, today));
    const details = document.createElement('div');
    const title = document.createElement('h3');
    title.className = 'task-title';
    title.textContent = task.title;
    const date = document.createElement('time');
    date.className = 'task-date';
    date.dateTime = task.due;
    date.textContent = `締切 ${task.due.replaceAll('-', '/')}`;
    details.append(title, date);
    const complete = document.createElement('button');
    complete.type = 'button';
    complete.textContent = '完了';
    complete.setAttribute('aria-label', `${task.title}を完了`);
    complete.addEventListener('click', () => {
      if (!save(tasks.filter((item) => item.id !== task.id))) return;
      render();
      status.textContent = `${task.title}を完了しました。`;
      titleInput.focus();
    });
    row.append(remaining, details, complete);
    list.append(row);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const task = { title: titleInput.value.trim(), due: dueInput.value };
  const validation = validateTask(task);
  if (!validation.ok) {
    error.textContent = validation.error;
    status.textContent = '';
    (task.title ? dueInput : titleInput).focus();
    return;
  }
  if (!save([...tasks, { ...task, id: crypto.randomUUID() }])) return;
  form.reset();
  render();
  status.textContent = `${task.title}を追加しました。`;
  titleInput.focus();
});

render();
setInterval(render, 60_000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) render();
});