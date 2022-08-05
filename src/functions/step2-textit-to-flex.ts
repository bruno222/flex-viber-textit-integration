import '@twilio-labs/serverless-runtime-types';
import { ServerlessCallback, ServerlessFunctionSignature } from '@twilio-labs/serverless-runtime-types/types';
const fetch = require('node-fetch');

type MyEvent = {
  channelSid: string;
  contact: {
    name: string;
    urn: string;
    uuid: string;
  };
  flow: {
    name: string;
    uuid: string;
  };
  results: {
    msgreceived: {
      value: string;
    };
    result: {
      value: string;
    };
  };
};

type MyContext = {};

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = async (context, event, callback: ServerlessCallback) => {
  console.log('event received - step2: ', event);

  const {
    channelSid,
    contact: { name: author, urn, uuid },
    flow: { name: flowName },
    results: {
      msgreceived: { value: msgReceivedFlowStarted },
    },
  } = event;

  const msgReceivedAfterwards = event.results.result ? event.results.result.value : undefined;
  const body = msgReceivedAfterwards || msgReceivedFlowStarted;

  const twilioClient = context.getTwilioClient();
  await twilioClient.conversations.conversations(channelSid).messages.create({ author, body, xTwilioWebhookEnabled: 'true' });

  return callback(null, 'ok');
};
