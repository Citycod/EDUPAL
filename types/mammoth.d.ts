declare module 'mammoth' {
    export interface ExtractRawTextOptions {
        buffer: Buffer;
    }

    export interface ExtractRawTextResult {
        value: string;
        messages: any[];
    }

    export function extractRawText(input: ExtractRawTextOptions): Promise<ExtractRawTextResult>;
}
