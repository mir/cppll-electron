import { rem, solveSquare } from './mathLib';

export function overload(tauK, vK, tauK1, vK1, params) {
  const result = {
    tauK,
    vK,
  };
  const p = params;

  const omegaVco = p.omegaFree + (p.Kvco * vK);
  const a = (p.Kvco * p.Ip) / (2 * p.C);
  const b = omegaVco + (p.Kvco * p.Ip * p.R);

  if (tauK < 0) {
    const lx = Math.min(-((p.C / p.Ip) * ((vK + (p.omegaFree / p.Kvco)) - (p.Ip * p.R))), -tauK);
    const S = ((p.Kvco * (tauK + lx) * (tauK + lx) * p.Ip) / 2) / p.C;
    const Sla = rem(S, 1);
    if (omegaVco > 0) {
      if (tauK1 < 0) {
        const lb = (1 - Sla) / omegaVco;
        result.tauK = -(p.Tref - lb);
      } else {
        const Sref = p.Tref * omegaVco;
        const d = (Sla + Sref) - 1;
        result.tauK = solveSquare(a, b, d);
      }
    } else if ((vK + (p.omegaFree / p.Kvco) + (p.Ip * p.R)) < 0) {
      const lb0 = (p.C / p.Ip) * (-(p.omegaFree / p.Kvco) - (p.Ip * p.R) - vK);
      const lbPlus = Math.sqrt((((1 - Sla) * 2 * p.C) / p.Kvco) / p.Ip);
      result.tauK = lb0 + lbPlus;
    } else {
      const d0 = Sla - 1;
      result.tauK = solveSquare(a, b, d0);
    }
  } else if (omegaVco <= 0) {
    if (tauK1 < 0) {
      result.tauK = solveSquare(a, b, -1);
    }
  } else if (tauK1 > 0) {
    const c = ((p.Tref - rem(tauK, p.Tref)) * (p.omegaFree + (p.Kvco * vK))) - 1;
    result.tauK = solveSquare(a, b, c);
  } else {
    result.tauK = ((1 / (p.omegaFree + (p.Kvco * vK))) - p.Tref) + rem(tauK, p.Tref);
  }
  result.vK = vK + ((result.tauK * p.Ip) / p.C);
  return result;
}

export function overloadCondition(tauK, vK, params) {
  const p = params;
  const cond1 = (tauK > 0) && (((vK + (p.omegaFree / p.Kvco)) - ((p.Ip / p.C) * tauK)) < 0);
  const cond2 = (tauK < 0) && ((vK + (p.omegaFree / p.Kvco)) - (p.Ip * p.R) < 0);
  return cond1 || cond2;
}

export function vOverload(tau, params) {
  const p = params;
  let v = 0;
  if (tau <= 0) {
    v = -(p.omegaFree / p.Kvco) + (p.Ip * p.R);
  } else {
    v = -(p.omegaFree / p.Kvco) + ((p.Ip / p.C) * tau);
  }
  return v;
}
