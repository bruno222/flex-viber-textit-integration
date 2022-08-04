![viber-demo](https://user-images.githubusercontent.com/1012787/182956040-49e273e7-ddc8-42e5-8365-e8d87abd6742.gif)


# What is it:

This repo is an integration between [Textit](https://textit.com) and [Twilio Flex](https://www.twilio.com/flex), to allow customers to send messages via the digital channels Textit supports - like Viber for example - directly to an Agent using Flex.

This repo can also be used as an inspiration to be adapted to any other integration involving a custom digital channel and Twilio Flex.

We are using the newest [Flex Conversations](https://www.twilio.com/docs/flex/conversations) on this repo, not the legacy Programmable Chat.


# How to install:

## Twilio side:

1. `npm install`
2. `mv .env-example .env` - and change the env variables there. Ignore the "FULL_URL_STEP3_FLEX_TO_TEXTIT" variable for now.
3. `npm deploy`
4. Go to [Console > Functions](https://console.twilio.com/us1/develop/functions/services?frameUrl=%2Fconsole%2Ffunctions%2Foverview%2Fservices%3Fx-target-region%3Dus1) and find the service you just deployed. Copy the full URL of `/step3-flex-to-textit` and now put it on "FULL_URL_STEP3_FLEX_TO_TEXTIT" that yo had ignored before.
5. `npm deploy` again just to update `FULL_URL_STEP3_FLEX_TO_TEXTIT`

## Textit side:

1. Go to [Textit Flow](https://textit.com/flow/) and import the file `./textit-flow-example.json` there.
2. Change the both Webhooks to have your URLs you just deployed on Twilio.
3. Open Viber and send the message "bruno" and then "agent" to be forwarded to an agent.
