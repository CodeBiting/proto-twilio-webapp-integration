# proto-twilio-webapp-integration

https://www.twilio.com/docs/voice/sdks/javascript


El projecte ja està adaptat per fer servir imports i bundling amb Webpack:

Ara pots utilitzar import { Device } from '@twilio/voice-sdk' a public/javascripts/app.js.
El fitxer que s'inclou a la plantilla és javascripts/bundle.js (no cal el CDN).
El bundle es genera amb `npx webpack`.


## Iniciar el servidor i permetre la connexió remota des de Twilio

`npm start`
Es queda escoltant pel port 3000

Engegar ngrok per accedir al servidor des de fora:
`ngrok http 3000`

Ja es pot accedir des de: `https://subdued-rachael-platycephalic.ngrok-free.dev`



Obtenir API KEYs: https://console.twilio.com/us1/account/keys-credentials/api-keys (Des de Account Dashboard)

Introducció: https://www.twilio.com/docs/voice/sdks/javascript

Tutorial: https://www.twilio.com/en-us/blog/make-receive-phone-calls-browser-twilio-programmable-voice-python-javascript


Errors de veu: https://www.twilio.com/docs/voice/sdks/error-codes