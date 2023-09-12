const sdk = require("microsoft-cognitiveservices-speech-sdk");
const path = require("path");

// Create the speech synthesizer.
async function textToSpeech(text, audioFileName) {
  const audioFile = path.resolve(`./public/audio/${audioFileName}`);
  // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.SPEECH_KEY,
    process.env.SPEECH_REGION
  );
  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);
  var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  // The language of the voice that speaks.
  speechConfig.speechSynthesisVoiceName = "en-US-GuyNeural";
  synthesizer.speakTextAsync(
    text,
    function (result) {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
      } else {
        console.error(
          "Speech synthesis canceled, " +
            result.errorDetails +
            "\nDid you set the speech resource key and region values?"
        );
      }
      synthesizer.close();
      synthesizer = null;
    },
    function (err) {
      console.trace("err - " + err);
      synthesizer.close();
      synthesizer = null;
    }
  );
}

module.exports = { textToSpeech };
