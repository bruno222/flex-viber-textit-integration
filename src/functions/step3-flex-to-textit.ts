import '@twilio-labs/serverless-runtime-types';
import { ServerlessCallback, ServerlessFunctionSignature } from '@twilio-labs/serverless-runtime-types/types';
const fetch = require('node-fetch');

type MyEvent = {
  ParticipantSid?: string;
  Source: string;
  Body: string;
  urn: string;
  Author: string;
};

// If you want to use environment variables, you will need to type them like
// this and add them to the Context in the function signature as
// Context<MyContext> as you see below.
type MyContext = {
  VIBER_AUTH_TOKEN: string;
};

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = async (context, event, callback: ServerlessCallback) => {
  console.log('event received - step3: ', event);

  const { VIBER_AUTH_TOKEN } = context;
  if (!VIBER_AUTH_TOKEN) {
    const error = 'VIBER_AUTH_TOKEN is not set, check your environment variables in the .env file. Aborting... ';
    console.log(error);
    return callback(null, error);
  }

  const { ParticipantSid, Source, Body, urn, Author } = event;

  if (Source === 'API' || !ParticipantSid) {
    const msg =
      'It was the customer sending the message, therefore, aborting this webhook... We only to process when it is the Agent sending the message.';
    console.log(msg);
    return callback(null, msg);
  }

  await sendMessageToViber(VIBER_AUTH_TOKEN, urn, Body);
  return callback(null, 'ok');
};

const sendMessageToViber = async (auth_token: string, urn: string, text: string) => {
  try {
    const body = JSON.stringify({
      auth_token,
      receiver: urn.replace('viber:', '').replace(/ /gi, '+'),
      text,
      type: 'text',
    });

    // Doc: https://developers.viber.com/docs/api/rest-bot-api/#send-message
    const response = await fetch('https://chatapi.viber.com/pa/send_message', {
      body,
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
    const responseText = await response.text();
    console.log('SendMessageToViber', responseText);
  } catch (e) {
    console.error('SendMessageToViber error', e);
    throw e;
  }
};
