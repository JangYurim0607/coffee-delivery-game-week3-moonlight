// 달빛 커피 배달단 — 구조 확인용 테스트 (브라우저 없이 실행)
// 실행: node --test tests/game.test.cjs
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

test('index.html 하나로 실행되고 외부 라이브러리·API를 쓰지 않는다', () => {
  assert.equal((html.match(/<script\b/g) || []).length, 1);
  assert.doesNotMatch(html, /<script[^>]+src=/);
  assert.doesNotMatch(html, /<link[^>]+href=/);
  assert.doesNotMatch(html, /fetch\(|XMLHttpRequest|https?:\/\//);
});

test('스크립트 문법 오류가 없다', () => {
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  assert.doesNotThrow(() => new vm.Script(script));
});

test('기존 버튼(시작·멈추기·처음으로·상호작용·방향 4개)이 유지된다', () => {
  for (const id of ['start', 'pause', 'reset', 'action']) assert.match(html, new RegExp(`<button id="${id}"`));
  for (const dir of ['0,-1', '-1,0', '0,1', '1,0']) assert.match(html, new RegExp(`data-dir="${dir}"`));
});

test('메뉴 12종이 모두 있고 핫·아이스로 나뉜다', () => {
  const names = ['아메리카노', '카페라떼', '카푸치노', '카라멜마끼야또', '바닐라라떼', '초코라떼', '말차라떼', '밀크티', '녹차', '페퍼민트티', '홍차', '루이보스티'];
  for (const n of names) assert.ok(html.includes(`'${n}'`), n);
  assert.match(html, /temp=Math\.random\(\)<\.5\?'hot':'ice'/);
});

test('좁은 화면에서 안내 문구가 줄바꿈된다', () => {
  assert.match(html, /p\.guide\{[^}]*white-space:normal/);
  assert.match(html, /p\.guide\{[^}]*overflow-wrap:anywhere/);
});
