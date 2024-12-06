class FileValidator {
    private static magicNumbers: Map<string, number[]> = new Map<string, number[]>();

    static initialize() {
        this.registerFileType('image/png', [0x89, 0x50, 0x4E, 0x47]);
        this.registerFileType('image/jpg', [0xFF, 0xD8, 0xFF, 0xD9]);
        this.registerFileType('application/pdf', [0x25, 0x50, 0x44, 0x46]);
    }

    public static registerFileType(mimeType: string, magicNumber: number[]): void {
        if (!mimeType || magicNumber.length === 0) {
            console.log('Invalid mimeType or magicNumber provided.');
            return;
        }
        this.magicNumbers.set(mimeType, magicNumber);
    }

    public static validate(file: File, allowedTypes: string[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                const buffer = reader.result as ArrayBuffer;
                const uint8Array = new Uint8Array(buffer);

                for (const type of allowedTypes) {
                    const magicNumber = this.magicNumbers.get(type);
                    if (magicNumber && this.checkMagicNumber(uint8Array, magicNumber)) {
                        return resolve(true);
                    }
                }

                reject('File formats not supported');
            };

            reader.onerror = () => {
                reject('Error reading file.');
            };

            reader.readAsArrayBuffer(file);
        });
    }

    private static checkMagicNumber(uint8Array: Uint8Array, magicNumber: number[]): boolean {
        if (magicNumber.length === 4) {
            return (
                uint8Array[0] === magicNumber[0] &&
                uint8Array[1] === magicNumber[1] &&
                uint8Array[uint8Array.length - 2] === magicNumber[2] &&
                uint8Array[uint8Array.length - 1] === magicNumber[3]
            );
        } else if (magicNumber.length > 4) {
            return magicNumber.every((byte, index) => uint8Array[index] === byte);
        }

        return false;
    }
}

FileValidator.initialize();

export default FileValidator;