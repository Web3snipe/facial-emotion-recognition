const axios = require('axios');
const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');

// Create the models directory if it doesn't exist
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir);
}

const modelFiles = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_expression_model-weights_manifest.json',
  'face_expression_model-shard1'
];

async function downloadFile(file) {
  const url = `https://github.com/justadudewhohacks/face-api.js/raw/master/weights/${file}`;
  const filePath = path.join(modelsDir, file);

  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`Downloaded: ${file}`);
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading ${file}: ${error.message}`);
  }
}

async function downloadAllFiles() {
  for (const file of modelFiles) {
    await downloadFile(file);
  }
  console.log('All files downloaded successfully!');
}

downloadAllFiles();