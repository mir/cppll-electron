import noOverload from './noOverload';
import { overload, overloadCondition } from './overload';

export default function (tauK, vK, params) {
  let result = noOverload(tauK, vK, params);

  if (overloadCondition(tauK, vK, params)) {
    result = overload(tauK, vK, result.tauK, result.vK, params);
  }
  return result;
}
