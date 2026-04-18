'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

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
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('rounded-md px-2 py-1 text-sm font-medium transition-colors', active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground')}
    >
      {children}
    </button>
  );
}

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
        class: cn(
          'prose prose-sm max-w-none focus:outline-none min-h-[300px] px-4 py-3',
          'prose-headings:font-bold prose-headings:tracking-tight',
          'prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg',
          'prose-p:leading-relaxed',
          'prose-ul:list-disc prose-ol:list-decimal',
          'prose-strong:font-semibold prose-em:italic',
          'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className={cn('rounded-md border bg-background', className)}>
      {editable && (
        <div className="flex flex-wrap items-center gap-1 border-b p-2">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>
            <s>S</s>
          </ToolbarButton>
          <div className="mx-1 h-6 w-px bg-border" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}>
            H1
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
            H2
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>
            H3
          </ToolbarButton>
          <div className="mx-1 h-6 w-px bg-border" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
            • List
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
            1. List
          </ToolbarButton>
          <div className="mx-1 h-6 w-px bg-border" />
          <ToolbarButton
            onClick={() => {
              const url = window.prompt('Enter URL:');
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            active={editor.isActive('link')}
          >
            Link
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} active={!editor.isActive('link')}>
            Unlink
          </ToolbarButton>
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
