export function set(number, ...x) {
  x.forEach(v => {
    number |= 1 << v;
  });
  return number;
}

export function clear(number, ...xs) {
  xs.forEach(x => {
    number &= ~(1 << x);
  });
  return number;
}

export function toggle(number, x) {
  number ^= 1 << x;
  return number;
}

export function isSet(number, ...xs) {
  return xs.every(x => !!((number >> x) & 1));
}

export function setnth(number, x, n) {
  number ^= (-x ^ number) & (1 << n);
  return number;
}
