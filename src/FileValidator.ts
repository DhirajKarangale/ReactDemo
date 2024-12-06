export class FileValidator {
    private static readonly fileSignatures: Record<string, number[]> = {
        'image/jpg': [0xFF, 0xD8],
        'image/png': [0x89, 0x50, 0x4E, 0x47],
        'application/pdf': [0x25, 0x50, 0x44, 0x46],
    };

    public static validateFileContent(file: File, allowedTypes: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                const buffer = reader.result as ArrayBuffer;
                const uint8Array = new Uint8Array(buffer);
                const n = uint8Array.length;

                const isValid = allowedTypes.some((type) => {
                    const signature = this.fileSignatures[type];
                    if (signature) {
                        return signature.every((byte, index) => uint8Array[index] === byte);
                    }
                    return false;
                });

                if (isValid) {
                    resolve();
                } else {
                    reject('File not supported.');
                }
            };

            reader.onerror = () => { reject('Error reading file.'); };
            reader.readAsArrayBuffer(file.slice(0, 8));
        });
    }
}