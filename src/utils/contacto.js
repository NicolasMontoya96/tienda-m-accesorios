// Datos de contacto del negocio, usados en varias vistas (inicio, términos
// y condiciones, política de datos, consulta de pedido). Antes cada archivo
// tenía su propia línea "import.meta.env.VITE_WHATSAPP_NUMERO || ...", y
// cada una usaba un valor de respaldo distinto si la variable de entorno no
// estaba configurada — una incluso caía a un número real hardcodeado en vez
// de un placeholder, así que si la variable faltaba, cada página mostraba
// algo distinto en vez de dejar en evidencia el mismo problema en todas.
// Centralizarlo aquí evita que vuelva a pasar.
export const whatsappNumero = import.meta.env.VITE_WHATSAPP_NUMERO || '[Número]'
export const correoContacto = import.meta.env.VITE_CORREO_CONTACTO || '[correo de contacto]'