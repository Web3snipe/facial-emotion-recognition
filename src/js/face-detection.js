async function loadModels() {
    console.log('Loading models...');
    try {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    await faceapi.nets.faceExpressionNet.loadFromUri('/models');        console.log('Models loaded successfully');
    } catch (error) {
        console.error('Error loading models:', error);
        alert('Error loading face detection models. Please check your internet connection and try again.');
    }
}


const detectFaces = async (image) => {
    const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
    return detections;
};

const drawDetections = (canvas, detections) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, detections);
    faceapi.draw.drawFaceLandmarks(canvas, detections);
    faceapi.draw.drawFaceExpressions(canvas, detections);
};

export { loadModels, detectFaces, drawDetections };