// mockData.js - Datos extraídos del Excel para pruebas locales
// Clientes: PATTY, V&G, DANNIXA, QUIMI, PROVEFARMA, VISAFARMA, INVERMED, PROSALUD, UNION FAR, BETHEL, FAMEZA, BARIZAL, JUMICA, BOTICAS PERU, HOGAR Y SALUD, LIMATAMBO, UNIVERSAL, HOLLYGOOD, LIDER, NOVAFARMA, LAGOMEDICA, AMERICA SALUD, SAN MARCOS

const mockClientes = [
  { id: 'patty', nombre: 'PATTY FARMA' },
  { id: 'vg', nombre: 'V&G FARMA' },
  { id: 'dannixa', nombre: 'DANNIXA' },
  { id: 'quimi', nombre: 'QUIMICA SILVA' },
  { id: 'provefarma', nombre: 'PROVEFARMA' },
  { id: 'visafarma', nombre: 'VISAFARMA' },
  { id: 'invermed', nombre: 'INVERMED' },
  { id: 'prosalud', nombre: 'PROSALUD' },
  { id: 'unionfar', nombre: 'UNION FAR' },
  { id: 'bethel', nombre: 'BETHEL' },
  { id: 'fameza', nombre: 'FAMEZA' },
  { id: 'barizal', nombre: 'BARIZAL' },
  { id: 'jumica', nombre: 'JUMICA' },
  { id: 'boticasperu', nombre: 'BOTICAS PERU' },
  { id: 'hogarsalud', nombre: 'HOGAR Y SALUD' },
  { id: 'limatambo', nombre: 'LIMATAMBO' },
  { id: 'universal', nombre: 'UNIVERSAL' },
  { id: 'hollygood', nombre: 'HOLLYGOOD' },
  { id: 'lider', nombre: 'LIDER' },
  { id: 'novafarma', nombre: 'NOVAFARMA' },
  { id: 'lagomedica', nombre: 'LAGOMEDICA' },
  { id: 'americasalud', nombre: 'AMERICA SALUD' },
  { id: 'sanmarcos', nombre: 'SAN MARCOS' }
];

const mockProductos = [
  { id: 'amigdazol_spray', nombre: 'AMIGDAZOL NF SPRAY x 30 ml', presentacion: 'CAJA X 120 TROC' },
  { id: 'amigdazol_past', nombre: 'AMIGDAZOL NF (10+5+2) MG X120 PAST', presentacion: 'CAJA X 120 TROC' },
  { id: 'aproxol_1000', nombre: 'APROXOL 1000,1G TABLETAS', presentacion: 'CAJA X 100 TAB' },
  { id: 'aproxol_plus', nombre: 'APROXOL PLUS', presentacion: 'CAJA x 60 TBS RECUB' },
  { id: 'broncodex', nombre: 'BRONCODEX COMPUESTO JRB', presentacion: 'FRASCO x 120 mL' },
  { id: 'ceftrex', nombre: 'CEFTREX', presentacion: '1 vial + 1 ampolla' },
  { id: 'cetirimax_jbe', nombre: 'CETIRIMAX D JBE X 60 ML', presentacion: 'FRASCO x 60 mL' },
  { id: 'cetirimax_tab', nombre: 'CETIRIMAX D Tabletas', presentacion: 'CJ x 100 TAB' },
  { id: 'claritrox_500', nombre: 'CLARITROX 500mg COMP RECUB', presentacion: 'CAJA x 100 COMP REC' },
  { id: 'cortafan_forte', nombre: 'CORTAFAN FORTE 220 mg / 5 ml', presentacion: 'FRASCO x 100 mL' },
  { id: 'cortafan_nf', nombre: 'CORTAFAN NF 200 MG CAPSULAS', presentacion: 'CAJA x 100 CAPSULAS' },
  { id: 'deltamox', nombre: 'Deltamox 250 Mg/5ml Polvo', presentacion: 'FRASCO X 60 ML' },
  { id: 'dexabron_jbe', nombre: 'DEXABRON / EXPECTORANTE JBE', presentacion: 'FRASCO x 120 mL' },
  { id: 'dexabron_caps', nombre: 'DEXABRON NUEVA FORMULA CAPSULAS', presentacion: 'CAJA x 100 CAPS' },
  { id: 'dexabron_plus', nombre: 'DEXABRON PLUS COMPUESTO TAB REC', presentacion: 'CAJA x 100 TAB' },
  { id: 'diosmin_h', nombre: 'DIOSMIN H 500 MG', presentacion: 'CJ x 60 TAB REC' },
  { id: 'doloaproxol', nombre: 'DOLOAPROXOL DUAL FORTE COM R', presentacion: 'CAJA X 400 COMP REC' },
  { id: 'espasmosedil', nombre: 'ESPASMOSEDIL COMPUESTO', presentacion: 'CAJA x 100 COMP REC' },
  { id: 'gripalert_jbe', nombre: 'GRIPALERT JARABE', presentacion: 'FRASCO X 100 mL' },
  { id: 'gripalert_tab', nombre: 'GRIPALERT PLUS TABLETAS', presentacion: 'CAJA x 100 TABS' },
  { id: 'gynoval_fem', nombre: 'GYNOVAL FEM', presentacion: 'CAJA X 50 Ovulos' },
  { id: 'hepavit', nombre: 'HEPAVIT B COMPLEX', presentacion: 'CAJA X 100 CAP' },
  { id: 'ivermed', nombre: 'IVERMED 20 ML', presentacion: 'Caja x 1 frasco' },
  { id: 'kallozil', nombre: 'KALLOZIL 17g/100mL Solucion', presentacion: 'Caja Frasco x 8.0 mL' },
  { id: 'ketonl', nombre: 'KETONL Shampoo', presentacion: 'Frasco x 130ml' },
  { id: 'limonada_purgante', nombre: 'LIMONADA PURGANTE MARKOS', presentacion: 'FRASCO X 200 Ml' },
  { id: 'maldex', nombre: 'MALDEX JARABE', presentacion: 'FRASCO x 120 mL' },
  { id: 'miofedrol', nombre: 'MIOFEDROL RELAX PLUS COMP', presentacion: 'CAJA x 100 COMP RECUB' },
  { id: 'mystol', nombre: 'MYSTOL 200 mcg Tabletas', presentacion: 'CAJA X 30 TABL' },
  { id: 'paramidol_tab', nombre: 'Paramidol 500 mg caja', presentacion: 'CAJA X 100 TABLETAS' },
  { id: 'parasitel_susp', nombre: 'PARASITEL SUSP X 10ML', presentacion: 'FRASCO X 10mL' },
  { id: 'parasitel_tab', nombre: 'PARASITEL TABLETAS', presentacion: 'CAJA' },
  { id: 'penetro_forte_100', nombre: 'PENETRO FORTE 30g+10g X 100', presentacion: 'POTE X 100 g' },
  { id: 'penetro_forte_60', nombre: 'PENETRO FORTE 30g+10g X 60', presentacion: 'POTE X 60 g' },
  { id: 'penetro_forte_30', nombre: 'PENETRO FORTE 30g+10g X 30', presentacion: 'POTE X 30 g' },
  { id: 'prostal', nombre: 'PROSTAL CAPSULAS', presentacion: 'CAJA X 100 CAP' },
  { id: 'tanderil_50', nombre: 'Tanderil 50 mg caja', presentacion: 'CAJA X 100 TAB REC' },
  { id: 'tosalflem', nombre: 'Tosalflem 1,25mg+30mg+10mg', presentacion: 'FRASCO X 120 ML' },
  { id: 'urobac', nombre: 'UROBAC 500 mg COMP RECUB', presentacion: 'CAJA x 100 COMP REC' },
  { id: 'urotan_d', nombre: 'UROTAN D CAPSULAS', presentacion: 'CAJA x 100 CAPS' },
  { id: 'zitrozin_100', nombre: 'Zitrozin 500mg X 100 Tableta', presentacion: 'CAJA X 100 TABL' },
  { id: 'zitrozin_3', nombre: 'Zitrozin 500mg X 3 Tableta', presentacion: 'CAJA X 3 TABL' }
];

// Precios por cliente y producto (simplificado)
const mockPrecios = [
  // AMIGDAZOL SPRAY
  { clienteId: 'patty', productoId: 'amigdazol_spray', precio: 14.50 },
  { clienteId: 'vg', productoId: 'amigdazol_spray', precio: 15.00 },
  { clienteId: 'quimi', productoId: 'amigdazol_spray', precio: 15.00 },
  { clienteId: 'provefarma', productoId: 'amigdazol_spray', precio: 15.00 },
  { clienteId: 'visafarma', productoId: 'amigdazol_spray', precio: 14.70 },
  { clienteId: 'prosalud', productoId: 'amigdazol_spray', precio: 15.00 },
  { clienteId: 'bethel', productoId: 'amigdazol_spray', precio: 15.00 },
  { clienteId: 'fameza', productoId: 'amigdazol_spray', precio: 15.97 },
  { clienteId: 'barizal', productoId: 'amigdazol_spray', precio: 15.01 },
  { clienteId: 'boticasperu', productoId: 'amigdazol_spray', precio: 15.97 },
  { clienteId: 'lider', productoId: 'amigdazol_spray', precio: 14.00 },
  { clienteId: 'novafarma', productoId: 'amigdazol_spray', precio: 14.50 },

  // AMIGDAZOL PAST
  { clienteId: 'patty', productoId: 'amigdazol_past', precio: 40.81 },
  { clienteId: 'vg', productoId: 'amigdazol_past', precio: 41.00 },
  { clienteId: 'quimi', productoId: 'amigdazol_past', precio: 41.76 },
  { clienteId: 'provefarma', productoId: 'amigdazol_past', precio: 42.60 },

  // APROXOL 1000
  { clienteId: 'vg', productoId: 'aproxol_1000', precio: 55.00 },
  { clienteId: 'quimi', productoId: 'aproxol_1000', precio: 55.00 },

  // APROXOL PLUS
  { clienteId: 'patty', productoId: 'aproxol_plus', precio: 51.75 },
  { clienteId: 'vg', productoId: 'aproxol_plus', precio: 52.50 },
  { clienteId: 'quimi', productoId: 'aproxol_plus', precio: 52.50 },
  { clienteId: 'provefarma', productoId: 'aproxol_plus', precio: 52.50 },

  // BRONCODEX
  { clienteId: 'patty', productoId: 'broncodex', precio: 11.00 },
  { clienteId: 'vg', productoId: 'broncodex', precio: 11.00 },
  { clienteId: 'quimi', productoId: 'broncodex', precio: 11.00 },
  { clienteId: 'provefarma', productoId: 'broncodex', precio: 11.00 },
  { clienteId: 'visafarma', productoId: 'broncodex', precio: 11.00 },
  { clienteId: 'invermed', productoId: 'broncodex', precio: 11.00 },
  { clienteId: 'bethel', productoId: 'broncodex', precio: 11.00 },
  { clienteId: 'fameza', productoId: 'broncodex', precio: 12.49 },
  { clienteId: 'barizal', productoId: 'broncodex', precio: 12.49 },
  { clienteId: 'lider', productoId: 'broncodex', precio: 9.00 },
  { clienteId: 'novafarma', productoId: 'broncodex', precio: 10.80 },

  // CEFTREX
  { clienteId: 'patty', productoId: 'ceftrex', precio: 7.50 },
  { clienteId: 'vg', productoId: 'ceftrex', precio: 7.50 },
  { clienteId: 'dannixa', productoId: 'ceftrex', precio: 7.00 },
  { clienteId: 'invermed', productoId: 'ceftrex', precio: 7.50 },
  { clienteId: 'prosalud', productoId: 'ceftrex', precio: 8.00 },
  { clienteId: 'bethel', productoId: 'ceftrex', precio: 8.00 },

  // CETIRIMAX D JBE
  { clienteId: 'patty', productoId: 'cetirimax_jbe', precio: 11.00 },
  { clienteId: 'vg', productoId: 'cetirimax_jbe', precio: 11.00 },
  { clienteId: 'quimi', productoId: 'cetirimax_jbe', precio: 11.00 },

  // CETIRIMAX D TAB
  { clienteId: 'patty', productoId: 'cetirimax_tab', precio: 117.00 },
  { clienteId: 'quimi', productoId: 'cetirimax_tab', precio: 126.82 },
  { clienteId: 'provefarma', productoId: 'cetirimax_tab', precio: 121.05 },
  { clienteId: 'bethel', productoId: 'cetirimax_tab', precio: 146.00 },
  { clienteId: 'fameza', productoId: 'cetirimax_tab', precio: 128.00 },
  { clienteId: 'barizal', productoId: 'cetirimax_tab', precio: 98.00 },
  { clienteId: 'universal', productoId: 'cetirimax_tab', precio: 117.00 },

  // CLARITROX
  { clienteId: 'quimi', productoId: 'claritrox_500', precio: 25.00 },
  { clienteId: 'patty', productoId: 'claritrox_500', precio: 115.00 },
  { clienteId: 'vg', productoId: 'claritrox_500', precio: 128.00 },
  { clienteId: 'bethel', productoId: 'claritrox_500', precio: 100.00 },

  // CORTAFAN FORTE
  { clienteId: 'patty', productoId: 'cortafan_forte', precio: 11.00 },
  { clienteId: 'vg', productoId: 'cortafan_forte', precio: 11.00 },
  { clienteId: 'dannixa', productoId: 'cortafan_forte', precio: 11.00 },
  { clienteId: 'quimi', productoId: 'cortafan_forte', precio: 11.00 },
  { clienteId: 'provefarma', productoId: 'cortafan_forte', precio: 54.98 },
  { clienteId: 'invermed', productoId: 'cortafan_forte', precio: 11.00 },
  { clienteId: 'prosalud', productoId: 'cortafan_forte', precio: 55.00 },
  { clienteId: 'bethel', productoId: 'cortafan_forte', precio: 11.00 },
  { clienteId: 'fameza', productoId: 'cortafan_forte', precio: 12.00 },
  { clienteId: 'boticasperu', productoId: 'cortafan_forte', precio: 11.00 },

  // CORTAFAN NF
  { clienteId: 'patty', productoId: 'cortafan_nf', precio: 53.50 },
  { clienteId: 'vg', productoId: 'cortafan_nf', precio: 53.82 },
  { clienteId: 'quimi', productoId: 'cortafan_nf', precio: 51.00 },
  { clienteId: 'invermed', productoId: 'cortafan_nf', precio: 53.00 },
  { clienteId: 'bethel', productoId: 'cortafan_nf', precio: 53.51 },
  { clienteId: 'universal', productoId: 'cortafan_nf', precio: 53.50 },

  // DELTAMOX
  { clienteId: 'patty', productoId: 'deltamox', precio: 8.00 },
  { clienteId: 'vg', productoId: 'deltamox', precio: 8.00 },
  { clienteId: 'quimi', productoId: 'deltamox', precio: 8.00 },

  // DEXABRON JBE
  { clienteId: 'patty', productoId: 'dexabron_jbe', precio: 10.80 },
  { clienteId: 'vg', productoId: 'dexabron_jbe', precio: 11.00 },
  { clienteId: 'dannixa', productoId: 'dexabron_jbe', precio: 11.00 },
  { clienteId: 'quimi', productoId: 'dexabron_jbe', precio: 11.00 },
  { clienteId: 'provefarma', productoId: 'dexabron_jbe', precio: 11.00 },
  { clienteId: 'visafarma', productoId: 'dexabron_jbe', precio: 11.00 },
  { clienteId: 'invermed', productoId: 'dexabron_jbe', precio: 10.00 },
  { clienteId: 'prosalud', productoId: 'dexabron_jbe', precio: 11.00 },
  { clienteId: 'bethel', productoId: 'dexabron_jbe', precio: 11.00 },
  { clienteId: 'fameza', productoId: 'dexabron_jbe', precio: 12.00 },
  { clienteId: 'barizal', productoId: 'dexabron_jbe', precio: 12.00 },
  { clienteId: 'boticasperu', productoId: 'dexabron_jbe', precio: 12.02 },
  { clienteId: 'universal', productoId: 'dexabron_jbe', precio: 10.50 },
  { clienteId: 'lider', productoId: 'dexabron_jbe', precio: 11.00 },
  { clienteId: 'sanmarcos', productoId: 'dexabron_jbe', precio: 10.50 },

  // DEXABRON CAPS
  { clienteId: 'patty', productoId: 'dexabron_caps', precio: 45.00 },
  { clienteId: 'vg', productoId: 'dexabron_caps', precio: 45.00 },
  { clienteId: 'quimi', productoId: 'dexabron_caps', precio: 45.00 },

  // DEXABRON PLUS
  { clienteId: 'patty', productoId: 'dexabron_plus', precio: 45.00 },
  { clienteId: 'vg', productoId: 'dexabron_plus', precio: 45.00 },
  { clienteId: 'provefarma', productoId: 'dexabron_plus', precio: 45.00 },
  { clienteId: 'lider', productoId: 'dexabron_plus', precio: 43.00 },

  // DIOSMIN H
  { clienteId: 'patty', productoId: 'diosmin_h', precio: 82.49 },
  { clienteId: 'vg', productoId: 'diosmin_h', precio: 82.89 },
  { clienteId: 'quimi', productoId: 'diosmin_h', precio: 82.47 },
  { clienteId: 'visafarma', productoId: 'diosmin_h', precio: 80.00 },
  { clienteId: 'bethel', productoId: 'diosmin_h', precio: 83.02 },
  { clienteId: 'fameza', productoId: 'diosmin_h', precio: 84.96 },
  { clienteId: 'barizal', productoId: 'diosmin_h', precio: 84.96 },
  { clienteId: 'lider', productoId: 'diosmin_h', precio: 75.00 },
  { clienteId: 'novafarma', productoId: 'diosmin_h', precio: 88.67 },
  { clienteId: 'universal', productoId: 'diosmin_h', precio: 82.00 },

  // DOLOAPROXOL
  { clienteId: 'vg', productoId: 'doloaproxol', precio: 203.71 },

  // ESPASMOSEDIL
  { clienteId: 'vg', productoId: 'espasmosedil', precio: 53.01 },
  { clienteId: 'quimi', productoId: 'espasmosedil', precio: 57.50 },

  // GRIPALERT JARABE
  { clienteId: 'patty', productoId: 'gripalert_jbe', precio: 8.30 },
  { clienteId: 'vg', productoId: 'gripalert_jbe', precio: 10.20 },
  { clienteId: 'dannixa', productoId: 'gripalert_jbe', precio: 8.30 },
  { clienteId: 'quimi', productoId: 'gripalert_jbe', precio: 10.50 },
  { clienteId: 'invermed', productoId: 'gripalert_jbe', precio: 8.30 },
  { clienteId: 'fameza', productoId: 'gripalert_jbe', precio: 8.88 },
  { clienteId: 'barizal', productoId: 'gripalert_jbe', precio: 8.30 },

  // GRIPALERT PLUS
  { clienteId: 'patty', productoId: 'gripalert_tab', precio: 57.31 },
  { clienteId: 'vg', productoId: 'gripalert_tab', precio: 55.00 },
  { clienteId: 'quimi', productoId: 'gripalert_tab', precio: 55.00 },

  // GYNOVAL FEM
  { clienteId: 'patty', productoId: 'gynoval_fem', precio: 85.00 },
  { clienteId: 'vg', productoId: 'gynoval_fem', precio: 87.00 },
  { clienteId: 'universal', productoId: 'gynoval_fem', precio: 90.00 },

  // HEPAVIT
  { clienteId: 'patty', productoId: 'hepavit', precio: 54.50 },
  { clienteId: 'vg', productoId: 'hepavit', precio: 55.30 },
  { clienteId: 'quimi', productoId: 'hepavit', precio: 55.00 },
  { clienteId: 'provefarma', productoId: 'hepavit', precio: 54.00 },
  { clienteId: 'bethel', productoId: 'hepavit', precio: 55.00 },
  { clienteId: 'universal', productoId: 'hepavit', precio: 54.00 },

  // IVERMED
  { clienteId: 'patty', productoId: 'ivermed', precio: 10.00 },
  { clienteId: 'vg', productoId: 'ivermed', precio: 10.00 },
  { clienteId: 'quimi', productoId: 'ivermed', precio: 10.00 },

  // KALLOZIL
  { clienteId: 'patty', productoId: 'kallozil', precio: 13.50 },
  { clienteId: 'vg', productoId: 'kallozil', precio: 13.64 },
  { clienteId: 'quimi', productoId: 'kallozil', precio: 13.00 },
  { clienteId: 'provefarma', productoId: 'kallozil', precio: 13.65 },
  { clienteId: 'bethel', productoId: 'kallozil', precio: 14.24 },
  { clienteId: 'fameza', productoId: 'kallozil', precio: 13.50 },
  { clienteId: 'boticasperu', productoId: 'kallozil', precio: 13.50 },

  // KETONL
  { clienteId: 'patty', productoId: 'ketonl', precio: 26.00 },
  { clienteId: 'vg', productoId: 'ketonl', precio: 25.00 },
  { clienteId: 'provefarma', productoId: 'ketonl', precio: 25.00 },
  { clienteId: 'visafarma', productoId: 'ketonl', precio: 24.00 },
  { clienteId: 'prosalud', productoId: 'ketonl', precio: 27.60 },
  { clienteId: 'barizal', productoId: 'ketonl', precio: 25.02 },
  { clienteId: 'boticasperu', productoId: 'ketonl', precio: 27.00 },
  { clienteId: 'universal', productoId: 'ketonl', precio: 25.00 },

  // LIMONADA PURGANTE
  { clienteId: 'patty', productoId: 'limonada_purgante', precio: 7.50 },
  { clienteId: 'vg', productoId: 'limonada_purgante', precio: 7.50 },
  { clienteId: 'quimi', productoId: 'limonada_purgante', precio: 7.80 },

  // MALDEX
  { clienteId: 'patty', productoId: 'maldex', precio: 11.40 },
  { clienteId: 'vg', productoId: 'maldex', precio: 11.40 },
  { clienteId: 'quimi', productoId: 'maldex', precio: 11.42 },
  { clienteId: 'provefarma', productoId: 'maldex', precio: 11.42 },
  { clienteId: 'invermed', productoId: 'maldex', precio: 11.42 },
  { clienteId: 'prosalud', productoId: 'maldex', precio: 11.42 },
  { clienteId: 'bethel', productoId: 'maldex', precio: 11.40 },
  { clienteId: 'lider', productoId: 'maldex', precio: 10.00 },
  { clienteId: 'universal', productoId: 'maldex', precio: 11.00 },

  // MIOFEDROL
  { clienteId: 'patty', productoId: 'miofedrol', precio: 105.00 },
  { clienteId: 'vg', productoId: 'miofedrol', precio: 105.00 },
  { clienteId: 'dannixa', productoId: 'miofedrol', precio: 105.00 },
  { clienteId: 'quimi', productoId: 'miofedrol', precio: 105.00 },
  { clienteId: 'invermed', productoId: 'miofedrol', precio: 105.00 },
  { clienteId: 'barizal', productoId: 'miofedrol', precio: 116.21 },
  { clienteId: 'novafarma', productoId: 'miofedrol', precio: 119.67 },
  { clienteId: 'universal', productoId: 'miofedrol', precio: 105.00 },

  // MYSTOL
  { clienteId: 'patty', productoId: 'mystol', precio: 37.00 },
  { clienteId: 'vg', productoId: 'mystol', precio: 37.00 },
  { clienteId: 'visafarma', productoId: 'mystol', precio: 37.50 },
  { clienteId: 'invermed', productoId: 'mystol', precio: 35.00 },
  { clienteId: 'prosalud', productoId: 'mystol', precio: 37.00 },
  { clienteId: 'bethel', productoId: 'mystol', precio: 37.01 },

  // PARAMIDOL
  { clienteId: 'patty', productoId: 'paramidol_tab', precio: 5.00 },
  { clienteId: 'vg', productoId: 'paramidol_tab', precio: 5.00 },
  { clienteId: 'quimi', productoId: 'paramidol_tab', precio: 5.00 },
  { clienteId: 'barizal', productoId: 'paramidol_tab', precio: 6.00 },

  // PARASITEL
  { clienteId: 'patty', productoId: 'parasitel_susp', precio: 25.30 },
  { clienteId: 'vg', productoId: 'parasitel_susp', precio: 25.00 },
  { clienteId: 'provefarma', productoId: 'parasitel_susp', precio: 25.00 },
  { clienteId: 'boticasperu', productoId: 'parasitel_susp', precio: 25.00 },

  { clienteId: 'vg', productoId: 'parasitel_tab', precio: 61.00 },
  { clienteId: 'quimi', productoId: 'parasitel_tab', precio: 65.92 },
  { clienteId: 'universal', productoId: 'parasitel_tab', precio: 61.00 },

  // PENETRO FORTE
  { clienteId: 'vg', productoId: 'penetro_forte_100', precio: 13.70 },
  { clienteId: 'quimi', productoId: 'penetro_forte_100', precio: 13.80 },
  { clienteId: 'provefarma', productoId: 'penetro_forte_100', precio: 13.70 },
  { clienteId: 'visafarma', productoId: 'penetro_forte_100', precio: 13.50 },
  { clienteId: 'invermed', productoId: 'penetro_forte_100', precio: 13.73 },
  { clienteId: 'bethel', productoId: 'penetro_forte_100', precio: 14.00 },
  { clienteId: 'visafarma', productoId: 'penetro_forte_100', precio: 13.50 },
  { clienteId: 'boticasperu', productoId: 'penetro_forte_100', precio: 14.00 },
  { clienteId: 'sanmarcos', productoId: 'penetro_forte_100', precio: 13.50 },

  { clienteId: 'patty', productoId: 'penetro_forte_60', precio: 9.00 },
  { clienteId: 'vg', productoId: 'penetro_forte_60', precio: 9.00 },
  { clienteId: 'quimi', productoId: 'penetro_forte_60', precio: 9.00 },
  { clienteId: 'provefarma', productoId: 'penetro_forte_60', precio: 9.00 },
  { clienteId: 'visafarma', productoId: 'penetro_forte_60', precio: 6.00 },
  { clienteId: 'invermed', productoId: 'penetro_forte_60', precio: 8.50 },
  { clienteId: 'prosalud', productoId: 'penetro_forte_60', precio: 9.00 },
  { clienteId: 'bethel', productoId: 'penetro_forte_60', precio: 9.00 },
  { clienteId: 'boticasperu', productoId: 'penetro_forte_60', precio: 9.00 },
  { clienteId: 'sanmarcos', productoId: 'penetro_forte_60', precio: 8.70 },

  { clienteId: 'patty', productoId: 'penetro_forte_30', precio: 6.00 },
  { clienteId: 'vg', productoId: 'penetro_forte_30', precio: 6.00 },
  { clienteId: 'quimi', productoId: 'penetro_forte_30', precio: 6.00 },
  { clienteId: 'provefarma', productoId: 'penetro_forte_30', precio: 6.00 },
  { clienteId: 'visafarma', productoId: 'penetro_forte_30', precio: 9.00 },
  { clienteId: 'invermed', productoId: 'penetro_forte_30', precio: 5.50 },
  { clienteId: 'prosalud', productoId: 'penetro_forte_30', precio: 6.00 },
  { clienteId: 'bethel', productoId: 'penetro_forte_30', precio: 6.00 },
  { clienteId: 'boticasperu', productoId: 'penetro_forte_30', precio: 6.00 },
  { clienteId: 'sanmarcos', productoId: 'penetro_forte_30', precio: 5.50 },

  // PROSTAL
  { clienteId: 'patty', productoId: 'prostal', precio: 122.00 },
  { clienteId: 'vg', productoId: 'prostal', precio: 124.59 },

  // TANDERIL
  { clienteId: 'patty', productoId: 'tanderil_50', precio: 0.00 },
  { clienteId: 'vg', productoId: 'tanderil_50', precio: 0.00 },
  { clienteId: 'provefarma', productoId: 'tanderil_50', precio: 0.00 },

  // TOSALFLEM
  { clienteId: 'patty', productoId: 'tosalflem', precio: 11.00 },
  { clienteId: 'vg', productoId: 'tosalflem', precio: 11.42 },
  { clienteId: 'quimi', productoId: 'tosalflem', precio: 11.42 },
  { clienteId: 'invermed', productoId: 'tosalflem', precio: 11.42 },
  { clienteId: 'novafarma', productoId: 'tosalflem', precio: 10.80 },

  // UROBAC
  { clienteId: 'patty', productoId: 'urobac', precio: 210.00 },
  { clienteId: 'vg', productoId: 'urobac', precio: 210.00 },
  { clienteId: 'bethel', productoId: 'urobac', precio: 235.50 },

  // UROTAN D
  { clienteId: 'patty', productoId: 'urotan_d', precio: 80.00 },
  { clienteId: 'vg', productoId: 'urotan_d', precio: 80.00 },
  { clienteId: 'quimi', productoId: 'urotan_d', precio: 80.00 },
  { clienteId: 'bethel', productoId: 'urotan_d', precio: 90.26 },
  { clienteId: 'universal', productoId: 'urotan_d', precio: 80.00 },

  // ZITROZIN
  { clienteId: 'patty', productoId: 'zitrozin_100', precio: 83.50 },
  { clienteId: 'vg', productoId: 'zitrozin_100', precio: 100.00 },
  { clienteId: 'quimi', productoId: 'zitrozin_100', precio: 100.00 },
  { clienteId: 'bethel', productoId: 'zitrozin_100', precio: 80.00 },
  { clienteId: 'lider', productoId: 'zitrozin_100', precio: 80.00 },

  { clienteId: 'patty', productoId: 'zitrozin_3', precio: 3.00 },
  { clienteId: 'vg', productoId: 'zitrozin_3', precio: 3.00 },
  { clienteId: 'quimi', productoId: 'zitrozin_3', precio: 3.00 }
];

// Ventas de ejemplo (últimos 60 días)
const mockVentas = [
  { clienteId: 'patty', productoId: 'amigdazol_spray', lote: 'L001', cantidad: 5, fechaVencimiento: new Date(2026, 7, 15), fechaVenta: new Date(2026, 4, 5), mesCompra: '2026-5' },
  { clienteId: 'vg', productoId: 'broncodex', lote: 'L002', cantidad: 3, fechaVencimiento: new Date(2026, 8, 20), fechaVenta: new Date(2026, 4, 6), mesCompra: '2026-5' },
  { clienteId: 'quimi', productoId: 'cortafan_nf', lote: 'L003', cantidad: 2, fechaVencimiento: new Date(2026, 7, 10), fechaVenta: new Date(2026, 4, 7), mesCompra: '2026-5' },
  { clienteId: 'patty', productoId: 'dexabron_jbe', lote: 'L004', cantidad: 4, fechaVencimiento: new Date(2026, 6, 25), fechaVenta: new Date(2026, 4, 8), mesCompra: '2026-5' },
  { clienteId: 'visafarma', productoId: 'kallozil', lote: 'L005', cantidad: 6, fechaVencimiento: new Date(2026, 5, 30), fechaVenta: new Date(2026, 4, 10), mesCompra: '2026-5' },
  { clienteId: 'invermed', productoId: 'ketonl', lote: 'L006', cantidad: 2, fechaVencimiento: new Date(2026, 8, 15), fechaVenta: new Date(2026, 4, 11), mesCompra: '2026-5' },
  { clienteId: 'prosalud', productoId: 'gripalert_jbe', lote: 'L007', cantidad: 3, fechaVencimiento: new Date(2026, 7, 5), fechaVenta: new Date(2026, 4, 12), mesCompra: '2026-5' },
  { clienteId: 'bethel', productoId: 'paramidol_tab', lote: 'L008', cantidad: 5, fechaVencimiento: new Date(2026, 9, 10), fechaVenta: new Date(2026, 4, 13), mesCompra: '2026-5' },
  { clienteId: 'vg', productoId: 'diosmin_h', lote: 'L009', cantidad: 2, fechaVencimiento: new Date(2026, 6, 20), fechaVenta: new Date(2026, 4, 14), mesCompra: '2026-5' },
  { clienteId: 'patty', productoId: 'urotan_d', lote: 'L010', cantidad: 1, fechaVencimiento: new Date(2026, 8, 30), fechaVenta: new Date(2026, 4, 15), mesCompra: '2026-5' }
];

// Exportar para usar en app.js
window.mockData = {
  clientes: mockClientes,
  productos: mockProductos,
  precios: mockPrecios,
  ventas: mockVentas
};
