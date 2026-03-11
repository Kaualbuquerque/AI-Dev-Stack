export function createPageUrl(pageName: string) {
    return '/' + pageName
      .toLowerCase()                     // Transforma tudo em minúsculo
      .normalize('NFD')                  // Decompõe caracteres acentuados (ex: 'ã' vira 'a' + '~')
      .replace(/[\u0300-\u036f]/g, '')   // Remove os acentos que sobraram
      .trim()                            // Remove espaços inúteis no início e fim
      .replace(/\s+/g, '-')              // Substitui um ou mais espaços por um único hífen
      .replace(/[^\w-]+/g, '');          // Remove qualquer coisa que não seja letra, número ou hífen
  }