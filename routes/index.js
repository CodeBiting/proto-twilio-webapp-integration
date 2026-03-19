var express = require('express');
var router = express.Router();
const logger = require("../api/logger");
const twilio = require('twilio');
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Test Twilio', telephone: process.env.TWILIO_TEST_PHONE || '+11111111111' });
});

router.get('/token', (req, res) => {
  try {
    logger.info('Generant token per al frontend...');

    // 1. Crear l'AccessToken
    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,    // Comença per SK...
      process.env.TWILIO_API_SECRET, // El secret que et donen en crear la SK
      { 
        identity: 'usuari_web_proves', // Pots posar un ID d'usuari real aquí
        ttl: 3600 // El token durarà 1 hora
      }
    );

    // 2. Crear el Permís de Veu (Grant)
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_APP_SID, // El SID de la TwiML App (AP...)
      incomingAllow: true, // Permet rebre trucades al navegador si cal
    });

    // 3. Afegir el permís al token
    token.addGrant(voiceGrant);

    // 4. Enviar el JWT al frontend
    logger.info('Token generat correctament: ' + token.toJwt());
    res.json({
      token: token.toJwt()
    });

  } catch (error) {
    logger.error('Error generant el token:', error);
    res.status(500).send({ error: 'No s’ha pogut generar el token' });
  }
});

// --- ENDPOINT 2: Instruccions de la trucada (TwiML) ---
// Twilio cridarà aquí quan el navegador faci device.connect()
router.post('/voice', (req, res) => {
  try {
    logger.info('Rebuda de trucada per al número: ' + req.body.To);

    const VoiceResponse = twilio.twiml.VoiceResponse;
    const response = new VoiceResponse();

    // El número de telèfon arriba al camp 'To'
    const dial = response.dial({ callerId: process.env.TWILIO_PHONE_NUMBER });
    dial.number(req.body.To);

    logger.info('Generant resposta de veu per trucar al número: ' + req.body.To);
    res.type('text/xml');
    res.send(response.toString());
  } catch (error) {
    logger.error('Error generant la resposta de veu:', error);
    res.status(500).send({ error: 'No s’ha pogut generar la resposta de veu' });
  }
});

module.exports = router;
