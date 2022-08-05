// Imports global types
import '@twilio-labs/serverless-runtime-types';
// Fetches specific types
import { Context, ServerlessCallback, ServerlessFunctionSignature } from '@twilio-labs/serverless-runtime-types/types';

type MyEvent = {
  contact: {
    name: string;
    urn: string;
    uuid: string;
  };
  flow: {
    name: string;
    uuid: string;
  };
};

type MyContext = {
  STUDIO_FLOW_SID: string;
  FULL_URL_STEP3_FLEX_TO_TEXTIT: string;
};

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = async (context, event, callback: ServerlessCallback) => {
  console.log('event received - step1: ', event);

  const { STUDIO_FLOW_SID, FULL_URL_STEP3_FLEX_TO_TEXTIT } = context;
  const {
    contact: { name, urn, uuid },
    flow: { name: flowName },
  } = event;

  if (!STUDIO_FLOW_SID || !FULL_URL_STEP3_FLEX_TO_TEXTIT) {
    const error = 'STUDIO_FLOW_SID or FULL_URL_STEP3_FLEX_TO_TEXTIT is not set, check your environment variables in the .env file. Aborting... ';
    console.log(error);
    return callback(null, error);
  }
  const twilioClient = context.getTwilioClient();

  // Create a new conversation channel
  const { sid: channelSid } = await twilioClient.conversations.conversations.create();
  console.log('channelSid: ', channelSid);

  // Create one virtual participant. It is needed else Flex breaks.
  const promise1 = twilioClient.conversations.conversations(channelSid).participants.create({ identity: urn });

  // Webhook 1 - Once the Customer sends a message, Studio flow will be triggered
  const promise2 = twilioClient.conversations
    .conversations(channelSid)
    .webhooks.create({ target: 'studio', configuration: { method: 'POST', flowSid: STUDIO_FLOW_SID } });

  // Webhook 2 - Once the Agent sends a message, the webhook /step3-flex-to-textit will be called to send a message to Viber
  const promise3 = twilioClient.conversations.conversations(channelSid).webhooks.create({
    configuration: {
      method: 'POST',
      filters: ['onMessageAdded'],
      url: `${FULL_URL_STEP3_FLEX_TO_TEXTIT}?urn=${encodeURI(urn)}`,
    },
    target: 'webhook',
  });

  await Promise.all([promise1, promise2, promise3]);

  return callback(null, JSON.stringify({ channelSid }));
};
