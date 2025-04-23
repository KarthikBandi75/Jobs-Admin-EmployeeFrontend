// src/components/QuillEditor.jsx
import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const QuillEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write something...',
      });

      quillInstance.current.on('text-change', () => {
        const html = editorRef.current.querySelector('.ql-editor')?.innerHTML || '';
        onChange(html);
      });

      // Set initial content
      quillInstance.current.root.innerHTML = value || '';
    }

    return () => {
      if (quillInstance.current) {
        quillInstance.current.off('text-change');
      }
    };
  }, []);

  useEffect(() => {
    if (quillInstance.current && value !== quillInstance.current.root.innerHTML) {
      quillInstance.current.root.innerHTML = value || '';
    }
  }, [value]);

  return <div ref={editorRef} className="bg-white mt-1" />;
};

export default QuillEditor;
