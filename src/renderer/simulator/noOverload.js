import { rem, solveSquare } from './mathLib';

function case1(a, b, c) {
  return solveSquare(a, b, c);
}

function case2(tauK, vK, p) {
  return ((1 / (p.omegaFree + (p.Kvco * vK))) - p.Tref) + rem(tauK, p.Tref);
}

function case3(p, lb) {
  const lk1 = p.Tref - lb;
  return -lk1;
}

function case4(vK, p, Sla, a, b) {
  const STref = p.Tref * ((p.Kvco * vK) + p.omegaFree);
  const d = (Sla + STref) - 1;
  return solveSquare(a, b, d);
}

export default function noOverload(tauK, vK, params) {
  const data = { tauK, vK };
  const p = params;
  const a = (p.Kvco * p.Ip) / (2 * p.C);
  const b = p.omegaFree + (p.Kvco * vK) + (p.Kvco * p.Ip * p.R);

  if (tauK >= 0) {
    const c = ((p.Tref - rem(tauK, p.Tref)) * (p.omegaFree + (p.Kvco * vK))) - 1;
    if (c <= 0) {
      // tau(k+1) > 0, case 1)
      data.tauK = case1(a, b, c);
    } else {
      //    tau(k+1) < 0, case 2)
      data.tauK = case2(tauK, vK, p);
    }
  } else {
    const lk = -tauK;
    let Slk = p.Kvco * vK;
    Slk -= p.Ip * p.R * p.Kvco;
    Slk += p.omegaFree;
    Slk *= lk;
    Slk += (p.Kvco * p.Ip * lk * lk) / (2 * p.C);
    const Sla = rem(Slk, 1);
    const Slb = 1 - Sla;
    const lb = Slb / ((p.Kvco * vK) + p.omegaFree);
    if (lb <= p.Tref) {
      // % tau(k+1) < 0
      data.tauK = case3(p, lb);
    } else {
      // tau(k + 1) >= 0
      data.tauK = case4(vK, p, Sla, a, b);
    }
  }
  data.vK = vK + ((data.tauK * p.Ip) / p.C);

  return data;
}
