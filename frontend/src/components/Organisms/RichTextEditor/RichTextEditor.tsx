import { useEffect } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Icon } from '@iconify/react';

import styles from './RichTextEditor.module.css';

type RichTextEditorProps = {
  value: string;
  placeholder?: string;
  hasError?: boolean;
  onChange: (html: string) => void;
  onBlur?: () => void;
};

function RichTextEditor({
  value,
  placeholder = 'Opis',
  hasError = false,
  onChange,
  onBlur,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],

    content: value || '',

    editorProps: {
      attributes: {
        class: styles.editorContent,
        'aria-label': placeholder,
      },
    },

    onUpdate: ({ editor: updatedEditor }) => {
      const html = updatedEditor.isEmpty ? '' : updatedEditor.getHTML();
      onChange(html);
    },

    onBlur: () => {
      onBlur?.();
    },
  });

  const editorState = useEditorState({
    editor,

    selector: ({ editor: stateEditor }) => ({
      bold: stateEditor?.isActive('bold') ?? false,
      italic: stateEditor?.isActive('italic') ?? false,
      underline: stateEditor?.isActive('underline') ?? false,
      strike: stateEditor?.isActive('strike') ?? false,
      bulletList: stateEditor?.isActive('bulletList') ?? false,
      orderedList: stateEditor?.isActive('orderedList') ?? false,
      blockquote: stateEditor?.isActive('blockquote') ?? false,

      canUndo: stateEditor?.can().chain().focus().undo().run() ?? false,

      canRedo: stateEditor?.can().chain().focus().redo().run() ?? false,
    }),
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentValue = editor.isEmpty ? '' : editor.getHTML();
    const nextValue = value || '';

    if (currentValue !== nextValue) {
      editor.commands.setContent(nextValue, {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  const getButtonClassName = (isActive: boolean) => {
    return [styles.toolbarButton, isActive ? styles.activeToolbarButton : '']
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div
      className={[styles.editorWrapper, hasError ? styles.editorError : '']
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={styles.toolbar}
        role="toolbar"
        aria-label="Formatowanie opisu"
      >
        <button
          type="button"
          className={getButtonClassName(editorState?.bold ?? false)}
          aria-label="Pogrubienie"
          aria-pressed={editorState?.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Icon icon="material-symbols:format-bold" width="20" />
        </button>

        <button
          type="button"
          className={getButtonClassName(editorState?.italic ?? false)}
          aria-label="Kursywa"
          aria-pressed={editorState?.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Icon icon="material-symbols:format-italic" width="20" />
        </button>

        <button
          type="button"
          className={getButtonClassName(editorState?.underline ?? false)}
          aria-label="Podkreślenie"
          aria-pressed={editorState?.underline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Icon icon="material-symbols:format-underlined" width="20" />
        </button>

        <button
          type="button"
          className={getButtonClassName(editorState?.strike ?? false)}
          aria-label="Przekreślenie"
          aria-pressed={editorState?.strike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Icon icon="material-symbols:format-strikethrough" width="20" />
        </button>

        <span className={styles.toolbarSeparator} />

        <button
          type="button"
          className={getButtonClassName(editorState?.bulletList ?? false)}
          aria-label="Lista punktowana"
          aria-pressed={editorState?.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <Icon icon="material-symbols:format-list-bulleted" width="22" />
        </button>

        <button
          type="button"
          className={getButtonClassName(editorState?.orderedList ?? false)}
          aria-label="Lista numerowana"
          aria-pressed={editorState?.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <Icon icon="material-symbols:format-list-numbered" width="22" />
        </button>

        <button
          type="button"
          className={getButtonClassName(editorState?.blockquote ?? false)}
          aria-label="Cytat"
          aria-pressed={editorState?.blockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Icon icon="material-symbols:format-quote" width="20" />
        </button>

        <span className={styles.toolbarSeparator} />

        <button
          type="button"
          className={styles.toolbarButton}
          aria-label="Cofnij"
          disabled={!editorState?.canUndo}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Icon icon="material-symbols:undo" width="20" />
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          aria-label="Ponów"
          disabled={!editorState?.canRedo}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Icon icon="material-symbols:redo" width="20" />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

export default RichTextEditor;
