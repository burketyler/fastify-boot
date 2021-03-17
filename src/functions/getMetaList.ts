export function getMetaList(target: any, symbol: any): string[] {
  return target[symbol] || [];
}
