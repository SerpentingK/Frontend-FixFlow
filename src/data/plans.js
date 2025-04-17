export const allFeatures = [
  'Gestión de Ventas',
  'Control de Salidas de Dinero',
  'Sistema de Contabilidad',
  'Gestión de Turnos',
  'Inventario de Dispositivos y facturacion',
  'Control de Reparaciones',
  'Gestión de Entregas',
  'Gestión de Repuestos',
  'Soporte por Correo',
  'Soporte 24/7',
  'Personalización',
  'Número de Locales por defecto'
];

export const plans = [
  {
    id: 1,
    name: 'Plan Básico',
    price: '49.999',
    period: 'mes',
    locations: 2,
    features: [
      'Gestión de Ventas',
      'Control de Salidas de Dinero',
      'Sistema de Contabilidad',
      'Gestión de Turnos',
      'Soporte por Correo',
      'Personalización'
    ]
  },
  {
    id: 2,
    name: 'Plan Estándar',
    price: '79.999',
    period: 'mes',
    locations: 3,
    features: [
      'Gestión de Ventas',
      'Control de Salidas de Dinero',
      'Sistema de Contabilidad',
      'Gestión de Turnos',
      'Inventario de Dispositivos y facturacion',
      'Control de Reparaciones',
      'Gestión de Entregas',
      'Soporte por Correo',
      'Personalización'
    ]
  },
  {
    id: 3,
    name: 'Plan Premium',
    price: '139.999',
    period: 'mes',
    locations: 5,
    features: [
      'Gestión de Ventas',
      'Control de Salidas de Dinero',
      'Sistema de Contabilidad',
      'Gestión de Turnos',
      'Inventario de Dispositivos y facturacion',
      'Control de Reparaciones',
      'Gestión de Entregas',
      'Gestión de Repuestos',
      'Soporte por Correo',
      'Soporte 24/7',
      'Personalización'
    ]
  }
];

export const hasFeature = (plan, feature) => {
  return plan.features.includes(feature);
};

export const getFeatureValue = (plan, feature) => {
  if (feature === 'Número de Locales por defecto') {
    return plan.locations;
  }
  return hasFeature(plan, feature);
}; 