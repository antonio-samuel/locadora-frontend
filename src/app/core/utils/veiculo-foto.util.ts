export function getFotoVeiculo(marca: string, modelo: string): string {
  const chave = `${marca.toLowerCase()} ${modelo.toLowerCase()}`;

  const fotos: Record<string, string> = {
    'hyundai hb20':       'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&q=80',
    'chevrolet onix':     'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&q=80',
    'volkswagen polo':    'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=400&q=80',
    'toyota corolla':     'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80',
    'jeep renegade':      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80',
    'toyota hilux':       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    'ford territory':     'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&q=80',
    'volkswagen t-cross': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&q=80',
    'renault kwid':       'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80',
    'chevrolet s10':      'https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?w=400&q=80',
    'fiat uno':           'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&q=80',
    'honda civic':        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&q=80'
  };

  return fotos[chave] ??
    `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80`;
}