import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sortByDue, daysUntil, remainingLabel, validateTask, localDate } from '../public/deadlines.js';

test('C2: 入力順に関係なく締切が近い順に並ぶ', () => {
  const tasks = [
    { id: 'a', title: 'レポート', due: '2026-10-25' },
    { id: 'b', title: '小テスト', due: '2026-10-18' },
    { id: 'c', title: '発表資料', due: '2026-10-20' },
  ];
  assert.deepEqual(sortByDue(tasks).map((t) => t.id), ['b', 'c', 'a']);
  assert.deepEqual(tasks.map((t) => t.id), ['a', 'b', 'c'], '元の配列は変更しない');
});

test('C2: 月をまたぐ日付も日付順に並ぶ', () => {
  const tasks = [
    { id: 'a', title: 'x', due: '2026-11-02' },
    { id: 'b', title: 'y', due: '2026-10-31' },
  ];
  assert.deepEqual(sortByDue(tasks).map((t) => t.id), ['b', 'a']);
});

test('C3: 残り日数を日付単位で数える', () => {
  assert.equal(daysUntil('2026-10-20', '2026-10-17'), 3);
  assert.equal(daysUntil('2026-10-17', '2026-10-17'), 0);
  assert.equal(daysUntil('2026-10-16', '2026-10-17'), -1);
  assert.equal(daysUntil('2026-11-01', '2026-10-31'), 1);
});

test('C3: 当日は「今日」、過ぎたら「期限切れ」、それ以外は残り日数', () => {
  assert.equal(remainingLabel(0), '今日');
  assert.equal(remainingLabel(-1), '期限切れ');
  assert.equal(remainingLabel(-10), '期限切れ');
  assert.equal(remainingLabel(1), 'あと1日');
  assert.equal(remainingLabel(12), 'あと12日');
});

test('C4: 課題名が空なら追加できず理由を返す', () => {
  const r1 = validateTask({ title: '', due: '2026-10-20' });
  assert.equal(r1.ok, false);
  assert.match(r1.error, /課題名/);
  const r2 = validateTask({ title: '   ', due: '2026-10-20' });
  assert.equal(r2.ok, false);
  assert.match(r2.error, /課題名/);
});

test('C4: 締切日が未入力なら追加できず理由を返す', () => {
  const r = validateTask({ title: 'レポート', due: '' });
  assert.equal(r.ok, false);
  assert.match(r.error, /締切日/);
});

test('C4: 課題名と締切日があれば追加できる', () => {
  assert.deepEqual(validateTask({ title: 'レポート', due: '2026-10-20' }), { ok: true, error: '' });
});

test('C4: 存在しない日付や不正な形式は追加できない', () => {
  for (const due of ['2026-02-29', '2026-04-31', '2026-13-01', '2026-1-01', 'invalid']) {
    assert.equal(validateTask({ title: 'レポート', due }).ok, false);
  }
  assert.equal(validateTask({ title: 'レポート', due: '2028-02-29' }).ok, true);
});

test('C3: うるう年と年越しでも日付単位で数える', () => {
  assert.equal(daysUntil('2028-03-01', '2028-02-28'), 2);
  assert.equal(daysUntil('2027-01-01', '2026-12-31'), 1);
  assert.equal(daysUntil('2026-03-09', '2026-03-08'), 1);
});

test('C3: 今日の日付は利用者のローカル日付を使う', () => {
  assert.equal(localDate(new Date(2026, 9, 13, 23, 59)), '2026-10-13');
});
