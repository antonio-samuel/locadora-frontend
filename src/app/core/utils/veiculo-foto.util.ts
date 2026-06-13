export function getFotoVeiculo(marca: string, modelo: string): string {
  if (!modelo) return fallbackImage();

  const modeloNormalizado = modelo.toLowerCase().trim();

  // Mapeamento de imagens reais (Unsplash) em alta qualidade para os modelos do sistema
  const fotos: Record<string, string> = {
    'voyage': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800', // Sedan prata elegante
    'hb20': 'https://unsplash.com/pt-br/fotografias/um-carro-preto-estacionado-na-beira-da-estrada-7vbMRkLTIuw', // Hatch moderno
    'onix': 'https://images.unsplash.com/photo-1469285994282-454ceb49e63c?auto=format&fit=crop&q=80&w=800', // Hatch urbano
    'onix plus': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=800', // Sedan premium
    'corolla': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?auto=format&fit=crop&q=80&w=800', // Sedan executivo
    'civic': 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=800', // Sedan esportivo
    'renegade': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800', // SUV robusto
    't-cross': 'https://images.unsplash.com/photo-1534684686641-05569203ecca?auto=format&fit=crop&q=80&w=800', // SUV urbano
    'hilux': 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&q=80&w=800', // Pickup
    's10': 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?auto=format&fit=crop&q=80&w=800', // Pickup noturna
    'polo': 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800', // Hatch premium
    'Ford Territory' : '"C:\Users\SAMUEL\Pictures\territory.jpg"'
  };

  // Procura se o nome do carro digitado no banco contém alguma das chaves acima
  const chaveEncontrada = Object.keys(fotos).find(key => modeloNormalizado.includes(key));

  if (chaveEncontrada) {
    return fotos[chaveEncontrada];
  }

  return fallbackImage();
}

// Fallback genérico para caso o admin cadastre um carro que não está no mapeamento
function fallbackImage(): string {
  return 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800'; 
}