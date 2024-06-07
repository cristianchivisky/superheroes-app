export const convertFilesToBase64 = (files: FileList): Promise<string[]> => {
    const filesArray = Array.from(files);
    return Promise.all(filesArray.map(file => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = (event.target?.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }));
};
