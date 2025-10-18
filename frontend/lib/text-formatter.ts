// ============================================================================
// 📝 TEXT FORMATTER UTILITIES
// ============================================================================
// Utilidades para formatear texto con reglas específicas

/**
 * Formatea texto agregando tabulación a elementos de lista
 * Detecta líneas que empiecen con "-" y terminen en "." y les agrega tabulación
 * @param text - Texto a formatear
 * @returns Texto formateado con tabulación
 */
export const formatTextWithTabs = (text: string): string => {
  if (!text) return text;

  return text
    .split('\n')
    .map(line => {
      const trimmedLine = line.trim();
      // Detectar líneas que empiecen con "-" y terminen en "."
      if (trimmedLine.startsWith('-') && trimmedLine.endsWith('.')) {
        return `    ${trimmedLine}`; // Agregar 4 espacios de tabulación
      }
      return line;
    })
    .join('\n');
};

/**
 * Formatea texto para renderizado HTML con tabulación
 * Convierte saltos de línea y tabulaciones a elementos HTML
 * @param text - Texto a formatear
 * @returns Array de elementos con formato
 */
export const formatTextForHTML = (text: string): Array<{ type: 'list' | 'normal' | 'empty', content: string, key: number }> => {
  if (!text) return [];

  return text
    .split('\n')
    .map((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('-') && trimmedLine.endsWith('.')) {
        return { type: 'list' as const, content: trimmedLine, key: index };
      } else if (trimmedLine) {
        return { type: 'normal' as const, content: trimmedLine, key: index };
      } else {
        return { type: 'empty' as const, content: '', key: index };
      }
    })
    .filter(element => element !== null);
};

/**
 * Detecta si un texto contiene parámetros de lista (líneas que empiecen con "-" y terminen en ".")
 * @param text - Texto a analizar
 * @returns true si contiene parámetros de lista
 */
export const hasListParameters = (text: string): boolean => {
  if (!text) return false;
  
  return text
    .split('\n')
    .some(line => {
      const trimmedLine = line.trim();
      return trimmedLine.startsWith('-') && trimmedLine.endsWith('.');
    });
};

/**
 * Extrae solo los parámetros de lista de un texto
 * @param text - Texto del cual extraer parámetros
 * @returns Array de parámetros de lista
 */
export const extractListParameters = (text: string): string[] => {
  if (!text) return [];
  
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-') && line.endsWith('.'));
};

/**
 * Separa un texto en párrafos normales y parámetros de lista
 * @param text - Texto a separar
 * @returns Objeto con paragraphs y listItems
 */
export const separateTextAndList = (text: string): {
  paragraphs: string[];
  listItems: string[];
} => {
  if (!text) return { paragraphs: [], listItems: [] };
  
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  const paragraphs: string[] = [];
  const listItems: string[] = [];
  
  lines.forEach(line => {
    if (line.startsWith('-') && line.endsWith('.')) {
      listItems.push(line);
    } else {
      paragraphs.push(line);
    }
  });
  
  return { paragraphs, listItems };
};
