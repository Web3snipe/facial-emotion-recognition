const imageUpload = document.getElementById('imageUpload');
const startWebcamButton = document.getElementById('startWebcam');
const webcamElement = document.getElementById('webcam');
const uploadedImage = document.getElementById('uploadedImage');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

let isWebcamActive = false;

const loadModels = async () => {
    console.log('Loading models...');
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector_model-shard1');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68_model-shard1');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models/face_recognition_model-shard1');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models/face_expression_model-shard1');    
        
        console.log('Models loaded successfully');
    } catch (error) {
        console.error('Error loading models:', error);
        alert('Error loading face detection models. Please check the model paths and ensure the files are present.');
    }
};

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

const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        try {
            const img = await faceapi.bufferToImage(file);
            uploadedImage.src = img.src;
            uploadedImage.style.display = 'block';
            webcamElement.style.display = 'none';

            const detections = await detectFaces(img);
            canvas.width = img.width;
            canvas.height = img.height;

            drawDetections(canvas, detections);
        } catch (error) {
            console.error('Error processing uploaded image:', error);
        }
    } else {
        console.error('No file selected');
    }
};

window.addEventListener('load', async () => {
    if (typeof faceapi === 'undefined') {
        console.error('face-api.js is not loaded');
        alert('Face detection library is not loaded. Please check your internet connection and ensure the script is properly linked in the HTML.');
        return;
    }
    await loadModels();
    imageUpload.addEventListener('change', handleImageUpload);
    startWebcamButton.addEventListener('click', startWebcam);
});
