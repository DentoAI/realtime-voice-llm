require('dotenv').config();
require('colors');
const express = require('express');
const ExpressWs = require('express-ws');
const { performance } = require('perf_hooks');

const { GptService } = require('./services/gpt-service');
const { StreamService } = require('./services/stream-service');
const { TranscriptionService } = require('./services/transcription-service');
const { TextToSpeechService } = require('./services/tts-service');

const app = express();
ExpressWs(app);

const PORT = process.env.PORT || 3000;

function logWithTimestamp(message, color = 'white') {
  const timestamp = new Date().toISOString();
  const perfTime = performance.now().toFixed(3); // Get the time in milliseconds with precision
  console.log(`${timestamp} [${perfTime} ms] - ${message}`[color]);
}

app.post('/incoming', (req, res) => {
  res.status(200);
  res.type('text/xml');
  res.end(`
  <Response>
    <Connect>
      <Stream url="wss://${process.env.SERVER}/connection" />
    </Connect>
  </Response>
  `);
});

app.ws('/connection', (ws) => {
  ws.on('error', console.error);
  // Filled in from start message
  let streamSid;
  let callSid;

  const gptService = new GptService();
  const streamService = new StreamService(ws);
  const transcriptionService = new TranscriptionService();
  const ttsService = new TextToSpeechService({});
  
  let marks = [];
  let interactionCount = 0;

  // Incoming from MediaStream
  ws.on('message', function message(data) {
    const msg = JSON.parse(data);
    if (msg.event === 'start') {
      streamSid = msg.start.streamSid;
      callSid = msg.start.callSid;
      streamService.setStreamSid(streamSid);
      gptService.setCallSid(callSid);
      logWithTimestamp(`Twilio -> Starting Media Stream for ${streamSid}`, 'red');
      ttsService.generate({partialResponseIndex: null, partialResponse: 'Hello! Thank you for calling Smile Orthodontics. How can I assist you today?!'}, 1);
    } else if (msg.event === 'media') {
      transcriptionService.send(msg.media.payload);
    } else if (msg.event === 'mark') {
      const label = msg.mark.name;
      logWithTimestamp(`Twilio -> Audio completed mark (${msg.sequenceNumber}): ${label}`, 'red');
      marks = marks.filter(m => m !== msg.mark.name);
    } else if (msg.event === 'stop') {
      logWithTimestamp(`Twilio -> Media stream ${streamSid} ended.`, 'red');
    }
  });

  transcriptionService.on('utterance', async (text) => {
    // This is a bit of a hack to filter out empty utterances
    if (marks.length > 0 && text?.length > 5) {
      logWithTimestamp('Twilio -> Interruption, Clearing stream', 'red');
      ws.send(
        JSON.stringify({
          streamSid,
          event: 'clear',
        })
      );
    }
  });

  transcriptionService.on('transcription', async (text) => {
    if (!text) { return; }
    logWithTimestamp(`Interaction ${interactionCount} – STT -> GPT: ${text}`, 'yellow');
    gptService.completion(text, interactionCount);
    interactionCount += 1;
  });
  
  gptService.on('gptreply', async (gptReply, icount) => {
    logWithTimestamp(`Interaction ${icount}: GPT -> TTS: ${gptReply.partialResponse}`, 'green');
    ttsService.generate(gptReply, icount);
  });

  ttsService.on('speech', (responseIndex, audio, label, icount) => {
    logWithTimestamp(`Interaction ${icount}: TTS -> TWILIO: ${label}`, 'blue');

    streamService.buffer(responseIndex, audio);
  });

  streamService.on('audiosent', (markLabel) => {
    marks.push(markLabel);
  });
});

app.listen(PORT);
logWithTimestamp(`Server running on port ${PORT}`, 'white');
