// Based on definitions by Zach Posten for React-Filepond <https://github.com/zposten>
// Updated by Hawxy <https://github.com/Hawxy>
// TypeScript Version: 3.5

export {};

type FilePondOrigin =
    | 'input' // Added by user
    | 'limbo' // Temporary server file
    | 'local' // Existing server file
    ;

export enum FileStatus {
    INIT = 1,
    IDLE = 2,
    PROCESSING_QUEUED = 9,
    PROCESSING = 3,
    PROCESSING_COMPLETE = 5,
    PROCESSING_ERROR = 6,
    PROCESSING_REVERT_ERROR = 10,
    LOADING = 7,
    LOAD_ERROR = 8
}

type ActualFileObject = Blob & {readonly lastModified: number; readonly name: string};

export class File {
    id: string;
    serverId: string;
    origin: FilePondOrigin;  
    status: FileStatus;  
    file: ActualFileObject;
    fileExtension: string;
    fileSize: number;
    fileType: string;
    filename: string;   
    filenameWithoutExtension: string; 

    /** Aborts loading of this file */
    abortLoad: () => void;
    /** Aborts processing of this file */
    abortProcessing: () => void;
    /**
     * Retrieve metadata saved to the file, pass a key to retrieve
     * a specific part of the metadata (e.g. 'crop' or 'resize').
     * If no key is passed, the entire metadata object is returned.
     */
    getMetadata: (key?: string) => any;
    /** Add additional metadata to the file */
    setMetadata: (key: string, value: any) => void;
}


interface ServerUrl {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    withCredentials?: boolean;
    headers?: {[key: string]: string|boolean|number};
    timeout?: number;

    /**
     * Called when server response is received, useful for getting
     * the unique file id from the server response
     */
    onload?: () => any;
    /**
     * Called when server error is received, receives the response
     * body, useful to select the relevant error data
     */
    onerror?: (responseBody: any) => any;
    /**
     * Called with the formdata object right before it is sent,
     * return extended formdata object to make changes
     */
    ondata?: (data: any) => any;
}


type ProgressServerConfigFunction = (
    /**
     * Flag indicating if the resource has a length that can be calculated.
     * If not, the totalDataAmount has no significant value.  Setting this to
     * false switches the FilePond loading indicator to infinite mode.
     */
    isLengthComputable: boolean,
    /** The amount of data currently transferred */
    loadedDataAmount: number,
    /** The total amount of data to be transferred */
    totalDataAmount: number,
) => void;

type ProcessServerConfigFunction = (
    /** The name of the input field */
    fieldName: string,
    /** The actual file object to send */
    file: ActualFileObject,
    metadata: {[key: string]: any},
    /**
     * Should call the load method when done and pass the returned server file id.
     * This server file id is then used later on when reverting or restoring a file
     * so that your server knows which file to return without exposing that info
     * to the client.
     */
    load: (p: string | {[key: string]: any}) => void,
    /** Can call the error method is something went wrong, should exit after */
    error: (errorText: string) => void,
    /**
     * Should call the progress method to update the progress to 100% before calling load()
     * Setting computable to false switches the loading indicator to infinite mode
     */
    progress: ProgressServerConfigFunction,
    /** Let FilePond know the request has been cancelled */
    abort: () => void
) => void;

type RevertServerConfigFunction = (
    /** Server file id of the file to restore */
    uniqueFieldId: any,
    /** Should call the load method when done */
    load: () => void,
    /** Can call the error method is something went wrong, should exit after */
    error: (errorText: string) => void,
) => void;

type RestoreServerConfigFunction = (
    uniqueFileId: any,
    /** Should call the load method with a file object or blob when done */
    load: (file: ActualFileObject) => void,
    /** Can call the error method is something went wrong, should exit after */
    error: (errorText: string) => void,
    /**
     * Should call the progress method to update the progress to 100% before calling load()
     * Setting computable to false switches the loading indicator to infinite mode
     */
    progress: ProgressServerConfigFunction,
    /** Let FilePond know the request has been cancelled */
    abort: () => void,
    /*
     * Can call the headers method to supply FilePond with early response header string
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
     */
    headers: (headersString: string) => void,
) => void;

type LoadServerConfigFunction = (
    source: any,
    /** Should call the load method with a file object or blob when done */
    load: (file: ActualFileObject) => void,
    /** Can call the error method is something went wrong, should exit after */
    error: (errorText: string) => void,
    /**
     * Should call the progress method to update the progress to 100% before calling load()
     * Setting computable to false switches the loading indicator to infinite mode
     */
    progress: ProgressServerConfigFunction,
    /** Let FilePond know the request has been cancelled */
    abort: () => void,
    /*
     * Can call the headers method to supply FilePond with early response header string
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
     */
    headers: (headersString: string) => void,
) => void;

type FetchServerConfigFunction = (
    url: string,
    /** Should call the load method with a file object or blob when done */
    load: (file: ActualFileObject) => void,
    /** Can call the error method is something went wrong, should exit after */
    error: (errorText: string) => void,
    /**
     * Should call the progress method to update the progress to 100% before calling load()
     * Setting computable to false switches the loading indicator to infinite mode
     */
    progress: ProgressServerConfigFunction,
    /** Let FilePond know the request has been cancelled */
    abort: () => void,
    /*
     * Can call the headers method to supply FilePond with early response header string
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
     */
    headers: (headersString: string) => void,
) => void;

interface FilePondServerConfigProps {
    instantUpload?: boolean;
    server?: string | {
        process?: string | ServerUrl | ProcessServerConfigFunction;
        revert?: string | ServerUrl | RevertServerConfigFunction;
        restore?: string | ServerUrl | RestoreServerConfigFunction;
        load?: string | ServerUrl | LoadServerConfigFunction;
        fetch?: string | ServerUrl | FetchServerConfigFunction;
    };
}

interface FilePondDragDropProps {
    /** FilePond will catch all files dropped on the webpage */
    dropOnPage?: boolean;
    /** Require drop on the FilePond element itself to catch the file. */
    dropOnElement?: boolean;
    /**
     * When enabled, files are validated before they are dropped.
     * A file is not added when it’s invalid.
     */
    dropValidation?: boolean;
    /**
     * Ignored file names when handling dropped directories.
     * Dropping directories is not supported on all browsers.
     */
    ignoredFiles?: string[];
}

interface FilePondLabelProps {
    /**
     * The decimal separator used to render numbers.
     * By default this is determined automatically.
     */
    labelDecimalSeparator?: string;
    /**
     * The thousands separator used to render numbers.
     * By default this is determined automatically.
     */
    labelThousandsSeparator?: string;
    /**
     * Default label shown to indicate this is a drop area.
     * FilePond will automatically bind browse file events to
     * the element with CSS class .filepond--label-action
     */
    labelIdle?: string;
    /** Label shown when the field contains invalid files and is validated by the parent form */
    labelInvalidField?: string;
    /** Label used while waiting for file size information */
    labelFileWaitingForSize?: string;
    /** Label used when no file size information was received */
    labelFileSizeNotAvailable?: string;
    /** Label used while loading a file */
    labelFileLoading?: string;
    /** Label used when file load failed */
    labelFileLoadError?: string;
    /** Label used when uploading a file */
    labelFileProcessing?: string;
    /** Label used when file upload has completed */
    labelFileProcessingComplete?: string;
    /** Label used when upload was cancelled */
    labelFileProcessingAborted?: string;
    /** Label used when something went wrong during file upload */
    labelFileProcessingError?: string;
    /** Label used when something went wrong during reverting the file upload */
    labelFileProcessingRevertError?: string;
    /** Label used when something went during during removing the file upload */
    labelFileRemoveError?: string;
    /** Label used to indicate to the user that an action can be cancelled. */
    labelTapToCancel?: string;
    /** Label used to indicate to the user that an action can be retried. */
    labelTapToRetry?: string;
    /** Label used to indicate to the user that an action can be undone. */
    labelTapToUndo?: string;
    /** Label used for remove button */
    labelButtonRemoveItem?: string;
    /** Label used for abort load button */
    labelButtonAbortItemLoad?: string;
    /** Label used for retry load button */
    labelButtonRetryItemLoad?: string;
    /** Label used for abort upload button */
    labelButtonAbortItemProcessing?: string;
    /** Label used for undo upload button */
    labelButtonUndoItemProcessing?: string;
    /** Label used for retry upload button */
    labelButtonRetryItemProcessing?: string;
    /** Label used for upload button */
    labelButtonProcessItem?: string;
}

interface FilePondSvgIconProps {
    iconRemove?: string;
    iconProcess?: string;
    iconRetry?: string;
    iconUndo?: string;
}

interface FilePondErrorDescription {
    main: string;
    sub: string;
}

/**
 * Note that in my testing, callbacks that include an error prop
 * always give the error as the second prop, with the file as
 * the first prop.    This is contradictory to the current docs.
 */
interface FilePondCallbackProps {
    /** FilePond instance has been created and is ready. */
    oninit?: () => void;
    /**
     * FilePond instance throws a warning. For instance
     * when the maximum amount of files has been reached.
     * Optionally receives file if error is related to a
     * file object
     */
    onwarning?: (error: any, file?: File, status?: any) => void;
    /**
     * FilePond instance throws an error. Optionally receives
     * file if error is related to a file object.
     */
    onerror?: (file?: File, error?: FilePondErrorDescription, status?: any) => void;
    /** Started file load */
    onaddfilestart?: (file: File) => void;
    /** Made progress loading a file */
    onaddfileprogress?: (file: File, progress: number) => void;
    /** If no error, file has been successfully loaded */
    onaddfile?: (file: File, error?: FilePondErrorDescription) => void;
    /** Started processing a file */
    onprocessfilestart?: (file: File) => void;
    /** Made progress processing a file */
    onprocessfileprogress?: (file: File, progress: number) => void;
    /** Aborted processing of a file */
    onprocessfileabort?: (file: File) => void;
    /** Processing of a file has been reverted */
    onprocessfilerevert?: (file: File) => void;
    /** If no error, Processing of a file has been completed */
    onprocessfile?: (file: File, error?: FilePondErrorDescription) => void;
    /** Called when all files in the list have been processed */
    onprocessfiles?: () => void;
    /** File has been removed. */
    onremovefile?: (file: File, error?: FilePondErrorDescription) => void;
    /**
     * File has been transformed by the transform plugin or
     * another plugin subscribing to the prepare_output filter.
     * It receives the file item and the output data.
     */
    onpreparefile?: (file: File, output: any) => void;
    /** A file has been added or removed, receives a list of file items */
    onupdatefiles?: (fileItems: File[]) => void;
    /* Called when a file is clicked or tapped **/
    onactivatefile?: (file: File) => void;
}

interface FilePondHookProps {
    beforeDropFile?: (file: File) => boolean;
    beforeAddFile?: (item: File) => boolean | Promise<boolean>;
    beforeRemoveFile?: (item: File) => boolean | Promise<boolean>;
}

interface FilePondMockFileProps {
    source: string,
    options: {
        type: FilePondOrigin,
        file?: {
            name?: string,
            size?: number,
            type?: string
        },
        metadata?: {[key: string]: any};
    }
}

interface FilePondFileProps {
    /** Array of initial files */
    files?: FilePondMockFileProps[]
}

interface FilePondBaseProps {
    id?: string;
    name?: string;
    disabled?: boolean;
    /** Class Name to put on wrapper */
    className?: string;
    /** Sets the required attribute to the output field */
    required?: boolean;
    /** Sets the given value to the capture attribute */
    captureMethod?: "camera" | "microphone" | "camcorder";

    /** Enable or disable drag n’ drop */
    allowDrop?: boolean;
    /** Enable or disable file browser */
    allowBrowse?: boolean;
    /**
     * Enable or disable pasting of files. Pasting files is not
     * supported on all browsers.
     */
    allowPaste?: boolean;
    /** Enable or disable adding multiple files */
    allowMultiple?: boolean;
    /** Allow drop to replace a file, only works when allowMultiple is false */
    allowReplace?: boolean;
    /** Allows the user to undo file upload */
    allowRevert?: boolean;
    /** Require the file to be reverted before removal */
    forceRevert?: boolean;

    /** The maximum number of files that filepond pond can handle */
    maxFiles?: number;
    /** Enables custom validity messages */
    checkValidity?: boolean;

    /** The maximum number of files that can be uploaded in parallel */
    maxParallelUploads?: number;
    acceptedFileTypes?: string[];
}

export interface FilePondProps extends
    FilePondDragDropProps,
    FilePondServerConfigProps,
    FilePondLabelProps,
    FilePondSvgIconProps,
    FilePondCallbackProps,
    FilePondHookProps,
    FilePondFileProps,
    FilePondBaseProps {}

export class FilePond {
    setOptions: (options: FilePondProps) => void;
    addFile: (source: File, options?: {index: number}) => Promise<File[]>;
    addFiles: (source: File[], options?: {index: number}) => Promise<File[]>;
    removeFile: (query?: string | number) => void;
    removeFiles: () => void;
    processFile: (query?: string | number) => Promise<File>;
    processFiles: () => Promise<File[]>;
    getFile: () => File;
    getFiles: () => File[];
    browse: () => void;
    context: () => void;
}

/** Creates a new FilePond instance */
export function create(element?: any, options?: FilePondProps): FilePond;
/** Destroys the FilePond instance attached to the supplied element */
export function destroy(element: any): void;
/** Returns the FilePond instance attached to the supplied element */
export function find(element: any): FilePond;
/**
 * Parses a given section of the DOM tree for elements with class
 * .filepond and turns them into FilePond elements.
 */
export function parse(context: any): void;
/** Registers a FilePond plugin for later use */
export function registerPlugin(...plugins: any[]): void;
/** Sets page level default options for all FilePond instances */
export function setOptions(options: FilePondProps): void;
/** Returns the current default options */
export function getOptions(): FilePondProps;
/** Determines whether or not the browser supports FilePond */
export function supported(): boolean;