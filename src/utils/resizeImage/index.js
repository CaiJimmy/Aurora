import Compressor from 'compressorjs';

export default function resizeImage (file, width) {
    return new Promise((resolve, reject) => {
        if (!file) return;

        new Compressor(file, {
            quality: 0.6,
            maxWidth: width,
            success (result) {
                resolve(result);
            },
            error (e) {
                reject(e);
            }
        })
    })
}