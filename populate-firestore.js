// populate-firestore.js
// Ejecutar este script UNA VEZ para llenar Firestore con datos iniciales
// Usar en la consola de Firestore o como script Node.js con Firebase Admin SDK

// Datos de 23 clientes
const clientes = [
  { id: 'patty', nombre: 'Patty González', direccion: 'Av. Principal 123', teléfono: '999123456' },
  { id: 'client-2', nombre: 'Farmacia Central', direccion: 'Calle 45 #678', teléfono: '999234567' },
  { id: 'client-3', nombre: 'Droguería El Éxito', direccion: 'Jr. Amazonas 234', teléfono: '999345678' },
  { id: 'client-4', nombre: 'Farmacia Santa María', direccion: 'Av. Brasil 456', teléfono: '999456789' },
  { id: 'client-5', nombre: 'Botica La Salud', direccion: 'Calle 12 #123', teléfono: '999567890' },
  { id: 'client-6', nombre: 'Farmacia del Centro', direccion: 'Av. Lima 789', teléfono: '999678901' },
  { id: 'client-7', nombre: 'Droguería Moderna', direccion: 'Calle 5 #234', teléfono: '999789012' },
  { id: 'client-8', nombre: 'Farmacia Popular', direccion: 'Av. Arequipa 890', teléfono: '999890123' },
  { id: 'client-9', nombre: 'Botica San Juan', direccion: 'Jr. Puno 345', teléfono: '999901234' },
  { id: 'client-10', nombre: 'Farmacia Metropolitana', direccion: 'Av. Tacna 567', teléfono: '990012345' },
  { id: 'client-11', nombre: 'Droguería Santa Rosa', direccion: 'Calle 8 #456', teléfono: '991123456' },
  { id: 'client-12', nombre: 'Farmacia Integrada', direccion: 'Av. Paseo de la República 678', teléfono: '991234567' },
  { id: 'client-13', nombre: 'Botica Global', direccion: 'Jr. Carabaya 789', teléfono: '991345678' },
  { id: 'client-14', nombre: 'Farmacia Punto Plus', direccion: 'Av. 28 de Julio 890', teléfono: '991456789' },
  { id: 'client-15', nombre: 'Droguería Unida', direccion: 'Calle 15 #567', teléfono: '991567890' },
  { id: 'client-16', nombre: 'Farmacia La Paz', direccion: 'Av. Universitaria 234', teléfono: '991678901' },
  { id: 'client-17', nombre: 'Botica Nueva Era', direccion: 'Jr. Andahuaylas 345', teléfono: '991789012' },
  { id: 'client-18', nombre: 'Farmacia Express', direccion: 'Av. Sánchez Cerro 456', teléfono: '991890123' },
  { id: 'client-19', nombre: 'Droguería Plus', direccion: 'Calle 20 #678', teléfono: '991901234' },
  { id: 'client-20', nombre: 'Farmacia Cristal', direccion: 'Av. Grau 567', teléfono: '992012345' },
  { id: 'client-21', nombre: 'Botica Salud Total', direccion: 'Jr. Ica 890', teléfono: '992123456' },
  { id: 'client-22', nombre: 'Farmacia Nueva Esperanza', direccion: 'Av. La Marina 234', teléfono: '992234567' },
  { id: 'client-23', nombre: 'Droguería Confianza', direccion: 'Calle 25 #789', teléfono: '992345678' }
];

// Datos de 104 productos
const productos = [
  { id: 'p1', nombre: 'APROXOL PLUS', presentacion: 'Jarabe 250ml', vvf: 12.50, pvf: 15.00, imagen: 'https://via.placeholder.com/200?text=APROXOL%20PLUS' },
  { id: 'p2', nombre: 'ATIDEM 200 MG', presentacion: 'Caja x 20 tab', vvf: 8.75, pvf: 11.00, imagen: 'https://via.placeholder.com/200?text=ATIDEM%20200%20MG%20CAJA' },
  { id: 'p3', nombre: 'BETAMARK 16MG', presentacion: 'Caja x 20 tab', vvf: 14.25, pvf: 18.00, imagen: 'https://via.placeholder.com/200?text=BETAMARK%2016MG%20CAJA%20X20TAB' },
  { id: 'p4', nombre: 'DEXABRON PLUS', presentacion: 'Frasco 120ml', vvf: 10.50, pvf: 13.50, imagen: 'https://www.farmaline.com.pe/media/images/productos/dexabron_plus.jpg' },
  { id: 'p5', nombre: 'DEXAMARK', presentacion: 'Caja x 10 amp', vvf: 22.00, pvf: 28.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/dexamark.jpg' },
  { id: 'p6', nombre: 'DICLOMAX', presentacion: 'Caja x 20 cap', vvf: 5.50, pvf: 7.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/diclomax.jpg' },
  { id: 'p7', nombre: 'DIOSMIN', presentacion: 'Frasco 250ml', vvf: 15.75, pvf: 20.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/diosmin.jpg' },
  { id: 'p8', nombre: 'DOLOAPROXOL', presentacion: 'Tabletas x 10', vvf: 6.25, pvf: 8.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/doloaproxol.jpg' },
  { id: 'p9', nombre: 'ERGENIL', presentacion: 'Jarabe 200ml', vvf: 9.00, pvf: 11.50, imagen: 'https://www.farmaline.com.pe/media/images/productos/ergenil.jpg' },
  { id: 'p10', nombre: 'FLOXITAN 750', presentacion: 'Caja x 10 cap', vvf: 18.50, pvf: 23.50, imagen: 'https://cdn.mifarma.com.pe/Imagenes/Presentaciones/10001300035.jpg' },
  { id: 'p11', nombre: 'GYNOVAL FEM', presentacion: 'Caja x 6 óvulos', vvf: 13.75, pvf: 17.50, imagen: 'https://cdn.mifarma.com.pe/Imagenes/Presentaciones/10001500027.jpg' },
  { id: 'p12', nombre: 'GRIPALERT JARABE', presentacion: 'Frasco 120ml', vvf: 7.50, pvf: 9.50, imagen: 'https://cdn.mifarma.com.pe/Imagenes/Presentaciones/10001600019.jpg' },
  { id: 'p13', nombre: 'ESPASMOSEDIL COMPUESTO', presentacion: 'Caja x 20 tab', vvf: 11.25, pvf: 14.50, imagen: 'https://cdn.mifarma.com.pe/Imagenes/Presentaciones/10001800025.jpg' },
  { id: 'p14', nombre: 'FLOXITAN GOTAS', presentacion: 'Frasco 15ml', vvf: 8.50, pvf: 11.00, imagen: 'https://cdn.mifarma.com.pe/Imagenes/Presentaciones/10002000031.jpg' },
  { id: 'p15', nombre: 'MEGAFISH OMEGA', presentacion: 'Caja x 30 cap', vvf: 16.75, pvf: 21.50, imagen: 'https://www.farmaline.com.pe/media/images/productos/megafish.jpg' },
  { id: 'p16', nombre: 'HEPAVIT COMPLEX', presentacion: 'Caja x 20 tab', vvf: 19.00, pvf: 24.50, imagen: 'https://cdn.mifarma.com.pe/Imagenes/Presentaciones/10002200027.jpg' },
  { id: 'p17', nombre: 'KALLOZIL FORTE', presentacion: 'Jarabe 250ml', vvf: 10.25, pvf: 13.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/kallozil.jpg' },
  { id: 'p18', nombre: 'LOPIROX TALCO', presentacion: 'Frasco 50g', vvf: 4.75, pvf: 6.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/lopirox.jpg' },
  { id: 'p19', nombre: 'MAGACID SUSPENSION', presentacion: 'Frasco 200ml', vvf: 6.50, pvf: 8.25, imagen: 'https://www.farmaline.com.pe/media/images/productos/magacid.jpg' },
  { id: 'p20', nombre: 'MIOFEDROL SPRAY', presentacion: 'Frasco 150ml', vvf: 12.00, pvf: 15.50, imagen: 'https://www.farmaline.com.pe/media/images/productos/miofedrol.jpg' },
  { id: 'p21', nombre: 'NISOLAN PLUS', presentacion: 'Caja x 20 tab', vvf: 17.50, pvf: 22.50, imagen: 'https://www.farmaline.com.pe/media/images/productos/nisolan.jpg' },
  { id: 'p22', nombre: 'MYSTOL JARABE', presentacion: 'Frasco 120ml', vvf: 8.75, pvf: 11.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/mystol.jpg' },
  { id: 'p23', nombre: 'NEUROFOR FORTE', presentacion: 'Caja x 30 cap', vvf: 21.50, pvf: 27.50, imagen: 'https://www.farmaline.com.pe/media/images/productos/neurofor.jpg' },
  { id: 'p24', nombre: 'PARAMIDOL FORTE', presentacion: 'Caja x 20 tab', vvf: 9.00, pvf: 11.50, imagen: 'https://www.farmaline.com.pe/media/images/productos/paramidol.jpg' },
  { id: 'p25', nombre: 'PENETRO GEL', presentacion: 'Tubo 100g', vvf: 7.25, pvf: 9.25, imagen: 'https://www.farmaline.com.pe/media/images/productos/penetro.jpg' },
  { id: 'p26', nombre: 'PARASITEL GOTAS', presentacion: 'Frasco 20ml', vvf: 5.50, pvf: 7.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/parasitel.jpg' },
  { id: 'p27', nombre: 'PROSTAL CAPS', presentacion: 'Caja x 20 cap', vvf: 18.75, pvf: 24.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/prostal.jpg' },
  { id: 'p28', nombre: 'TANDERIL CREMA', presentacion: 'Tubo 50g', vvf: 6.50, pvf: 8.25, imagen: 'https://www.farmaline.com.pe/media/images/productos/tanderil.jpg' },
  { id: 'p29', nombre: 'UROBAC PLUS', presentacion: 'Caja x 10 cap', vvf: 14.50, pvf: 18.50, imagen: 'https://www.farmaline.com.pe/media/images/productos/urobac.jpg' },
  { id: 'p30', nombre: 'VENUX SPRAY', presentacion: 'Frasco 125ml', vvf: 10.00, pvf: 12.75, imagen: 'https://www.farmaline.com.pe/media/images/productos/venux.jpg' },
  { id: 'p31', nombre: 'VITALIS COMPLEX', presentacion: 'Caja x 30 tab', vvf: 16.25, pvf: 20.75, imagen: 'https://www.farmaline.com.pe/media/images/productos/vitalis.jpg' },
  { id: 'p32', nombre: 'VITAGRIPP FORTE', presentacion: 'Frasco 200ml', vvf: 9.50, pvf: 12.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/vitagripp.jpg' },
  { id: 'p33', nombre: 'YODIL GOTAS', presentacion: 'Frasco 30ml', vvf: 4.00, pvf: 5.00, imagen: 'https://www.farmaline.com.pe/media/images/productos/yodil.jpg' },
  { id: 'p34', nombre: 'ZITROZIN CÁPSULAS', presentacion: 'Caja x 10 cap', vvf: 20.00, pvf: 25.50, imagen: 'https://www.farmaline.com.pe/media/images/productos/zitrozin.jpg' },
  { id: 'p35', nombre: 'FLEXEN PLUS', presentacion: 'Jarabe 120ml', vvf: 11.50, pvf: 14.75, imagen: 'https://www.farmaline.com.pe/media/images/productos/flexen.jpg' },
  { id: 'p36', nombre: 'LIMONADA ALCALINA', presentacion: 'Caja x 10 sob', vvf: 3.75, pvf: 4.75, imagen: 'https://www.farmaline.com.pe/media/images/productos/limonada.jpg' },
  { id: 'p37', nombre: 'LAXOVEN CAPSULAS', presentacion: 'Caja x 20 cap', vvf: 8.25, pvf: 10.50, imagen: 'https://www.farmaline.com.pe/media/images/productos/laxoven.jpg' },
  { id: 'p38', nombre: 'LAXOVEN POLVO', presentacion: 'Caja x 10 sob', vvf: 7.00, pvf: 8.75, imagen: 'https://www.farmaline.com.pe/media/images/productos/laxoven2.jpg' },
  { id: 'p39', nombre: 'TOSALFLEM JARABE', presentacion: 'Frasco 180ml', vvf: 9.75, pvf: 12.50, imagen: 'https://www.farmaline.com.pe/media/images/productos/tosalflem.jpg' },
  { id: 'p40', nombre: 'LIMONADA PLUS', presentacion: 'Caja x 20 sob', vvf: 4.50, pvf: 5.75, imagen: 'https://cdn.mifarma.com.pe/Imagenes/Presentaciones/10002400033.jpg' },
  { id: 'p41', nombre: 'PRODUCTO 41', presentacion: 'Presentación 41', vvf: 10.00, pvf: 12.50, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2041' },
  { id: 'p42', nombre: 'PRODUCTO 42', presentacion: 'Presentación 42', vvf: 11.00, pvf: 13.75, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2042' },
  { id: 'p43', nombre: 'PRODUCTO 43', presentacion: 'Presentación 43', vvf: 12.00, pvf: 15.00, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2043' },
  { id: 'p44', nombre: 'PRODUCTO 44', presentacion: 'Presentación 44', vvf: 13.00, pvf: 16.25, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2044' },
  { id: 'p45', nombre: 'PRODUCTO 45', presentacion: 'Presentación 45', vvf: 14.00, pvf: 17.50, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2045' },
  { id: 'p46', nombre: 'PRODUCTO 46', presentacion: 'Presentación 46', vvf: 15.00, pvf: 18.75, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2046' },
  { id: 'p47', nombre: 'PRODUCTO 47', presentacion: 'Presentación 47', vvf: 16.00, pvf: 20.00, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2047' },
  { id: 'p48', nombre: 'PRODUCTO 48', presentacion: 'Presentación 48', vvf: 17.00, pvf: 21.25, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2048' },
  { id: 'p49', nombre: 'PRODUCTO 49', presentacion: 'Presentación 49', vvf: 18.00, pvf: 22.50, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2049' },
  { id: 'p50', nombre: 'PRODUCTO 50', presentacion: 'Presentación 50', vvf: 19.00, pvf: 23.75, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2050' },
  { id: 'p51', nombre: 'PRODUCTO 51', presentacion: 'Presentación 51', vvf: 20.00, pvf: 25.00, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2051' },
  { id: 'p52', nombre: 'PRODUCTO 52', presentacion: 'Presentación 52', vvf: 10.50, pvf: 13.13, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2052' },
  { id: 'p53', nombre: 'PRODUCTO 53', presentacion: 'Presentación 53', vvf: 11.50, pvf: 14.38, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2053' },
  { id: 'p54', nombre: 'PRODUCTO 54', presentacion: 'Presentación 54', vvf: 12.50, pvf: 15.63, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2054' },
  { id: 'p55', nombre: 'PRODUCTO 55', presentacion: 'Presentación 55', vvf: 13.50, pvf: 16.88, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2055' },
  { id: 'p56', nombre: 'PRODUCTO 56', presentacion: 'Presentación 56', vvf: 14.50, pvf: 18.13, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2056' },
  { id: 'p57', nombre: 'PRODUCTO 57', presentacion: 'Presentación 57', vvf: 15.50, pvf: 19.38, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2057' },
  { id: 'p58', nombre: 'PRODUCTO 58', presentacion: 'Presentación 58', vvf: 16.50, pvf: 20.63, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2058' },
  { id: 'p59', nombre: 'PRODUCTO 59', presentacion: 'Presentación 59', vvf: 17.50, pvf: 21.88, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2059' },
  { id: 'p60', nombre: 'PRODUCTO 60', presentacion: 'Presentación 60', vvf: 18.50, pvf: 23.13, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2060' },
  { id: 'p61', nombre: 'PRODUCTO 61', presentacion: 'Presentación 61', vvf: 19.50, pvf: 24.38, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2061' },
  { id: 'p62', nombre: 'PRODUCTO 62', presentacion: 'Presentación 62', vvf: 20.50, pvf: 25.63, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2062' },
  { id: 'p63', nombre: 'PRODUCTO 63', presentacion: 'Presentación 63', vvf: 21.50, pvf: 26.88, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2063' },
  { id: 'p64', nombre: 'PRODUCTO 64', presentacion: 'Presentación 64', vvf: 22.50, pvf: 28.13, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2064' },
  { id: 'p65', nombre: 'PRODUCTO 65', presentacion: 'Presentación 65', vvf: 10.00, pvf: 12.50, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2065' },
  { id: 'p66', nombre: 'PRODUCTO 66', presentacion: 'Presentación 66', vvf: 11.00, pvf: 13.75, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2066' },
  { id: 'p67', nombre: 'PRODUCTO 67', presentacion: 'Presentación 67', vvf: 12.00, pvf: 15.00, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2067' },
  { id: 'p68', nombre: 'PRODUCTO 68', presentacion: 'Presentación 68', vvf: 13.00, pvf: 16.25, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2068' },
  { id: 'p69', nombre: 'PRODUCTO 69', presentacion: 'Presentación 69', vvf: 14.00, pvf: 17.50, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2069' },
  { id: 'p70', nombre: 'PRODUCTO 70', presentacion: 'Presentación 70', vvf: 15.00, pvf: 18.75, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2070' },
  { id: 'p71', nombre: 'PRODUCTO 71', presentacion: 'Presentación 71', vvf: 16.00, pvf: 20.00, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2071' },
  { id: 'p72', nombre: 'PRODUCTO 72', presentacion: 'Presentación 72', vvf: 17.00, pvf: 21.25, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2072' },
  { id: 'p73', nombre: 'PRODUCTO 73', presentacion: 'Presentación 73', vvf: 18.00, pvf: 22.50, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2073' },
  { id: 'p74', nombre: 'PRODUCTO 74', presentacion: 'Presentación 74', vvf: 19.00, pvf: 23.75, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2074' },
  { id: 'p75', nombre: 'PRODUCTO 75', presentacion: 'Presentación 75', vvf: 20.00, pvf: 25.00, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2075' },
  { id: 'p76', nombre: 'PRODUCTO 76', presentacion: 'Presentación 76', vvf: 10.50, pvf: 13.13, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2076' },
  { id: 'p77', nombre: 'PRODUCTO 77', presentacion: 'Presentación 77', vvf: 11.50, pvf: 14.38, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2077' },
  { id: 'p78', nombre: 'PRODUCTO 78', presentacion: 'Presentación 78', vvf: 12.50, pvf: 15.63, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2078' },
  { id: 'p79', nombre: 'PRODUCTO 79', presentacion: 'Presentación 79', vvf: 13.50, pvf: 16.88, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2079' },
  { id: 'p80', nombre: 'PRODUCTO 80', presentacion: 'Presentación 80', vvf: 14.50, pvf: 18.13, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2080' },
  { id: 'p81', nombre: 'PRODUCTO 81', presentacion: 'Presentación 81', vvf: 15.50, pvf: 19.38, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2081' },
  { id: 'p82', nombre: 'PRODUCTO 82', presentacion: 'Presentación 82', vvf: 16.50, pvf: 20.63, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2082' },
  { id: 'p83', nombre: 'PRODUCTO 83', presentacion: 'Presentación 83', vvf: 17.50, pvf: 21.88, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2083' },
  { id: 'p84', nombre: 'PRODUCTO 84', presentacion: 'Presentación 84', vvf: 18.50, pvf: 23.13, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2084' },
  { id: 'p85', nombre: 'PRODUCTO 85', presentacion: 'Presentación 85', vvf: 19.50, pvf: 24.38, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2085' },
  { id: 'p86', nombre: 'PRODUCTO 86', presentacion: 'Presentación 86', vvf: 20.50, pvf: 25.63, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2086' },
  { id: 'p87', nombre: 'PRODUCTO 87', presentacion: 'Presentación 87', vvf: 21.50, pvf: 26.88, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2087' },
  { id: 'p88', nombre: 'PRODUCTO 88', presentacion: 'Presentación 88', vvf: 22.50, pvf: 28.13, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2088' },
  { id: 'p89', nombre: 'PRODUCTO 89', presentacion: 'Presentación 89', vvf: 10.00, pvf: 12.50, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2089' },
  { id: 'p90', nombre: 'PRODUCTO 90', presentacion: 'Presentación 90', vvf: 11.00, pvf: 13.75, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2090' },
  { id: 'p91', nombre: 'PRODUCTO 91', presentacion: 'Presentación 91', vvf: 12.00, pvf: 15.00, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2091' },
  { id: 'p92', nombre: 'PRODUCTO 92', presentacion: 'Presentación 92', vvf: 13.00, pvf: 16.25, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2092' },
  { id: 'p93', nombre: 'PRODUCTO 93', presentacion: 'Presentación 93', vvf: 14.00, pvf: 17.50, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2093' },
  { id: 'p94', nombre: 'PRODUCTO 94', presentacion: 'Presentación 94', vvf: 15.00, pvf: 18.75, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2094' },
  { id: 'p95', nombre: 'PRODUCTO 95', presentacion: 'Presentación 95', vvf: 16.00, pvf: 20.00, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2095' },
  { id: 'p96', nombre: 'PRODUCTO 96', presentacion: 'Presentación 96', vvf: 17.00, pvf: 21.25, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2096' },
  { id: 'p97', nombre: 'PRODUCTO 97', presentacion: 'Presentación 97', vvf: 18.00, pvf: 22.50, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2097' },
  { id: 'p98', nombre: 'PRODUCTO 98', presentacion: 'Presentación 98', vvf: 19.00, pvf: 23.75, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2098' },
  { id: 'p99', nombre: 'PRODUCTO 99', presentacion: 'Presentación 99', vvf: 20.00, pvf: 25.00, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%2099' },
  { id: 'p100', nombre: 'PRODUCTO 100', presentacion: 'Presentación 100', vvf: 10.50, pvf: 13.13, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%20100' },
  { id: 'p101', nombre: 'PRODUCTO 101', presentacion: 'Presentación 101', vvf: 11.50, pvf: 14.38, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%20101' },
  { id: 'p102', nombre: 'PRODUCTO 102', presentacion: 'Presentación 102', vvf: 12.50, pvf: 15.63, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%20102' },
  { id: 'p103', nombre: 'PRODUCTO 103', presentacion: 'Presentación 103', vvf: 13.50, pvf: 16.88, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%20103' },
  { id: 'p104', nombre: 'PRODUCTO 104', presentacion: 'Presentación 104', vvf: 14.50, pvf: 18.13, imagen: 'https://via.placeholder.com/200?text=PRODUCTO%20104' }
];

// Generar precios: todos los clientes para todos los productos (con variaciones)
const precios = [];
clientes.forEach((client, ci) => {
  productos.forEach((prod, pi) => {
    // Precio base = vvf + margen variable (2-5%)
    const margen = 0.02 + (Math.random() * 0.03);
    const precio = prod.vvf * (1 + margen);
    precios.push({
      clienteId: client.id,
      productoId: prod.id,
      precio: Math.round(precio * 100) / 100
    });
  });
});

// Función para poblar Firestore (usar en Node.js con Firebase Admin SDK)
async function populateFirestore(db) {
  console.log('Iniciando población de Firestore...');
  
  // Agregar clientes
  console.log('Agregando clientes...');
  for (const cliente of clientes) {
    await db.collection('clientes').doc(cliente.id).set(cliente);
  }
  console.log(`✓ ${clientes.length} clientes agregados`);
  
  // Agregar productos
  console.log('Agregando productos...');
  for (const producto of productos) {
    await db.collection('productos').doc(producto.id).set(producto);
  }
  console.log(`✓ ${productos.length} productos agregados`);
  
  // Agregar precios
  console.log('Agregando precios...');
  for (const precio of precios) {
    const docId = precio.clienteId + '_' + precio.productoId;
    await db.collection('precios').doc(docId).set(precio);
  }
  console.log(`✓ ${precios.length} precios agregados`);
  
  console.log('¡Población completada!');
}

// Exportar para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { clientes, productos, precios, populateFirestore };
}
