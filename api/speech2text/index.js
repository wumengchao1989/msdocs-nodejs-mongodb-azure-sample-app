const { containerClient } = require("../../utils/BlobService");
const path = require("path");
const savepath = path.resolve("./audioDownloaded/test004.wav");
const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");

const speechConfig = sdk.SpeechConfig.fromSubscription(
  "ac5b31c0448a4b26a2223616040fade3",
  "eastus"
);

speechConfig.speechRecognitionLanguage = "en-US";
async function downloadBlobToFile(containerClient, blobName, fileNameWithPath) {
  const blobClient = containerClient.getBlobClient(blobName);
  await blobClient.downloadToFile(fileNameWithPath);
  const audioFile = fs.readFileSync(savepath);
  let audioConfig = sdk.AudioConfig.fromWavFileInput(audioFile, "test004.wav");
  let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  speechRecognizer.recognizeOnceAsync(
    (result) => {
      console.log(result);
      speechRecognizer.close();
    },
    (err) => {
      console.log(err);
    }
  );
}

downloadBlobToFile(containerClient, "test004.wav", savepath);

module.exports = { containerClient };
