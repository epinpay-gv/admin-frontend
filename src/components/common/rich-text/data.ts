import { ToolItem } from "./types";

export const TOOL_GROUPS: ToolItem[][] = [
  [
    { type: 'command', label: 'B',  cmd: 'bold',          title: 'Kalın',       className: 'font-bold' },
    { type: 'command', label: 'I',  cmd: 'italic',        title: 'İtalik',      className: 'italic' },
    { type: 'command', label: 'U',  cmd: 'underline',     title: 'Altı Çizili', className: 'underline' },
    { type: 'command', label: 'S',  cmd: 'strikeThrough', title: 'Üstü Çizili', className: 'line-through' },
  ],
  [
    { type: 'command', label: 'H1', cmd: 'formatBlock', val: 'H1', title: 'Başlık 1', className: 'font-mono', stateKey: 'formatBlock:H1' },
    { type: 'command', label: 'H2', cmd: 'formatBlock', val: 'H2', title: 'Başlık 2', className: 'font-mono', stateKey: 'formatBlock:H2' },
    { type: 'command', label: 'P',  cmd: 'formatBlock', val: 'P',  title: 'Paragraf', className: 'font-mono', stateKey: 'formatBlock:P'  },
  ],
  [
    { type: 'command', label: '≡',  cmd: 'insertUnorderedList', title: 'Madde listesi' },
    { type: 'command', label: '1.', cmd: 'insertOrderedList',   title: 'Numaralı liste' },
  ],
  [
    { type: 'command', label: '⬛L', cmd: 'justifyLeft',   title: 'Sola hizala' },
    { type: 'command', label: '⬛C', cmd: 'justifyCenter', title: 'Ortala' },
    { type: 'command', label: '⬛R', cmd: 'justifyRight',  title: 'Sağa hizala' },
  ],
  [
    { type: 'action', label: '🔗', title: 'Link ekle',        actionKey: 'link',  className: 'text-blue-400' },
    { type: 'action', label: '🖼️', title: 'Resim yükle (dosya)', actionKey: 'image' },
  ],
  [
    { type: 'command', label: '↩', cmd: 'undo', title: 'Geri al' },
    { type: 'command', label: '↪', cmd: 'redo', title: 'İleri al' },
  ],
];