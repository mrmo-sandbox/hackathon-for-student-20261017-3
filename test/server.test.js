import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAppServer } from '../server.js';

test('画面とモジュールを配信し、未公開ファイルは配信しない', async (context) => {
  const server = createAppServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  context.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const [path, type] of [['/', 'text/html'], ['/app.js', 'text/javascript'], ['/deadlines.js', 'text/javascript'], ['/style.css', 'text/css']]) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 200);
    assert.ok(response.headers.get('content-type').startsWith(type));
    assert.ok((await response.text()).length > 0);
  }
  assert.equal((await fetch(`${base}/PLAN.md`)).status, 404);
  assert.equal((await fetch(`${base}/`, { method: 'POST' })).status, 405);
  const head = await fetch(base, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
});