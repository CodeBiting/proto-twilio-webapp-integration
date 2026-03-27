

import { Device } from '@twilio/voice-sdk';

document.addEventListener('DOMContentLoaded', function() {
    let device;
    let activeCall;

    // Funció per configurar el dispositiu (es crida des del botó d'inicialitzar)
    document.getElementById('startup-button').onclick = function() {
        // Obtenim el token del servidor i configurem el dispositiu
        fetch('/token')
            .then(res => res.json())
            .then(data => {
                device = new Device(data.token, {
                    // Opcions de configuració del dispositiu
                    // Per exemple, pots configurar els tones DTMF, codecs, etc. aquí
                    // Forcem la regió d'Europa per evitar salts de connexió
                    // Nota: Les regions vàlides són ie1 (Irlanda), de1 (Alemanya) o ashburn (US East). No facis servir el paràmetre region (està obsolet), fes servir edge.
                    // Ports necessaris: El WebSocket de Twilio utilitza el port 443 (WSS).
                    // Ves a la Consola de Twilio > Voice > Settings > Geo Permissions. Assegura't que Spain i United States estan marcats. Si no ho estan, Twilio tancarà la connexió tan bon punt intentis marcar el número.
                    edge: ['ie1']
                });
                device.register();

                device.on('registered', function() {
                    console.log('Dispositiu llest per trucar');
                    document.getElementById('startup-button').disabled = true;
                    // Activem tots els botons que tinguin la classe 'btn-trucada'
                    const botons = document.querySelectorAll('.btn-trucada');
                    botons.forEach(b => b.disabled = false);
                });

                device.on('error', function(error) {
                    console.error('Error detallat de Twilio:', error.code);
                    console.error('Missatge:', error.message);
                });
            });
    };

    // Aquesta és la funció que crides des de l'onclick de l'HTML
    window.ferTrucada = async function(numero) {
        console.log('Iniciant trucada a: ' + numero);

        if (device) {
            // Passem el número a Twilio a través dels params
            activeCall = await device.connect({ params: { To: numero } });

            // Gestionem la interfície
            document.getElementById('hangup-button').disabled = false;
            const botons = document.querySelectorAll('.btn-trucada');
            botons.forEach(b => b.disabled = true);

            // Quan es pengi la trucada (per qualsevol dels dos costats)
            activeCall.on('disconnect', function() {
                console.log('Trucada penjada');
                document.getElementById('hangup-button').disabled = true;
                botons.forEach(b => b.disabled = false);
            });
        }
    }

    // Funció per penjar manualment
    window.penjarTrucada = function() {
        if (activeCall) {
            activeCall.disconnect();
        }
    }
});