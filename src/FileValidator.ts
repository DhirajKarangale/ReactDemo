export class FileValidator {

    public static checkProfile(type: string, uint8Array: Uint8Array) {
        switch (type) {
            case "image/jpg":
                return uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[uint8Array.length - 2] === 0xFF && uint8Array[uint8Array.length - 1] === 0xD9;

            case "image/png":
                return uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && uint8Array[3] === 0x47;

            case "application/pdf":
                return uint8Array[0] === 0x25 && uint8Array[1] === 0x50 && uint8Array[2] === 0x44 && uint8Array[3] === 0x46

            default:
                return false;
        }
    }

    public static validateFileContent(file: File, allowedTypes: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                const buffer = reader.result as ArrayBuffer;
                const uint8Array = new Uint8Array(buffer);
                let isValid = false;
                allowedTypes.forEach(type => { isValid = isValid || this.checkProfile(type, uint8Array); })

                if (isValid) resolve();
                else reject("File not supported.");
            };

            reader.onerror = () => { reject('Error reading file.'); };
            reader.readAsArrayBuffer(file);
        });
    }
}