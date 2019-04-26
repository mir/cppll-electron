import noOverload from './noOverload';
import { overload, overloadCondition } from './overload';
import { rem } from './mathLib';

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

export function equilibria(params) {
  return {
    tauK: 0,
    vK: (1 / (params.Tref * params.Kvco)) - (params.omegaFree / params.Kvco),
  };
}

export function inHoldIn(params) {
  return (1 / params.Tref) > Math.sqrt((params.Kvco * params.Ip) / 4 / params.C);
}

export function cycle3Exists(params) {
  return (1 / params.Tref) <= Math.sqrt((params.Kvco * params.Ip) / 3 / params.C);
}

export function computeNext10(tauK, vK, params) {
  return computeNextN(10, tauK, vK, params);
}

export function computeNext100(tauK, vK, params) {
  return computeNextN(100, tauK, vK, params);
}

export function getSector1(params, maxTau, precision) {
  const results = [{ x: 0, y: 0 }];
  for (let tau = 0; tau < maxTau; tau += precision) {
    let v = 1 / (params.Tref - rem(tau, params.Tref));
    v = (v - params.omegaFree) / params.Kvco;
    results.push({ x: tau, y: v });
  }
  return results;
}

function checkSectorMod1(tau, v, params, last) {
  let check = last - (tau * params.Kvco * v);
  check += (tau * (params.Ip * params.R * params.Kvco));
  check -= params.omegaFree * tau;
  return check;
}

export function getSector2(params, minTau, precision) {
  const results = [{ x: 0, y: 0 }];
  let tau = 0;
  while (tau > minTau) {
    const last = (params.Kvco * params.Ip * tau * tau) / (2 * params.C);
    let v = (1 - (params.Tref * params.omegaFree));
    v -= (tau * params.Ip * params.R * params.Kvco);
    v += (tau * params.omegaFree);
    v -= last;
    v /= ((params.Tref * params.Kvco) - (params.Kvco * tau));
    const check = checkSectorMod1(tau, v, params, last);
    if (check < 0 || check > 1) break;
    results.push({ x: tau, y: v });
    tau += precision;
  }
  return results;
}
