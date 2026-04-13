'use client';
import { useRef, useCallback, useState, useEffect } from 'react';
import { ToolItem, RichTextEditorProps, CommandTool } from './types';
import { TOOL_GROUPS } from './data';

const BTN_BASE = 'px-2 py-1 text-sm rounded transition-colors duration-100 select-none';
const BTN_IDLE = 'hover:bg-gray-700 text-gray-200';
const BTN_ACTIVE = 'bg-gray-600 text-white shadow-inner';

const isCommandActive = (cmd: string): boolean => {
  try { return document.queryCommandState(cmd); } catch { return false; }
};

const currentBlockFormat = (): string => {
  try { return document.queryCommandValue('formatBlock').toUpperCase(); } catch { return ''; }
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'İçerik girin...',
}: RichTextEditorProps) {
  const editorRef    = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeCommands, setActiveCommands] = useState<Set<string>>(new Set());

  // ── Seed initial value ────────────────────────────────────────────────────
  // Runs once on mount; also re-syncs when value changes from undefined → string
  // (e.g. async form population) without clobbering mid-edit changes.
  const seededRef = useRef(false);
  useEffect(() => {
    if (!editorRef.current) return;
    if (!seededRef.current && value !== undefined) {
      editorRef.current.innerHTML = value;
      seededRef.current = true;
    }
  }, [value]);

  // ── Active-state detection ────────────────────────────────────────────────

  const refreshActiveCommands = useCallback(() => {
    const toggled = [
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

  // ── Core exec ────────────────────────────────────────────────────────────

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    refreshActiveCommands();
    if (onChange && editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange, refreshActiveCommands]);

  // ── Event handlers ────────────────────────────────────────────────────────

  const handleInput = useCallback(() => {
    refreshActiveCommands();
    if (onChange && editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange, refreshActiveCommands]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Lütfen geçerli bir resim dosyası seçin.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      editorRef.current?.focus();
      document.execCommand('insertImage', false, reader.result as string);
      if (onChange && editorRef.current) onChange(editorRef.current.innerHTML);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, [onChange]);

  // ── Action dispatcher (replaces inline closures in toolGroups) ───────────

  const handleAction = useCallback((actionKey: 'link' | 'image') => {
    if (actionKey === 'link') {
      const val = prompt('URL girin:');
      if (val) exec('createLink', val);
    } else {
      fileInputRef.current?.click();   // ✅ ref accessed in handler, not render
    }
  }, [exec]);

  // ── Render helpers ────────────────────────────────────────────────────────

  const isActive = (tool: CommandTool) => activeCommands.has(tool.stateKey ?? tool.cmd);

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
          onMouseDown={(e) => { e.preventDefault(); handleAction(tool.actionKey); }}
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
        onMouseDown={(e) => { e.preventDefault(); exec(tool.cmd, tool.val); }}
        className={`${BTN_BASE} ${active ? BTN_ACTIVE : BTN_IDLE} ${tool.className ?? ''}`}
      >
        {tool.label}
      </button>
    );
  };

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden shadow-sm">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      <div
        role="toolbar"
        aria-label="Metin biçimlendirme araçları"
        className="flex flex-wrap gap-1 p-2 bg-[#0F1117] border-b border-gray-700"
      >
        {TOOL_GROUPS.map((group, gi) => (
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