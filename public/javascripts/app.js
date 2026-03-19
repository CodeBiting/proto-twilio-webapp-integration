
document.addEventListener('DOMContentLoaded', function() {
    let device;
    let activeCall;

    // Funció per configurar el dispositiu (es crida des del botó d'inicialitzar)
    document.getElementById('startup-button').onclick = function() {
        // Obtenim el token del servidor i configurem el dispositiu
        fetch('/token')
            .then(res => res.json())
            .then(data => {
                device = new Twilio.Device(data.token);
                device.register();

                device.on('registered', function() {
                    console.log('Dispositiu llest per trucar');
                    document.getElementById('startup-button').disabled = true;
                    // Activem tots els botons que tinguin la classe 'btn-trucada'
                    const botons = document.querySelectorAll('.btn-trucada');
                    botons.forEach(b => b.disabled = false);
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