# proto-twilio-webapp-integration

https://www.twilio.com/docs/voice/sdks/javascript


El projecte ja està adaptat per fer servir imports i bundling amb Webpack:

Ara pots utilitzar import { Device } from '@twilio/voice-sdk' a public/javascripts/app.js.
El fitxer que s'inclou a la plantilla és javascripts/bundle.js (no cal el CDN).
El bundle es genera amb `npx webpack`.
