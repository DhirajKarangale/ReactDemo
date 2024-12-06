import JSZip from 'jszip';

export class FileValidator {

    public static check(type: string, uint8Array: Uint8Array): boolean {
        switch (type) {
            case "jpg":
                return uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[uint8Array.length - 2] === 0xFF && uint8Array[uint8Array.length - 1] === 0xD9;

            case "png":
                return uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && uint8Array[3] === 0x47;

            case "pdf":
                return uint8Array[0] === 0x25 && uint8Array[1] === 0x50 && uint8Array[2] === 0x44 && uint8Array[3] === 0x46;

            case "zip":
                return uint8Array[0] === 0x50 && uint8Array[1] === 0x4B && uint8Array[2] === 0x03 && uint8Array[3] === 0x04;

            default:
                return false;
        }
    }

    public static validate(file: File, allowedTypes: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = async () => {
                const buffer = reader.result as ArrayBuffer;
                const uint8Array = new Uint8Array(buffer);
                let isValid = false;

                if (this.check("zip", uint8Array)) {
                    try {
                        const zipValid = await this.validateZipFile(uint8Array);
                        if (zipValid) {
                            resolve();
                        } else {
                            reject("Invalid ZIP file contents.");
                        }
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    for (const type of allowedTypes) {
                        isValid = isValid || this.check(type, uint8Array);
                    }

                    if (isValid) {
                        resolve();
                    } else {
                        reject("File not supported.");
                    }
                }
            };

            reader.onerror = () => { reject('Error reading file.'); };
            reader.readAsArrayBuffer(file);
        });
    }

    private static async validateZipFile(uint8Array: Uint8Array): Promise<boolean> {
        try {
            const zip = await JSZip.loadAsync(uint8Array);

            const fileNames = Object.keys(zip.files);
            let isValid = true; // Start with true (assuming valid)

            for (const fileName of fileNames) {
                // If any file is executable, set isValid to false and break
                if (await this.isExecutableFile(fileName, zip.files[fileName])) {
                    isValid = false;
                    break;
                }
            }

            return isValid; // Return true only if no executable files were found
        } catch (error) {
            console.error("Error processing ZIP file:", error);
            throw new Error('Error processing ZIP file.');
        }
    }

    private static async isExecutableFile(fileName: string, file: JSZip.JSZipObject): Promise<boolean> {
        const fileContent = await file.async('uint8array');
        console.log("isExecutableFile: " + fileName);

        switch (true) {
            case fileName.toLowerCase().endsWith('.exe'):
            case fileName.toLowerCase().endsWith('.com'):
            case fileName.toLowerCase().endsWith('.pif'):
                return fileContent[0] === 0x4D && fileContent[1] === 0x5A;

            case fileName.toLowerCase().endsWith('.bat'):
            case fileName.toLowerCase().endsWith('.cmd'):
                const textContent = new TextDecoder().decode(fileContent);
                return textContent.includes('@echo') || textContent.includes('echo') || textContent.includes('pause');

            case fileName.toLowerCase().endsWith('.inf'):
                return fileContent[0] === 0x2E && fileContent[1] === 0x49 && fileContent[2] === 0x4E && fileContent[3] === 0x46;

            case fileName.toLowerCase().endsWith('.ipa'):
                const zip = new JSZip();
                await zip.loadAsync(fileContent);
                const filesInPayload = Object.keys(zip.files).some(file => file.startsWith('Payload/'));
                return filesInPayload;

            case fileName.toLowerCase().endsWith('.osx'):
                return fileContent[0] === 0xCF && fileContent[1] === 0x2F;

            case fileName.toLowerCase().endsWith('.run'):
                const runContent = new TextDecoder().decode(fileContent.slice(0, 10));
                return runContent.startsWith('#!') && (runContent.includes('bash') || runContent.includes('sh'));

            case fileName.toLowerCase().endsWith('.wsh'):
                const wshContent = new TextDecoder().decode(fileContent);
                return wshContent.includes('wscript') || wshContent.includes('cscript');

            default:
                return false;
        }
    }
}