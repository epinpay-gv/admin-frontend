export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

export type CommandTool = {
  type: 'command';
  label: string;
  cmd: string;
  val?: string;
  title: string;
  className?: string;
  stateKey?: string;
};

export type ActionTool = {
  type: 'action';
  label: string;
  title: string;
  actionKey: 'link' | 'image';
  className?: string;
};

export type DividerTool = { type: 'divider' };
export type ToolItem = CommandTool | ActionTool | DividerTool;