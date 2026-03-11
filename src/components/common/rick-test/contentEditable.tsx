'use client';
import { useRef, useCallback, useState, useEffect } from 'react';

// ─── Types 

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

type CommandTool = {
  type: 'command';
  label: string;
  cmd: string;
  val?: string;
  title: string;
  className?: string;
  stateKey?: string;
};

type ActionTool = {
  type: 'action';
  label: string;
  title: string;
  onClick: () => void;
  className?: string;
};

type DividerTool = { type: 'divider' };

type ToolItem = CommandTool | ActionTool | DividerTool;

// ─── Constants 
const BTN_BASE =
  'px-2 py-1 text-sm rounded transition-colors duration-100 select-none';

const BTN_IDLE   = 'hover:bg-gray-700 text-gray-200';
const BTN_ACTIVE = 'bg-gray-600 text-white shadow-inner';

// ─── Helpers 

const isCommandActive = (cmd: string): boolean => {
  try {
    return document.queryCommandState(cmd);
  } catch {
    return false;
  }
};

const currentBlockFormat = (): string => {
  try {
    return document.queryCommandValue('formatBlock').toUpperCase();
  } catch {
    return '';
  }
};

// ─── Component 

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'İçerik girin...',
}: RichTextEditorProps) {
  const editorRef    = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Tracks which commands are currently active so toolbar buttons can reflect
   * the state of the caret / selection.
   */
  const [activeCommands, setActiveCommands] = useState<Set<string>>(new Set());

  // ── Active-state detection 

  const refreshActiveCommands = useCallback(() => {
    const toggled: string[] = [
      'bold', 'italic', 'underline', 'strikeThrough',
      'insertUnorderedList', 'insertOrderedList',
      'justifyLeft', 'justifyCenter', 'justifyRight',
    ];

    const next = new Set<string>(toggled.filter(isCommandActive));

    const block = currentBlockFormat();
    if (block) next.add(`formatBlock:${block}`);

    setActiveCommands(next);
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', refreshActiveCommands);
    return () => document.removeEventListener('selectionchange', refreshActiveCommands);
  }, [refreshActiveCommands]);

  // ── Core exec helper 

  const exec = useCallback(
    (command: string, val?: string) => {
      document.execCommand(command, false, val);
      editorRef.current?.focus();
      refreshActiveCommands();
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    },
    [onChange, refreshActiveCommands],
  );

  // ── Event handlers 
  const handleInput = useCallback(() => {
    refreshActiveCommands();
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange, refreshActiveCommands]);

  const promptAndExec = useCallback(
    (command: string, promptText: string) => {
      const val = prompt(promptText);
      if (val) exec(command, val);
    },
    [exec],
  );

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Lütfen geçerli bir resim dosyası seçin.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        editorRef.current?.focus();
        document.execCommand('insertImage', false, reader.result as string);
        if (onChange && editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    },
    [onChange],
  );

  // ── Toolbar definition 

  const toolGroups: ToolItem[][] = [
    [
      { type: 'command', label: 'B', cmd: 'bold',          title: 'Kalın',       className: 'font-bold' },
      { type: 'command', label: 'I', cmd: 'italic',        title: 'İtalik',      className: 'italic' },
      { type: 'command', label: 'U', cmd: 'underline',     title: 'Altı Çizili', className: 'underline' },
      { type: 'command', label: 'S', cmd: 'strikeThrough', title: 'Üstü Çizili', className: 'line-through' },
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
      {
        type: 'action',
        label: '🔗',
        title: 'Link ekle',
        className: 'text-blue-400',
        onClick: () => promptAndExec('createLink', 'URL girin:'),
      },
      {
        type: 'action',
        label: '🖼️',
        title: 'Resim yükle (dosya)',
        onClick: () => fileInputRef.current?.click(),
      },
    ],
    [
      { type: 'command', label: '↩', cmd: 'undo', title: 'Geri al' },
      { type: 'command', label: '↪', cmd: 'redo', title: 'İleri al' },
    ],
  ];

  // ── Render helpers 

  const isActive = (tool: CommandTool): boolean =>
    activeCommands.has(tool.stateKey ?? tool.cmd);

  const renderTool = (tool: ToolItem, index: number) => {
    if (tool.type === 'divider') {
      return <span key={index} className="w-px self-stretch bg-gray-600 mx-1" />;
    }

    if (tool.type === 'action') {
      return (
        <button
          key={index}
          type="button"
          title={tool.title}
          onMouseDown={(e) => {
            e.preventDefault();
            tool.onClick();
          }}
          className={`${BTN_BASE} ${BTN_IDLE} ${tool.className ?? ''}`}
        >
          {tool.label}
        </button>
      );
    }

    const active = isActive(tool);
    return (
      <button
        key={index}
        type="button"
        title={tool.title}
        aria-pressed={active}
        onMouseDown={(e) => {
          e.preventDefault();
          exec(tool.cmd, tool.val);
        }}
        className={`${BTN_BASE} ${active ? BTN_ACTIVE : BTN_IDLE} ${tool.className ?? ''}`}
      >
        {tool.label}
      </button>
    );
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden shadow-sm">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Toolbar */}
      <div
        role="toolbar"
        aria-label="Metin biçimlendirme araçları"
        className="flex flex-wrap gap-1 p-2 bg-[#0F1117] border-b border-gray-700"
      >
        {toolGroups.map((group, gi) => (
          <span key={gi} className="flex items-center gap-1">
            {gi > 0 && <span className="w-px self-stretch bg-gray-600 mx-1" />}
            {group.map((tool, ti) => renderTool(tool, ti))}
          </span>
        ))}
      </div>

      
      <div
        ref={editorRef}
        contentEditable
        dir="auto"
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="min-h-50 p-4 outline-none prose prose-sm max-w-none
          text-left
          [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded
          empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
      />
    </div>
  );
}