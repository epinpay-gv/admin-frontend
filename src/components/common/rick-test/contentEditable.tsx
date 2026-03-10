'use client';
import { useRef, useCallback } from 'react';

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

type ToolItem =
  | { type: 'command'; label: string; cmd: string; val?: string; title: string; className?: string }
  | { type: 'divider' }
  | { type: 'action'; label: string; title: string; onClick: () => void; className?: string };

const BTN_BASE = 'px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors';

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'İçerik girin...',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exec = useCallback(
    (command: string, val?: string) => {
      document.execCommand(command, false, val);
      editorRef.current?.focus();
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    },
    [onChange]
  );

  const handleInput = useCallback(() => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const promptAndExec = useCallback(
    (command: string, promptText: string) => {
      const val = prompt(promptText);
      if (val) exec(command, val);
    },
    [exec]
  );

  // Görseli base64 olarak editöre göm
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Sadece resim dosyaları
      if (!file.type.startsWith('image/')) {
        alert('Lütfen geçerli bir resim dosyası seçin.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        editorRef.current?.focus();
        document.execCommand('insertImage', false, dataUrl);
        if (onChange && editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      };
      reader.readAsDataURL(file);

      // Input'u sıfırla — aynı dosya tekrar seçilebilsin
      e.target.value = '';
    },
    [onChange]
  );

  const toolGroups: ToolItem[][] = [
    [
      { type: 'command', label: 'B', cmd: 'bold',          title: 'Kalın',       className: 'font-bold' },
      { type: 'command', label: 'I', cmd: 'italic',        title: 'İtalik',      className: 'italic' },
      { type: 'command', label: 'U', cmd: 'underline',     title: 'Altı Çizili', className: 'underline' },
      { type: 'command', label: 'S', cmd: 'strikeThrough', title: 'Üstü Çizili', className: 'line-through' },
    ],
    [
      { type: 'command', label: 'H1', cmd: 'formatBlock', val: 'H1', title: 'Başlık 1', className: 'font-mono' },
      { type: 'command', label: 'H2', cmd: 'formatBlock', val: 'H2', title: 'Başlık 2', className: 'font-mono' },
      { type: 'command', label: 'P',  cmd: 'formatBlock', val: 'P',  title: 'Paragraf', className: 'font-mono' },
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
      {
        type: 'action',
        label: '🔗',
        title: 'Link ekle',
        className: 'text-blue-600',
        onClick: () => promptAndExec('createLink', 'URL girin:'),
      },
      {
        type: 'action',
        label: '🖼️',
        title: 'Resim yükle (dosya veya URL)',
        onClick: () => fileInputRef.current?.click(),
      },
    ],
    [
      { type: 'command', label: '↩', cmd: 'undo', title: 'Geri al' },
      { type: 'command', label: '↪', cmd: 'redo', title: 'İleri al' },
    ],
  ];

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden shadow-sm">
      {/* Gizli dosya input'u */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-[#0F1117] border-b border-gray-700">
        {toolGroups.map((group, gi) => (
          <span key={gi} className="flex items-center gap-1">
            {gi > 0 && <span className="w-px self-stretch bg-gray-300 mx-1" />}
            {group.map((tool, ti) => {
              if (tool.type === 'divider') return <span key={ti} className="w-px self-stretch bg-gray-300 mx-1" />;

              if (tool.type === 'action')
                return (
                  <button
                    key={ti}
                    type="button"
                    title={tool.title}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      tool.onClick();
                    }}
                    className={`${BTN_BASE} ${tool.className ?? ''}`}
                  >
                    {tool.label}
                  </button>
                );

              return (
                <button
                  key={ti}
                  type="button"
                  title={tool.title}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    exec(tool.cmd, tool.val);
                  }}
                  className={`${BTN_BASE} ${tool.className ?? ''}`}
                >
                  {tool.label}
                </button>
              );
            })}
          </span>
        ))}
      </div>

      {/* Editör alanı — dir="ltr" imleci sola sabitler */}
      <div
        ref={editorRef}
        contentEditable
        dir="ltr"                          // ← imleç düzeltmesi
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={value ? { __html: value } : undefined}
        data-placeholder={placeholder}
        className="min-h-50 p-4 outline-none prose prose-sm max-w-none
          text-left                        
          [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded
          empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
      />
    </div>
  );
}