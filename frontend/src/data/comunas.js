// Comunas de la Región Metropolitana admitidas para despacho.
export const COMUNAS_RM = [
  'Santiago',
  'Providencia',
  'Las Condes',
  'Ñuñoa',
  'La Florida',
  'Maipú',
  'Estación Central',
  'San Miguel',
  'Recoleta',
  'Independencia',
  'La Reina',
  'Peñalolén',
  'Pudahuel',
  'Quilicura',
  'Colina',
  'Lampa',
  'Til Til',
  'Pirque',
  'San José de Maipo',
  'Buín',
  'Calera de Tango',
  'Paine',
  'Melipilla',
  'Talagante',
  'Isla de Maipo',
  'María Pinto',
  'Peñaflor',
  'Curacaví',
  'Alhué',
  'San Pedro',
  'El Monte',
]

export function esComunaRM(comuna) {
  const texto = String(comuna ?? '').trim().toLowerCase()
  return COMUNAS_RM.some((nombre) => nombre.toLowerCase() === texto)
}
