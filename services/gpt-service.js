require('colors');
const EventEmitter = require('events');
const OpenAI = require('openai');
const tools = require('../functions/function-manifest');

const availableFunctions = {};
tools.forEach((tool) => {
  let functionName = tool.function.name;
  availableFunctions[functionName] = require(`../functions/${functionName}`);
});

class GptService extends EventEmitter {
  constructor() {
    super();
    this.openai = new OpenAI();
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);

    this.userContext = [
      { 
        'role': 'system', 
        'content': `You are an outbound front desk representative named Jesse at an orthodontic practice called Smile Orthodontics located on 580 Howard Street, San Francisco, 94105. You have a youthful and cheery personality. Keep your responses as brief as possible but make every attempt to keep the caller on the phone without being rude. Don’t ask more than one question at a time. Don’t make assumptions about what values to plug into functions, unless it is the full name. Ask for clarification if a user request is ambiguous. Speak out all prices to include the currency. Once you know what they need, ask them for the necessary details to schedule or cancel appointments. All responses must be short and conversational, no bullet points or lists. You must add a '•' symbol in your response at places which if spoken would have natural pauses where your response can be split for text to speech. Do not output any special characters like the following: *-. If you already have a full name use it as context for scheduling or canceling an appointment. The first time you get a full name, ask them to spell their last name for confirmation. Do not ask them for spelling again. After you have established the spelling of the name, if a misspelled version of that name is used, default to the spelling you have confirmed. Never call a person by their full name or last name, only by their first name. If asked about the orthodontist or the doctor running the practice, respond with a very short summary from the information below. American Board Certified Orthodontist Dr. Amanda Cheng obtained her Doctor of Medical Dentistry from the Harvard School of Dental Medicine and completed her specialty training in Orthodontics and Craniofacial Orthopedics at the University of Minnesota. In downtown San Francisco, she is one of six Certified Diplomates of the American Board of Orthodontics. Dr. Chengs exceptional skills allowed her to study under some of the worlds best orthodontists at both Harvard and the Mayo Clinic.

        Today is ${formattedDate}. If asked about availability for a given weekday or the weekday after that, calculate the number of days from today and input that into the function. Don't count today as a day.
        
        The practice is closed on weekends. If asked about a weekend date, ask them if they have time the following week.`
      },
      { 
        'role': 'assistant', 
        'content': 'Hello! Thank you for calling Smile Orthodontics. How can I help you today?'
      },
    ];



    this.partialResponseIndex = 0;
  }

  setCallSid(callSid) {
    this.userContext.push({ 'role': 'system', 'content': `callSid: ${callSid}` });
  }

  validateFunctionArgs(args) {
    try {
      return JSON.parse(args);
    } catch (error) {
      console.log('Warning: Double function arguments returned by OpenAI:', args);
      if (args.indexOf('{') != args.lastIndexOf('{')) {
        return JSON.parse(args.substring(args.indexOf(''), args.indexOf('}') + 1));
      }
    }
  }

  updateUserContext(name, role, text) {
    if (name !== 'user') {
      this.userContext.push({ 'role': role, 'name': name, 'content': text });
    } else {
      this.userContext.push({ 'role': role, 'content': text });
    }
  }

  async completion(text, interactionCount, role = 'user', name = 'user') {
    this.updateUserContext(name, role, text);

    const stream = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: this.userContext,
      tools: tools,
      stream: true,
    });

    let completeResponse = '';
    let partialResponse = '';
    let functionName = '';
    let functionArgs = '';
    let finishReason = '';

    function collectToolInformation(deltas) {
      let name = deltas.tool_calls[0]?.function?.name || '';
      if (name != '') {
        functionName = name;
      }
      let args = deltas.tool_calls[0]?.function?.arguments || '';
      if (args != '') {
        functionArgs += args;
      }
    }

    for await (const chunk of stream) {
      let content = chunk.choices[0]?.delta?.content || '';
      let deltas = chunk.choices[0].delta;
      finishReason = chunk.choices[0].finish_reason;

      if (deltas.tool_calls) {
        collectToolInformation(deltas);
      }

      if (finishReason === 'tool_calls') {
        const functionToCall = availableFunctions[functionName];
        const validatedArgs = this.validateFunctionArgs(functionArgs);

        const toolData = tools.find(tool => tool.function.name === functionName);
        const say = toolData.function.say;

        this.emit('gptreply', {
          partialResponseIndex: null,
          partialResponse: say
        }, interactionCount);

        let functionResponse = await functionToCall(validatedArgs);

        this.updateUserContext(functionName, 'function', functionResponse);

        await this.completion(functionResponse, interactionCount, 'function', functionName);
      } else {
        completeResponse += content;
        partialResponse += content;

        if (content.trim().slice(-1) === '•' || finishReason === 'stop') {
          const gptReply = { 
            partialResponseIndex: this.partialResponseIndex,
            partialResponse
          };

          this.emit('gptreply', gptReply, interactionCount);
          this.partialResponseIndex++;
          partialResponse = '';
        }
      }
    }
    this.userContext.push({'role': 'assistant', 'content': completeResponse});
    console.log(`GPT -> user context length: ${this.userContext.length}`.green);
  }
}

module.exports = { GptService };
