"use client";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Pilcrow,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Undo,
  Redo,
  type LucideIcon,
} from "lucide-react";
import { useRef, useCallback, useState, useEffect } from "react";
import { uploadService } from "@/features/products/services/upload.service";
import { convertToWebp } from "../file-upload/FileUpload";

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

type CommandTool = {
  type: "command";
  label: LucideIcon;
  cmd: string;
  val?: string;
  title: string;
  className?: string;
  stateKey?: string;
};

type ActionTool = {
  type: "action";
  label: LucideIcon;
  title: string;
  actionKey: "link" | "image";
  className?: string;
};

type DividerTool = { type: "divider" };
type ToolItem = CommandTool | ActionTool | DividerTool;

const BTN_BASE =
  "px-2 py-1 text-sm rounded transition-colors duration-100 select-none";
const BTN_IDLE = "hover:bg-gray-700 text-gray-200";
const BTN_ACTIVE = "bg-gray-600 text-white shadow-inner";

const TOOL_GROUPS: ToolItem[][] = [
  [
    { type: "command", label: Bold, cmd: "bold", title: "Kalın" },
    { type: "command", label: Italic, cmd: "italic", title: "İtalik" },
    {
      type: "command",
      label: Underline,
      cmd: "underline",
      title: "Altı Çizili",
    },
    {
      type: "command",
      label: Strikethrough,
      cmd: "strikeThrough",
      title: "Üstü Çizili",
    },
  ],
  [
    {
      type: "command",
      label: Heading1,
      cmd: "formatBlock",
      val: "H1",
      title: "Başlık 1",
      stateKey: "formatBlock:H1",
    },
    {
      type: "command",
      label: Heading2,
      cmd: "formatBlock",
      val: "H2",
      title: "Başlık 2",
      stateKey: "formatBlock:H2",
    },
    {
      type: "command",
      label: Pilcrow,
      cmd: "formatBlock",
      val: "P",
      title: "Paragraf",
      stateKey: "formatBlock:P",
    },
  ],
  [
    {
      type: "command",
      label: List,
      cmd: "insertUnorderedList",
      title: "Madde listesi",
    },
    {
      type: "command",
      label: ListOrdered,
      cmd: "insertOrderedList",
      title: "Numaralı liste",
    },
  ],
  [
    {
      type: "command",
      label: AlignLeft,
      cmd: "justifyLeft",
      title: "Sola hizala",
    },
    {
      type: "command",
      label: AlignCenter,
      cmd: "justifyCenter",
      title: "Ortala",
    },
    {
      type: "command",
      label: AlignRight,
      cmd: "justifyRight",
      title: "Sağa hizala",
    },
  ],
  [
    { type: "action", label: Link, title: "Link ekle", actionKey: "link" },
    { type: "action", label: Image, title: "Resim yükle", actionKey: "image" },
  ],
  [
    { type: "command", label: Undo, cmd: "undo", title: "Geri al" },
    { type: "command", label: Redo, cmd: "redo", title: "İleri al" },
  ],
];

const isCommandActive = (cmd: string): boolean => {
  try {
    return document.queryCommandState(cmd);
  } catch {
    return false;
  }
};

const currentBlockFormat = (): string => {
  try {
    return document.queryCommandValue("formatBlock").toUpperCase();
  } catch {
    return "";
  }
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "İçerik girin...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track the last value we wrote into the DOM ourselves,
  // so we can distinguish "prop changed externally" from "user is typing".
  const lastSyncedValue = useRef<string | undefined>(undefined);

  const [activeCommands, setActiveCommands] = useState<Set<string>>(new Set());

  // ── Sync incoming value → DOM ─────────────────────────────────────────────
  // Runs whenever `value` changes. Only writes to the DOM when:
  //   1. The editor is not currently focused (user isn't mid-edit), OR
  //   2. The value is meaningfully different from what we last wrote
  //      (covers async load and locale switches).
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;

    // Normalize: treat undefined/null as empty string for comparison
    const incoming = value ?? "";

    // Skip if we already have this value in the DOM (avoid cursor-jump on every keystroke)
    if (incoming === lastSyncedValue.current) return;

    // Only overwrite if the editor doesn't currently have focus
    // (i.e. not mid-edit) OR if the incoming is genuinely new external data
    // (e.g. async fetch completed, locale switched).
    const hasFocus = document.activeElement === el;
    if (!hasFocus) {
      el.innerHTML = incoming;
      lastSyncedValue.current = incoming;
    }
  }, [value]);

  // ── Active-state detection ────────────────────────────────────────────────
  const refreshActiveCommands = useCallback(() => {
    const toggled = [
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "insertUnorderedList",
      "insertOrderedList",
      "justifyLeft",
      "justifyCenter",
      "justifyRight",
    ];
    const next = new Set<string>(toggled.filter(isCommandActive));
    const block = currentBlockFormat();
    if (block) next.add(`formatBlock:${block}`);
    setActiveCommands(next);
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", refreshActiveCommands);
    return () =>
      document.removeEventListener("selectionchange", refreshActiveCommands);
  }, [refreshActiveCommands]);

  // ── Core exec ────────────────────────────────────────────────────────────
  const exec = useCallback(
    (command: string, val?: string) => {
      document.execCommand(command, false, val);
      editorRef.current?.focus();
      refreshActiveCommands();
      if (onChange && editorRef.current) {
        const html = editorRef.current.innerHTML;
        lastSyncedValue.current = html; // keep ref in sync so effect won't overwrite
        onChange(html);
      }
    },
    [onChange, refreshActiveCommands],
  );

  // ── Input handler ─────────────────────────────────────────────────────────
  const handleInput = useCallback(() => {
    refreshActiveCommands();
    if (onChange && editorRef.current) {
      const html = editorRef.current.innerHTML;
      lastSyncedValue.current = html; // keep ref in sync
      onChange(html);
    }
  }, [onChange, refreshActiveCommands]);

  // ── Action dispatcher ─────────────────────────────────────────────────────
  const handleAction = useCallback(
    (actionKey: "link" | "image") => {
      if (actionKey === "link") {
        const val = prompt("URL girin:");
        if (val) exec("createLink", val);
      } else {
        fileInputRef.current?.click();
      }
    },
    [exec],
  );

  // ── Image upload ──────────────────────────────────────────────────────────
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = "";

      if (!file.type.startsWith("image/")) {
        alert("Lütfen geçerli bir resim dosyası seçin.");
        return;
      }

      // Convert to webp first (reuse the same converter from FileUpload)
      let finalFile = file;
      if (file.type !== "image/webp") {
        try {
          finalFile = await convertToWebp(file);
        } catch {
          alert("Görsel dönüştürülemedi.");
          return;
        }
      }

      try {
        const uploaded = await uploadService.uploadImage(
          finalFile,
          "categories",
        );
        editorRef.current?.focus();
        document.execCommand("insertImage", false, uploaded.imageUrl);
        if (onChange && editorRef.current) {
          const html = editorRef.current.innerHTML;
          lastSyncedValue.current = html;
          onChange(html);
        }
      } catch {
        alert("Görsel yüklenemedi.");
      }
    },
    [onChange],
  );

  // ── Render helpers ────────────────────────────────────────────────────────
  const isActive = (tool: CommandTool) =>
    activeCommands.has(tool.stateKey ?? tool.cmd);

  const renderTool = (tool: ToolItem, index: number) => {
    if (tool.type === "divider") {
      return (
        <span key={index} className="w-px self-stretch bg-gray-600 mx-1" />
      );
    }
    if (tool.type === "action") {
      const Icon = tool.label;
      return (
        <button
          key={index}
          type="button"
          title={tool.title}
          onMouseDown={(e) => {
            e.preventDefault();
            handleAction(tool.actionKey);
          }}
          className={`${BTN_BASE} ${BTN_IDLE} ${tool.className ?? ""}`}
        >
          <Icon size={16} />
        </button>
      );
    }
    const active = isActive(tool);
    const Icon = tool.label;
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
        className={`${BTN_BASE} ${active ? BTN_ACTIVE : BTN_IDLE} ${tool.className ?? ""}`}
      >
        <Icon size={16} />
      </button>
    );
  };

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
