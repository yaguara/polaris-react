import React, {
  useState,
  useRef,
  useCallback,
  FunctionComponent,
  useMemo,
  useEffect,
} from 'react';
import debounce from 'lodash/debounce';
import {
  DragDropMajorMonotone,
  CircleAlertMajorMonotone,
} from '@shopify/polaris-icons';

import {classNames, variationName} from '../../utilities/css';
import {capitalize} from '../../utilities/capitalize';
import {Icon} from '../Icon';
import {Stack} from '../Stack';
import {Caption} from '../Caption';
import {DisplayText} from '../DisplayText';
import {VisuallyHidden} from '../VisuallyHidden';
import {Labelled, Action} from '../Labelled';
import {useI18n} from '../../utilities/i18n';
import {useEventListener} from '../../utilities/use-event-listener';
import {useUniqueId} from '../../utilities/unique-id';
import {useComponentDidMount} from '../../utilities/use-component-did-mount';
import {useForcibleToggle} from '../../utilities/use-toggle';

import {FileUpload} from './components';
import {DropZoneContext} from './context';

import {fileAccepted, getDataTransferFiles} from './utils';

import styles from './DropZone.scss';

export type Type = 'file' | 'image';

export interface DropZoneProps {
  /** Label for the file input */
  label?: string;
  /** Adds an action to the label */
  labelAction?: Action;
  /** Visually hide the label */
  labelHidden?: boolean;
  /** ID for file input */
  id?: string;
  /** Allowed file types */
  accept?: string;
  /**
   * Whether is a file or an image
   * @default 'file'
   */
  type?: Type;
  /** Sets an active state */
  active?: boolean;
  /** Sets an error state */
  error?: boolean;
  /**
   * Displays an outline border
   * @default true
   */
  outline?: boolean;
  /**
   * Displays an overlay on hover
   * @default true
   */
  overlay?: boolean;
  /** Text that appears in the overlay */
  overlayText?: string;
  /** Text that appears in the overlay when set in error state */
  errorOverlayText?: string;
  /**
   * Allows multiple files to be uploaded
   * @default true
   */
  allowMultiple?: boolean;
  /** Sets a disabled state */
  disabled?: boolean;
  /** The child elements to render in the dropzone. */
  children?: string | React.ReactNode;
  /** Allows a file to be dropped anywhere on the page */
  dropOnPage?: boolean;
  /** Sets the default file dialog state */
  openFileDialog?: boolean;
  /** Adds custom validations */
  customValidator?(file: File): boolean;
  /** Callback triggered on click */
  onClick?(event: React.MouseEvent<HTMLElement>): void;
  /** Callback triggered on any file drop */
  onDrop?(files: File[], acceptedFiles: File[], rejectedFiles: File[]): void;
  /** Callback triggered when at least one of the files dropped was accepted */
  onDropAccepted?(acceptedFiles: File[]): void;
  /** Callback triggered when at least one of the files dropped was rejected */
  onDropRejected?(rejectedFiles: File[]): void;
  /** Callback triggered when one or more files are dragging over the drag area */
  onDragOver?(): void;
  /** Callback triggered when one or more files entered the drag area */
  onDragEnter?(): void;
  /** Callback triggered when one or more files left the drag area */
  onDragLeave?(): void;
  /** Callback triggered when the file dialog is canceled */
  onFileDialogClose?(): void;
}

// TypeScript can't generate types that correctly infer the typing of
// subcomponents so explicitly state the subcomponents in the type definition.
// Letting this be implicit works in this project but fails in projects that use
// generated *.d.ts files.

export const DropZone: React.FunctionComponent<DropZoneProps> & {
  FileUpload: typeof FileUpload;
} = function DropZone({
  dropOnPage,
  label,
  labelAction,
  labelHidden,
  children,
  disabled = false,
  outline = true,
  accept,
  active,
  overlay = true,
  allowMultiple = true,
  overlayText,
  errorOverlayText,
  id: idProp,
  type = 'file',
  onClick,
  error,
  openFileDialog,
  onFileDialogClose,
  customValidator,
  onDrop,
  onDropAccepted,
  onDropRejected,
  onDragEnter,
  onDragOver,
  onDragLeave,
}: DropZoneProps) {
  const node = useRef<HTMLDivElement>(null);
  const fileInputNode = useRef<HTMLInputElement>(null);
  const dragTargets = useRef<EventTarget[]>([]);

  const adjustSize = useCallback(
    debounce(
      () => {
        if (!node.current) {
          return;
        }

        let size = 'extraLarge';
        const width = node.current.getBoundingClientRect().width;

        if (width < 100) {
          size = 'small';
        } else if (width < 160) {
          size = 'medium';
        } else if (width < 300) {
          size = 'large';
        }

        setSize(size);
        measuring && setMeasuring(false);
      },
      50,
      {trailing: true},
    ),
    [],
  );

  const [dragging, setDragging] = useState(false);
  const [internalError, setInternalError] = useState(false);
  const [
    focused,
    {forceTrue: handleFocus, forceFalse: handleBlur},
  ] = useForcibleToggle(false);
  const [numFiles, setNumFiles] = useState(0);
  const [size, setSize] = useState('extraLarge');
  const [measuring, setMeasuring] = useState(true);

  const i18n = useI18n();
  const dropNode = dropOnPage ? document : node;

  const getValidatedFiles = useCallback(
    (files: File[] | DataTransferItem[]) => {
      const acceptedFiles: File[] = [];
      const rejectedFiles: File[] = [];

      Array.from(files as File[]).forEach((file: File) => {
        !fileAccepted(file, accept) ||
        (customValidator && !customValidator(file))
          ? rejectedFiles.push(file)
          : acceptedFiles.push(file);
      });

      if (!allowMultiple) {
        acceptedFiles.splice(1, acceptedFiles.length);
        rejectedFiles.push(...acceptedFiles.slice(1));
      }

      return {files, acceptedFiles, rejectedFiles};
    },
    [accept, allowMultiple, customValidator],
  );

  const handleDrop = useCallback(
    (event: DragEvent) => {
      stopEvent(event);
      if (disabled || (!allowMultiple && numFiles > 0)) return;

      const fileList = getDataTransferFiles(event);

      const {files, acceptedFiles, rejectedFiles} = getValidatedFiles(fileList);

      dragTargets.current = [];

      setDragging(false);
      setInternalError(rejectedFiles.length > 0);
      setNumFiles((numFiles) => numFiles + acceptedFiles.length);

      onDrop && onDrop(files as File[], acceptedFiles, rejectedFiles);
      onDropAccepted && acceptedFiles.length && onDropAccepted(acceptedFiles);
      onDropRejected && rejectedFiles.length && onDropRejected(rejectedFiles);

      (event.target as HTMLInputElement).value = '';
    },
    [
      allowMultiple,
      disabled,
      getValidatedFiles,
      numFiles,
      onDrop,
      onDropAccepted,
      onDropRejected,
    ],
  );

  const handleDragEnter = useCallback(
    (event: DragEvent) => {
      stopEvent(event);
      if (disabled || (!allowMultiple && numFiles > 0)) return;

      const fileList = getDataTransferFiles(event);

      if (event.target && !dragTargets.current.includes(event.target)) {
        dragTargets.current.push(event.target);
      }

      if (dragging) return;

      const {rejectedFiles} = getValidatedFiles(fileList);

      setDragging(true);
      setInternalError(rejectedFiles.length > 0);

      onDragEnter && onDragEnter();
    },
    [
      allowMultiple,
      disabled,
      dragging,
      getValidatedFiles,
      numFiles,
      onDragEnter,
    ],
  );

  const handleDragOver = useCallback(
    (event: DragEvent) => {
      stopEvent(event);
      if (disabled || (!allowMultiple && numFiles > 0)) return;
      onDragOver && onDragOver();
    },
    [allowMultiple, disabled, numFiles, onDragOver],
  );

  const handleDragLeave = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (disabled || (!allowMultiple && numFiles > 0)) return;

      dragTargets.current = dragTargets.current.filter((el: Node) => {
        const compareNode =
          dropNode && 'current' in dropNode ? dropNode.current : document;
        return el !== event.target && compareNode && compareNode.contains(el);
      });

      if (dragTargets.current.length > 0) return;

      setDragging(false);
      setInternalError(false);

      onDragLeave && onDragLeave();
    },
    [allowMultiple, disabled, dropNode, numFiles, onDragLeave],
  );

  useEventListener(dropNode, 'drop', handleDrop);
  useEventListener(dropNode, 'dragover', handleDragOver);
  useEventListener(dropNode, 'dragenter', handleDragEnter);
  useEventListener(dropNode, 'dragleave', handleDragLeave);
  useEventListener(window, 'resize', adjustSize);

  useComponentDidMount(() => {
    adjustSize();
  });

  useEffect(() => {
    if (!openFileDialog) return;
    open();
    onFileDialogClose && onFileDialogClose();
  }, [onFileDialogClose, openFileDialog]);

  const id = useUniqueId('DropZone', idProp);
  const suffix = capitalize(type);
  const overlayTextWithDefault =
    overlayText === undefined
      ? i18n.translate(`Polaris.DropZone.overlayText${suffix}`)
      : overlayText;
  const errorOverlayTextWithDefault =
    errorOverlayText === undefined
      ? i18n.translate(`Polaris.DropZone.errorOverlayText${suffix}`)
      : errorOverlayText;
  const inputAttributes: object = {
    id,
    accept,
    disabled,
    type: 'file',
    multiple: allowMultiple,
    ref: fileInputNode,
    onChange: handleDrop,
    autoComplete: 'off',
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  const classes = classNames(
    styles.DropZone,
    outline && styles.hasOutline,
    focused && styles.focused,
    (active || dragging) && styles.isDragging,
    disabled && styles.isDisabled,
    (internalError || error) && styles.hasError,
    styles[variationName('size', size)],
    measuring && styles.measuring,
  );

  const dragOverlay =
    (active || dragging) &&
    (!internalError || !error) &&
    overlay &&
    overlayMarkup(DragDropMajorMonotone, 'indigo', overlayTextWithDefault);

  const dragErrorOverlay =
    dragging &&
    (internalError || error) &&
    overlayMarkup(CircleAlertMajorMonotone, 'red', errorOverlayTextWithDefault);

  const labelValue =
    label || i18n.translate('Polaris.DropZone.FileUpload.label');
  const labelHiddenValue = label ? labelHidden : true;

  const context = useMemo(
    () => ({
      disabled,
      focused,
      size,
      type: type || 'file',
      measuring,
    }),
    [disabled, focused, measuring, size, type],
  );

  return (
    <DropZoneContext.Provider value={context}>
      <Labelled
        id={id}
        label={labelValue}
        action={labelAction}
        labelHidden={labelHiddenValue}
      >
        <div
          ref={node}
          className={classes}
          aria-disabled={disabled}
          onClick={handleClick}
          onDragStart={stopEvent}
        >
          {dragOverlay}
          {dragErrorOverlay}
          <div className={styles.Container}>{children}</div>
          <VisuallyHidden>
            <input {...inputAttributes} />
          </VisuallyHidden>
        </div>
      </Labelled>
    </DropZoneContext.Provider>
  );

  function overlayMarkup(
    icon: FunctionComponent,
    color: 'red' | 'indigo',
    text: string,
  ) {
    return (
      <div className={styles.Overlay}>
        <Stack vertical spacing="tight">
          <Icon source={icon} color={color} />
          {size === 'extraLarge' && (
            <DisplayText size="small" element="p">
              {text}
            </DisplayText>
          )}
          {(size === 'medium' || size === 'large') && <Caption>{text}</Caption>}
        </Stack>
      </div>
    );
  }

  function open() {
    fileInputNode.current && fileInputNode.current.click();
  }

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    if (disabled || (!allowMultiple && numFiles > 0)) return;

    return onClick ? onClick(event) : open();
  }
};

function stopEvent(event: DragEvent | React.DragEvent) {
  event.preventDefault();
  event.stopPropagation();
}

DropZone.FileUpload = FileUpload;
