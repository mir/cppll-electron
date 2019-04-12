import noOverload from './noOverload';
import { overload, overloadCondition } from './overload';

export function computeNext(tauK, vK, params) {
  let result = noOverload(tauK, vK, params);

  if (overloadCondition(tauK, vK, params)) {
    result = overload(tauK, vK, result.tauK, result.vK, params);
  }
  return result;
}

export function computeNextN(n, tauK, vK, params) {
  const results = [{ x: tauK, y: vK }];
  let prev = { tauK, vK };
  for (let i = 0; i < n; i += 1) {
    const next = computeNext(prev.tauK, prev.vK, params);
    results.push({ x: next.tauK, y: next.vK });
    prev = next;
  }
  return results;
}

export function computeNext10(tauK, vK, params) {
  return computeNextN(10, tauK, vK, params);
}

export function computeNext100(tauK, vK, params) {
  return computeNextN(100, tauK, vK, params);
}
