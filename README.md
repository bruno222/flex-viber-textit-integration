## How to install:

1. `npm install`
2. `mv .env-example .env` - and change the env variables there. Ignore the "FULL_URL_STEP3_FLEX_TO_TEXTIT" variable for now.
3. `npm deploy`
4. Go to [Console > Functions](https://console.twilio.com/us1/develop/functions/services?frameUrl=%2Fconsole%2Ffunctions%2Foverview%2Fservices%3Fx-target-region%3Dus1) and find the service you just deployed. Copy the full URL of `/step3-flex-to-textit` and now put it on "FULL_URL_STEP3_FLEX_TO_TEXTIT" that yo had ignored before.
5. `npm deploy` again just to update `FULL_URL_STEP3_FLEX_TO_TEXTIT`
