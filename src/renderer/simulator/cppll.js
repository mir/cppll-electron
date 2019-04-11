function rem(x, base) {
  let result = Math.abs(x);
  while (result >= base) {
    result -= base;
  }
  return result;
}

function solveSquare(a, b, c) {
  return (-b + Math.sqrt((b * b) - (4 * a * c))) / (2 * a);
}

export default function (tauK, vK, params) {
  const data = { tauK, vK };
  const p = params;
  const a = (p.Kvco * p.Ip) / (2 * p.C);
  const b = p.omegaFree + (p.Kvco * vK) + (p.Kvco * p.Ip * p.R);
  if (tauK >= 0) {
    const c = ((p.Tref - rem(tauK, p.Tref)) * (p.omegaFree + (p.Kvco * vK))) - 1;
    if (c <= 0) {
      // tau(k+1) > 0, case 1)
      data.tauK = solveSquare(a, b, c);
    } else {
      //    tau(k+1) < 0, case 2)
      data.tauK = ((1 / (p.omegaFree + (p.Kvco * vK))) - p.Tref) + rem(tauK, p.Tref);
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
      const lk1 = p.Tref - lb;
      data.tauK = -lk1;
    } else {
      // tau(k + 1) >= 0
      const STref = p.Tref * ((p.Kvco * vK) + p.omegaFree);
      const d = (Sla + STref) - 1;
      data.tauK = solveSquare(a, b, d);
    }
  }
  data.vK = vK + ((data.tauK * p.Ip) / p.C);

  return data;
}
