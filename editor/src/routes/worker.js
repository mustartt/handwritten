console.log('worker started');

importScripts('/js/opencv.js');

function loaded(cv) {
    postMessage('loaded');

    function base64ToImageData(base64) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                resolve(ctx.getImageData(0, 0, img.width, img.height));
            };
            img.onerror = reject;
            img.src = base64;
        });
    }

    function imageDataToCvMat(imageData) {
        let mat = new cv.Mat(imageData.height, imageData.width, cv.CV_8UC4);
        mat.data.set(imageData.data);
        return mat;
    }

    async function base64ToCvMat(base64) {
        const imageData = await base64ToImageData(base64);
        return imageDataToCvMat(imageData);
    }

    self.onmessage = function(event) {
        console.log('onmessage', event.data);

        base64ToCvMat(event.data.buffer).then((mat) => {
            console.log('OpenCV Mat:', mat);
            mat.delete();
        });
    };
}

cv.then(cv2 => loaded(cv2));
