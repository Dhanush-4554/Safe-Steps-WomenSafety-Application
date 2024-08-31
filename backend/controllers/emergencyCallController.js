const accountSid = "AC7f41acdba81736c349ab2a60622b97a4";
const authToken = "fc69f0823f5a7a4d031a48c6d9ab4440";
const client = require("twilio")(accountSid, authToken);

exports.sendAlert = async (req, res) => {
  try {
    const liveLocation = "https://hellomyfriend.com";

    const twiml = new (require('twilio').twiml.VoiceResponse)();
    twiml.say({ voice: 'alice' }, 'Hello! Your friend might be in big trouble. Please check the SMS message.');

    await client.messages.create({
      from: `+16122844698`,
      to: `+918618541131`,
      body: `Your friend is in big trouble, please check out the link: ${liveLocation}`
    });

    console.log('Message Sent');

    const call = await client.calls.create({
      twiml: twiml.toString(),
      to: `+918618541131`,
      from: "+16122844698",
    });

    console.log('Call SID:', call.sid);

    res.status(200).json({ message: 'Alert sent successfully', callSid: call.sid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send alert', error: error.message });
  }
};
