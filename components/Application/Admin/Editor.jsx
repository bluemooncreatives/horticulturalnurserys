'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import {
    ClassicEditor,
    Base64UploadAdapter,
    BlockQuote,
    Bold,
    Essentials,
    Heading,
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Italic,
    Link,
    List,
    Paragraph,
    Table,
    TableToolbar,
    Underline
} from 'ckeditor5';
import '@/app/ckeditor5.css';
 
import { decodeHTMLDeep } from '@/lib/utils';


/**
 * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
 */
const LICENSE_KEY = 'GPL'; // or <YOUR_LICENSE_KEY>.

export default function Editor({ onChange, initialData }) {
    const [hasEditorError, setHasEditorError] = useState(false);

    // Descriptions are persisted HTML-entity encoded (see the product create /
    // update routes), so what arrives here has to be peeled back to real markup
    // before CKEditor can load it. `decodeHTMLDeep` also repairs legacy rows
    // that were encoded more than once.
    const decodedInitialData = useMemo(() => decodeHTMLDeep(initialData), [initialData]);

    const [fallbackValue, setFallbackValue] = useState(decodedInitialData);

    // CKEditor only reads `config.initialData` when it boots. Its React wrapper
    // hard-returns `false` from `shouldComponentUpdate`, so a later prop change
    // is silently dropped and the editor stays on whatever it mounted with.
    // The edit page mounts us before its fetch has resolved, so we have to push
    // the description in ourselves once it arrives.
    const editorRef = useRef(null);
    const appliedDataRef = useRef(decodedInitialData);

    const syncData = useCallback((editor, next) => {
        if (!editor || appliedDataRef.current === next) return;

        const current = editor.getData();
        if (current === next) {
            appliedDataRef.current = next;
            return;
        }

        // Never clobber what the admin has already typed: only adopt the
        // incoming value while the editor still holds the (empty) placeholder
        // content it booted with.
        if (current !== '' && current !== appliedDataRef.current) return;

        appliedDataRef.current = next;
        editor.data.set(next);
    }, []);

    useEffect(() => {
        syncData(editorRef.current, decodedInitialData);
    }, [decodedInitialData, syncData]);

    const handleReady = useCallback((editor) => {
        editorRef.current = editor;
        syncData(editor, decodedInitialData);
    }, [decodedInitialData, syncData]);

    // Same late-arrival problem for the plain-textarea fallback we swap in when
    // CKEditor fails to boot - its state was seeded from the first (empty) prop.
    const fallbackTouchedRef = useRef(false);
    useEffect(() => {
        if (fallbackTouchedRef.current) return;
        setFallbackValue(decodedInitialData);
    }, [decodedInitialData]);

    const { editorConfig } = useMemo(() => {
        return {
            editorConfig: {
                toolbar: {
                    items: [
                        'undo',
                        'redo',
                        '|',
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        '|',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'insertImage',
                        'insertTable',
                        'blockQuote',
                    ],
                    shouldNotGroupWhenFull: true
                },
                plugins: [
                    Base64UploadAdapter,
                    BlockQuote,
                    Bold,
                    Essentials,
                    Heading,
                    Image,
                    ImageCaption,
                    ImageResize,
                    ImageStyle,
                    ImageToolbar,
                    ImageUpload,
                    Italic,
                    Link,
                    List,
                    Paragraph,
                    Table,
                    TableToolbar,
                    Underline
                ],
                placeholder: 'Write product description...',
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: 'Paragraph',
                            class: 'ck-heading_paragraph'
                        },
                        {
                            model: 'heading1',
                            view: 'h1',
                            title: 'Heading 1',
                            class: 'ck-heading_heading1'
                        },
                        {
                            model: 'heading2',
                            view: 'h2',
                            title: 'Heading 2',
                            class: 'ck-heading_heading2'
                        },
                        {
                            model: 'heading3',
                            view: 'h3',
                            title: 'Heading 3',
                            class: 'ck-heading_heading3'
                        }
                    ]
                },
                image: {
                    toolbar: [
                        'toggleImageCaption',
                        'imageStyle:inline',
                        'imageStyle:wrapText',
                        'resizeImage'
                    ]
                },
                initialData: decodedInitialData,
                licenseKey: LICENSE_KEY,
                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                    decorators: {
                        toggleDownloadable: {
                            mode: 'manual',
                            label: 'Downloadable',
                            attributes: {
                                download: 'file'
                            }
                        }
                    }
                },
                list: {
                    properties: {
                        styles: true
                    }
                },
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                }
            }
        };
    }, [decodedInitialData]);

    if (hasEditorError) {
        return (
            <textarea
                className="min-h-[220px] w-full rounded-md border bg-background p-3 text-sm"
                placeholder="Write product description..."
                value={fallbackValue}
                onChange={(event) => {
                    fallbackTouchedRef.current = true;
                    setFallbackValue(event.target.value);
                    if (typeof onChange === 'function') {
                        onChange(event, {
                            getData: () => event.target.value,
                        });
                    }
                }}
            />
        );
    }

    return (
        <div>
            <CKEditor
                editor={ClassicEditor}
                config={editorConfig}
                onChange={onChange}
                onReady={handleReady}
                onError={() => setHasEditorError(true)}
            />
        </div>
    );
}
