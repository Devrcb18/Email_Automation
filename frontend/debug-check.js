const fs = require('fs');
console.log('platform', process.platform, process.arch);
try {
  const {MUSL, familySync} = require('detect-libc');
  console.log('familySync', familySync());
  console.log('MUSL', MUSL);
} catch (err) {
  console.log('detect-libc missing', err.message);
}
console.log('has lightningcss', fs.existsSync('/app/node_modules/lightningcss'));
console.log('has gnu', fs.existsSync('/app/node_modules/lightningcss-linux-x64-gnu'));
console.log('has musl', fs.existsSync('/app/node_modules/lightningcss-linux-x64-musl'));
console.log('lightningcss package path', (() => {
  try { return require.resolve('lightningcss'); } catch (e) { return e.message; }
})());
console.log('lightningcss node index path', (() => {
  try { return require.resolve('lightningcss/node/index.js'); } catch (e) { return e.message; }
})());
console.log('detect-libc package path', (() => {
  try { return require.resolve('detect-libc'); } catch (e) { return e.message; }
})());
console.log('lightningcss node dir listing');
try {
  fs.readdirSync('/app/node_modules/lightningcss/node').forEach(file => console.log(file));
} catch (err) {
  console.log('list failed', err.message);
}
console.log('resolve lightningcss-linux-x64-gnu', (() => {
  try { return require.resolve('lightningcss-linux-x64-gnu'); } catch (e) { return e.message; }
})());
console.log('resolve lightningcss-linux-x64-musl', (() => {
  try { return require.resolve('lightningcss-linux-x64-musl'); } catch (e) { return e.message; }
})());
console.log('require lightningcss-linux-x64-gnu', (() => {
  try { require('lightningcss-linux-x64-gnu'); return 'ok'; } catch (e) { return e.message; }
})());
console.log('require lightningcss', (() => {
  try { require('lightningcss'); return 'ok'; } catch (e) { return e.message; }
})());
console.log('tailwind require test');
try {
  require('@tailwindcss/postcss');
  console.log('tailwind loaded');
} catch (err) {
  console.log('tailwind require failed', err && err.message);
}
