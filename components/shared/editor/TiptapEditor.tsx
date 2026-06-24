'use client';

import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect, type ReactNode } from 'react';
import { Bold, Italic, Link2, Link2Off, List, ListOrdered, Strikethrough } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import styles from './TiptapEditor.module.css';

interface TiptapEditorProps {
  content?: object;
  onChange: (content: object) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: ReactNode;
}

function ToolbarButton({ onClick, active, disabled, label, children }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant={active ? 'default' : 'ghost'}
      size="icon-sm"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'size-8 rounded-md border border-transparent text-muted-foreground shadow-none',
        'hover:border-border hover:bg-background hover:text-foreground',
        active && 'border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
      )}
    >
      {children}
    </Button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 hidden h-6 w-px bg-border sm:block" aria-hidden="true" />;
}

type BlockStyle = 'paragraph' | 'heading-1' | 'heading-2' | 'heading-3';
type ToolbarState = {
  blockStyle: BlockStyle;
  bold: boolean;
  italic: boolean;
  strike: boolean;
  bulletList: boolean;
  orderedList: boolean;
  link: boolean;
};

function getBlockStyle(editor: NonNullable<ReturnType<typeof useEditor>>): BlockStyle {
  if (editor.isActive('heading', { level: 1 })) return 'heading-1';
  if (editor.isActive('heading', { level: 2 })) return 'heading-2';
  if (editor.isActive('heading', { level: 3 })) return 'heading-3';
  return 'paragraph';
}

const defaultToolbarState: ToolbarState = {
  blockStyle: 'paragraph',
  bold: false,
  italic: false,
  strike: false,
  bulletList: false,
  orderedList: false,
  link: false,
};

/**
 * Reusable Tiptap Editor Component
 * Use in: pages, blogs, any rich text content
 */
export function TiptapEditor({ content, onChange, placeholder = 'Start writing...', className, editable = true }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline' },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit: null }),
    ],
    content: content || { type: 'doc', content: [] },
    editable,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: {
        class: cn('tiptap focus:outline-none', styles.editorContent, editable ? styles.editable : styles.readOnly),
      },
    },
  });

  const editorState =
    useEditorState({
      editor,
      selector: ({ editor }): ToolbarState => {
        if (!editor) return defaultToolbarState;

        return {
          blockStyle: getBlockStyle(editor),
          bold: editor.isActive('bold'),
          italic: editor.isActive('italic'),
          strike: editor.isActive('strike'),
          bulletList: editor.isActive('bulletList'),
          orderedList: editor.isActive('orderedList'),
          link: editor.isActive('link'),
        };
      },
    }) ?? defaultToolbarState;

  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  const applyBlockStyle = (value: BlockStyle) => {
    const chain = editor.chain().focus();

    if (value === 'paragraph') {
      chain.setParagraph().run();
      return;
    }

    const level = Number(value.replace('heading-', '')) as 1 | 2 | 3;
    chain.setHeading({ level }).run();
  };

  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-background shadow-sm', !editable && 'border-0 bg-transparent shadow-none', className)}>
      {editable && (
        <div className="border-b border-border bg-muted/35 px-2 py-2">
          <div className="flex flex-wrap items-center gap-1">
            <select
              aria-label="Block style"
              value={editorState.blockStyle}
              onChange={(event) => applyBlockStyle(event.target.value as BlockStyle)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground outline-none transition-colors focus:border-ring focus:ring-[3px] focus:ring-ring/50"
            >
              <option value="paragraph">Paragraph</option>
              <option value="heading-1">Heading 1</option>
              <option value="heading-2">Heading 2</option>
              <option value="heading-3">Heading 3</option>
            </select>
            <ToolbarDivider />
            <ToolbarButton label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editorState.bold}>
              <Bold className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editorState.italic}>
              <Italic className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editorState.strike}>
              <Strikethrough className="size-4" />
            </ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton label="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editorState.bulletList}>
              <List className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editorState.orderedList}>
              <ListOrdered className="size-4" />
            </ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton
              label="Add link"
              onClick={() => {
                const url = window.prompt('Enter URL:');
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
              active={editorState.link}
            >
              <Link2 className="size-4" />
            </ToolbarButton>
            <ToolbarButton label="Remove link" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editorState.link}>
              <Link2Off className="size-4" />
            </ToolbarButton>
          </div>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}

/**
 * Tiptap HTML Generator (for frontend rendering)
 */
import { generateHTML } from '@tiptap/react';

export function generateTiptapHTML(content: object): string {
  return generateHTML(content, [StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }), Link.configure({ HTMLAttributes: { class: 'text-primary underline' } })]);
}
