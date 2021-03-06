'use strict'
// ----------------------- NOS MODULES -------------------------
const bodyParser = require( 'body-parser' );
const crypto = require( 'crypto' );
const express = require( 'express' );
const fetch = require( 'node-fetch' );
const request = require( 'request' );
const requestify = require( 'requestify' );
const firebase = require('firebase');
const admin = require("firebase-admin");

let Wit = null;
let log = null;
try {
  Wit = require( '../' ).Wit;
  log = require( '../' ).log;
} catch ( e ) {
  Wit = require( 'node-wit' ).Wit;
  log = require( 'node-wit' ).log;
}

// ----------------------- FIREBASE INIT -------------------------
firebase.initializeApp(
  {
    apiKey: "AIzaSyDey6AO7H_D-AVnG_y-gY1feN-PMoNcAGo",
    authDomain: "chatbotexemple-2446f.firebaseapp.com",
    databaseURL: "https://chatbotexemple-2446f.firebaseio.com",
    projectId: "chatbotexemple-2446f",
    storageBucket: "chatbotexemple-2446f.appspot.com",
    messagingSenderId: "779992289249"
  }
);

admin.initializeApp( {
  credential: admin.credential.cert( {
    "type": "service_account",
    "project_id": "chatbotexemple-2446f",
    "private_key_id": "dbff869f1b2b79dcc3e81474d1b4688ef31cb662",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDKKMSQwstVYA5L\n+52xlht81VSdcTPxiyyKaYiRxd7dHs/mwmuitnQBqSWLY2WiWBk2CYg9J1felB2d\nCSKjI5dcu7jsFRxs85nxuUDAwceH8IU5CKrGWzbsM+iAwWT0+k8AiQhzlKIz6wKc\n5YQCTNEAVP7QVl+Knioib9ndikj/YH8GL3T8GuoLev7egAx6AXQp1KGfO0Pc40PJ\nanB+NRsjb+zeg0fjc4GzfsdT4aLZRyTe4rwtzrraMjfpaqIPxlNxDLp/iF8sw+Ry\nxEdnUnxa/M7IaqYdeo8G25aa1SWZsmoL9IEdb5TEYzRN7ogYtvM738Qhr4G5jB7s\n2mnZjQgTAgMBAAECggEALx9upmHJvOZtnreRrB4V3TTrCuIi3gh3gvITpAswJnHy\nu1MRfPWzt9liR4oNXFjV05tINx0PJfJ3rq289bMrqrGVau6G2Dy2YzqwBd6FsMHX\nhBJpoGANvuRgq3apHlOki7blke+RGbILw1/atCCMzVuCpDSmA61Xm/xfl/0Og/xj\nHOtwbjS7JBTZTUvjExFC0hHRbP7njJt1lNPhnecTEvGNcp6GHuMn5cmWd+C2CNt4\naxsxb2lJSDruQBrPMKvDUGrjIrQ3tCr+dNIn1p746cwQ5qUDkekE6H9oq3BpDjcJ\n1ldUt22VrGdgYQX1GydlWr12jJAOfG/vT2/Aff0BZQKBgQD96UWiOM4gmKd6DaxZ\nfT0C3piPUWc6akko0ewj2M7rwhtKydWlgwYiydOlBgoS4P/pnjsxlKkWwsZeAp/3\ntoVnG9dJ7Thmpx2IXssSqbaYqP3Ou93I/UabuGY31w0b0tBew/siTDulFHq55YIJ\nWt27S7TqpgRZfNLFw5//dAP9HQKBgQDL0oINp9by6Q+SfNV4IoZ9sGhHT9vaiLr/\nZ2CQTQHSvjM0BXIoLjdhfpHiVxsoAwuG/O0TuauOsy5gKgXXLQ5IDa7oUiysDu0X\nlXEsFKTA87H8j1RLWexuasg8CW8Hh3yd571ktAXGeuCY5nyhce+QmejrbiKJ5szG\nVw0e3YeC7wKBgE3A8n7z0ENxG9AngcDBtj47thIlRmxAAflLF3n+uZa+kSb82bze\ne7GJhpNBXzJazmNW/h93u7Ppn19IhH4R2ZYyk2HjD+N3h3asOJmVeQIUtexp4Ufc\nL5QeCsdMxonfq8lpUG03VQh/Vfm5S3Hb7oydaWB1yF0y+URwXH2YpGQNAoGAPLIH\nQIHGpLd6h6jc+NVvL2ak5veFBOLKrNvgCZik/ljdbpRglk6M9191me1OjO+7MwuG\nneUgjXIWUVSyQI2OPy6z80LlQqd/OxKpjPLozPzE9+zGsVmp6oep8RbuFVPnbC5i\nW+awAZb94wpf+sOvD2SF0/YMGvy75iRuJ87YV8kCgYBMOZ3bTuMTlWLyZw86mRPu\n5gm1Jh0z70ahct895kvPs+QlnVOxhE/hEB+pFiLnRDEwuvX+VL5EdPiRZ4mp84hv\ncU9qYOTKnS7U2FwfWPdyJQRYKJfymaM3lD02/P97JCsgJM/OeV810NiG71LYDTly\nMQpndhlnAvJtlq09A6dMnA==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-55ees@chatbotexemple-2446f.iam.gserviceaccount.com",
    "client_id": "115962696932630590704",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-55ees%40chatbotexemple-2446f.iam.gserviceaccount.com"
  }),
  databaseURL: "https://chatbotexemple-2446f.firebaseio.com"
});

// ----------------------- API KEY openweathermap -------------------------
var api_key_weather = "9347c380589ddc78d091a9fdfce758e0";
// ----------------------- PARAMETRES DU SERVEUR -------------------------
const PORT = process.env.PORT || 5000;
// Wit.ai parameters
const WIT_TOKEN = "SRYRBBUKYFFKBZO2AG2OPTDANCG6IK7N";   // saisir ici vos informations (infos sur session XX)
// Messenger API parameters
const FB_PAGE_TOKEN = "EAAB4sGv3CHYBAMLq8Bgrj5ZABDkSr6DwIhPG8GPhpBjSZAycZBHq1fN5WxbhsNqpG3FLQHu8m9KhccQ9p22Uqu3SmhznUB2PBpB67jv58KqlOBkREZBQWvR1ZABFiwyTVYB026ZACI70tCg4jKX0o3iPWHzkLN1ukjIHamXtuAgAZDZD";   // saisir ici vos informations (infos sur session XX)
if ( !FB_PAGE_TOKEN ) {
  throw new Error( 'missing FB_PAGE_TOKEN' )
}
const FB_APP_SECRET = "c46c17501b88672ec1f5b58e2637e62d";   // saisir ici vos informations (infos sur session XX)
if ( !FB_APP_SECRET ) {
  throw new Error( 'missing FB_APP_SECRET' )
}
let FB_VERIFY_TOKEN = "vincent";   // saisir ici vos informations (infos sur session XX)
crypto.randomBytes( 8, ( err, buff ) => {
  if ( err ) throw err;
  FB_VERIFY_TOKEN = buff.toString( 'hex' );
  console.log( `/webhook will accept the Verify Token "${FB_VERIFY_TOKEN}"` );
} );
// ----------------------- FONCTION POUR VERIFIER UTILISATEUR OU CREER ----------------------------
var checkAndCreate = (fbid, prenom, nom, genre) => {
	var userz = firebase.database()
		.ref()
		.child("accounts")
		.orderByChild("fbid")
		.equalTo(fbid)
		.once("value", function(snapshot) {
				admin.auth()
					.createCustomToken(fbid)
					.then(function(customToken) {
						firebase.auth()
							.signInWithCustomToken(customToken)
							.then(function() {
								//inserer notre compte
								var user2 = firebase.auth().currentUser;
								var keyid = firebase.database()
									.ref()
									.child('accounts')
									.push();
								firebase.database()
									.ref()
									.child('accounts')
									.child(keyid.key)
									.set({
										fbid: fbid,
                    prenom : prenom,
                    nom : nom,
                    genre : genre,
										date: new Date()
											.toISOString()
									})
									.catch(function(error2) {
										console.log(error2);
									});
							})
							.catch(function(error) {
								// Handle Errors here.
								var errorCode = error.code;
								var errorMessage = error.message;
							});
					})
					.catch(function(error3) {
						console.log("Erreur : "+ error3);
					});
		});
};
// ------------------------ FONCTION DEMANDE INFORMATIONS USER -------------------------
var requestUserName = (id) => {
	var qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);
	return fetch('https://graph.facebook.com/v2.8/' + encodeURIComponent(id) + '?' + qs)
		.then(rsp => rsp.json())
		.then(json => {
			if (json.error && json.error.message) {
				throw new Error(json.error.message);
			}
			return json;
		});
};
// ------------------------- ENVOI MESSAGES SIMPLES ( Texte, images, boutons génériques, ...) -----------
var fbMessage = ( id, data ) => {
  var body = JSON.stringify( {
    recipient: {
      id
    },
    message: data,
  } );
  console.log( "BODY" + body );
  var qs = 'access_token=' + encodeURIComponent( FB_PAGE_TOKEN );
  return fetch( 'https://graph.facebook.com/me/messages?' + qs, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body,
  } ).then( rsp => rsp.json() ).then( json => {
    if ( json.error && json.error.message ) {
      console.log( json.error.message + ' ' + json.error.type + ' ' +
        json.error.code + ' ' + json.error.error_subcode + ' ' + json.error
        .fbtrace_id );
    }
    return json;
  } );
};
// ----------------------------------------------------------------------------
const sessions = {};
// ------------------------ FONCTION DE CREATION DE SESSION ---------------------------
var findOrCreateSession = (fbid) => {
	let sessionId;
	Object.keys(sessions)
		.forEach(k => {
			if (sessions[k].fbid === fbid) {
				sessionId = k;
			}
		});
	if (!sessionId) {
		sessionId = new Date()
			.toISOString();
		sessions[sessionId] = {
			fbid: fbid,
			context: {}
		};
    requestUserName(fbid)
      .then((json) => {
        sessions[sessionId].name = json.first_name;
				checkAndCreate(fbid, json.first_name,  json.last_name, json.gender);
      })
      .catch((err) => {
        console.error('Oops! Il y a une erreur : ', err.stack || err);
      });
	}
	return sessionId;
};
// ------------------------ FONCTION DE RECHERCHE D'ENTITES ---------------------------
var firstEntityValue = function( entities, entity ) {
    var val = entities && entities[ entity ] && Array.isArray( entities[ entity ] ) &&
      entities[ entity ].length > 0 && entities[ entity ][ 0 ].value
    if ( !val ) {
      return null
    }
  return typeof val === 'object' ? val.value : val
}
// ------------------------ LISTE DE TOUTES VOS ACTIONS A EFFECTUER ---------------------------

var actions = {
  // fonctions genérales à définir ici
  send( {sessionId}, response ) {
    const recipientId = sessions[ sessionId ].fbid;
    if ( recipientId ) {
      if ( response.quickreplies ) {
        response.quick_replies = [];
        for ( var i = 0, len = response.quickreplies.length; i < len; i++ ) {
          response.quick_replies.push( {
            title: response.quickreplies[ i ],
            content_type: 'text',
            payload: response.quickreplies[ i ]
          } );
        }
        delete response.quickreplies;
      }
      return fbMessage( recipientId, response )
        .then( () => null )
        .catch( ( err ) => {
          console.log( "Je send" + recipientId );
          console.error(
            'Oops! erreur ',
            recipientId, ':', err.stack || err );
        } );
    } else {
      console.error( 'Oops! utilisateur non trouvé : ', sessionId );
      return Promise.resolve()
    }
  },
  envoyer_message_text( sessionId, context, entities, text ) {
    const recipientId = sessions[ sessionId ].fbid;
    var response = {
      "text": text
    };
    return fbMessage( recipientId, response )
      .then( () => {} )
      .catch( ( err ) => {
        console.log( "Erreur envoyer_message_text" + recipientId );
      } );
  },
  envoyer_message_image( sessionId, context, entities, image_url ) {
    const recipientId = sessions[ sessionId ].fbid;
    var response = {
        "attachment":{
        "type":"image",
        "payload":{
          "url": image_url
        }
      }
    };
    return fbMessage( recipientId, response )
      .then( () => {} )
      .catch( ( err ) => {
        console.log( "Erreur envoyer_message_text" + recipientId );
      } );
  },
  envoyer_message_bouton_generique( sessionId, context, entities, elements ) {
    const recipientId = sessions[ sessionId ].fbid;
    return fbMessage( recipientId, elements )
      .then( () => {} )
      .catch( ( err ) => {
        console.log( "Erreur envoyer_message_bouton_generique" + recipientId );
      } );
  },
  envoyer_message_quickreplies( sessionId, context, entities, text, quick ) {
    const recipientId = sessions[ sessionId ].fbid;
    var response2 = {
      "text": text,
      "quick_replies": quick
    };
    return fbMessage( recipientId, response2 )
      .then( () => {} )
      .catch( ( err ) => {
        console.log( "Erreur envoyer_message_text" + recipientId );
      } );
  },
  reset_context( entities, context, sessionId ) {
    console.log( "Je vais reset le context" + JSON.stringify( context ) );
    return new Promise( function( resolve, reject ) {
      context = {};
      return resolve( context );
    } );
  },
  getUserName( sessionId, context, entities ) {
      const recipientId = sessions[ sessionId ].fbid;
      const name = sessions[ sessionId ].name || null;
      return new Promise( function( resolve, reject ) {
        if ( recipientId ) {
          if ( name ) {
              context.userName = name;
              resolve( context );
          } else {
            requestUserName( recipientId )
              .then( ( json ) => {
                sessions[ sessionId ].name = json.first_name;
                context.userName = json.first_name;     // Stockage du prénom de l'utilisateur dans le contexte
                resolve( context );
              } )
              .catch( ( err ) => {
                console.log( "ERROR = " + err );
                console.error(
                  'Oops! Erreur : ',
                  err.stack || err );
                reject( err );
              } );
          }
        } else {
          console.error( 'Oops! pas trouvé user :',
            sessionId );
          reject();
        }
      } );
    }
};

// --------------------- CHOISIR LA PROCHAINE ACTION (LOGIQUE) EN FCT DES ENTITES OU INTENTIONS------------
function choisir_prochaine_action( sessionId, context, entities ) {
  // ACTION PAR DEFAUT CAR AUCUNE ENTITE DETECTEE
  if(Object.keys(entities).length === 0 && entities.constructor === Object) {
    actions.envoyer_message_text( sessionId, context, entities, 'Je n\'ai pas compris votre phrase, désolé...');
  }
  // PAS DINTENTION DETECTEE
  if(!entities.intent) {
    if(entities.location && entities.location[0].value) {
      var ville = entities.location[0].value;
      var quick = [
        {
          "content_type":"text",
          "title":"Retour accueil",
          "payload":"RETOUR_ACCUEIL"
        },
        {
          "content_type":"text",
          "title":"Au revoir",
          "payload":"Dire_Aurevoir"
        }
      ]
      actions.envoyer_message_text( sessionId, context, entities, 'On affiche la météo de ' + ville).then(function(){
        var ville = entities.location[0].value;
        requestify.get("http://api.openweathermap.org/data/2.5/weather?APPID="+api_key_weather+"&q="+ville, {} ).then( function( response )  {
            var body = JSON.parse(response.body);
            var temperature = parseInt(body.main.temp);
            var tempC = Math.round(temperature - 273.15);   // Passer de degrés Kelvin à degrés Celsius
            actions.envoyer_message_text( sessionId, context, entities, "Il fait "+tempC+"°C aujourd'hui à "+entities.location[ 0 ].value).then(function() {
                actions.envoyer_message_quickreplies(sessionId, context, entities, "Que souhaitez-vous faire maintenant ?", quick);
            })
        })
      });
    }
  }
  // IL Y A UNE INTENTION DETECTION : DECOUVRONS LAQUELLE AVEC UN SWITCH
  else {
    switch ( entities.intent && entities.intent[ 0 ].value ) {
      case "Dire_Bonjour":
        var msg = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [
                 {
                  "title": "à Arcachon",
                  "image_url": "https://mon-chatbot.com/img/arcachon.jpg",
                  "subtitle": "Appuyez ici pour connaitre la météo d'Arcachon",
                  "buttons": [
                    {
                      "type": "postback",
                      "payload": "Arcachon",
                      "title": "Découvrir"
                  }]
                },
                {
                 "title": "à Bordeaux",
                 "image_url": "https://mon-chatbot.com/img/bordeaux.jpg",
                 "subtitle": "Appuyez ici pour connaitre la météo de Bordeaux",
                 "buttons": [
                   {
                     "type": "postback",
                     "payload": "Bordeaux",
                     "title": "Découvrir"
                 }]
               },
               {
                "title": "à Strasbourg",
                "image_url": "https://mon-chatbot.com/img/strasbourg.jpg",
                "subtitle": "Appuyez ici pour connaitre la météo de Strasbourg",
                "buttons": [
                  {
                    "type": "postback",
                    "payload": "Strasbourg",
                    "title": "Découvrir"
                }]
              },
              {
               "title": "à Toulouse",
               "image_url": "https://mon-chatbot.com/img/toulouse.jpg",
               "subtitle": "Appuyez ici pour connaitre la météo de Toulouse",
               "buttons": [
                 {
                   "type": "postback",
                   "payload": "Toulouse",
                   "title": "Découvrir"
               }]
             },
             {
              "title": "à Lyon",
              "image_url": "https://mon-chatbot.com/img/lyon.jpg",
              "subtitle": "Appuyez ici pour connaitre la météo de Lyon",
              "buttons": [
                {
                  "type": "postback",
                  "payload": "Lyon",
                  "title": "Découvrir"
              }]
            },
               {
                "title": "en France",
                "image_url": "https://mon-chatbot.com/img/france.jpg",
                "subtitle": "Voir la météo pour toute la France",
                "buttons": [
                  {
                   "type":"web_url",
                   "url":"http://www.meteofrance.com/accueil",
                   "title":"Découvrir"
                 }]
              }
            ]
            }
          }
        };
        actions.reset_context( entities, context, sessionId ).then(function() {
          actions.getUserName( sessionId, context, entities ).then( function() {
            actions.envoyer_message_text( sessionId, context, entities, 'Bonjour '+context.userName+' et bienvenue sur votre assistant météo. Dans quelle ville souhaitez-vous connaitre la météo ?').then(function() {
              actions.envoyer_message_bouton_generique(sessionId, context, entities, msg);
            })
          })
        })
        break;
      case "Connaitre_météo":
        if (entities.location && entities.location[0].value) {
          //Une ville est detectée mais pas reconnue
          //actions.envoyer_message_text( sessionId, context, entities, 'On affiche la météo de ' + ville);
          var ville = entities.location[0].value;
          requestify.get("http://api.openweathermap.org/data/2.5/weather?APPID="+api_key_weather+"&q="+ville, {} ).then( function( response )  {
              var body = JSON.parse(response.body);
              var temperature = parseInt(body.main.temp);
              var tempC = Math.round(temperature - 273.15);   // Passer de degrés Kelvin à degrés Celsius
              actions.envoyer_message_text( sessionId, context, entities, "Il fait "+tempC+"°C aujourd'hui à "+entities.location[ 0 ].value).then(function() {
                  actions.envoyer_message_quickreplies(sessionId, context, entities, "Que souhaitez-vous faire maintenant ?", quick);
              })
          })
          var quick = [
            {
              "content_type":"text",
              "title":"Retour accueil",
              "payload":"RETOUR_ACCUEIL"
            },
            {
              "content_type":"text",
              "title":"Au revoir",
              "payload":"Dire_Aurevoir"
            }
          ]
          actions.envoyer_message_text( sessionId, context, entities, 'On affiche la météo de ' + ville).then(function(){
            actions.envoyer_message_quickreplies(sessionId, context, entities, "Que souhaitez-vous faire maintenant ?", quick);
          });
        } else {
          actions.envoyer_message_text( sessionId, context, entities, 'La ville n\'est pas reconnue...');
          actions.reset_context( entities, context, sessionId ).then(function(){
            actions.envoyer_message_text( sessionId, context, entities, 'Dans quelle ville dois-je chercher la météo ?')
          });
        }
        break;
      case "RETOUR_ACCUEIL":
        var msg = {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": [
                 {
                  "title": "à Arcachon",
                  "image_url": "https://mon-chatbot.com/img/arcachon.jpg",
                  "subtitle": "Appuyez ici pour connaitre la météo d'Arcachon",
                  "buttons": [
                    {
                      "type": "postback",
                      "payload": "Arcachon",
                      "title": "Découvrir"
                  }]
                },
                {
                 "title": "à Bordeaux",
                 "image_url": "https://mon-chatbot.com/img/bordeaux.jpg",
                 "subtitle": "Appuyez ici pour connaitre la météo de Bordeaux",
                 "buttons": [
                   {
                     "type": "postback",
                     "payload": "Bordeaux",
                     "title": "Découvrir"
                 }]
               },
               {
                "title": "à Strasbourg",
                "image_url": "https://mon-chatbot.com/img/strasbourg.jpg",
                "subtitle": "Appuyez ici pour connaitre la météo de Strasbourg",
                "buttons": [
                  {
                    "type": "postback",
                    "payload": "Strasbourg",
                    "title": "Découvrir"
                }]
              },
              {
               "title": "à Toulouse",
               "image_url": "https://mon-chatbot.com/img/toulouse.jpg",
               "subtitle": "Appuyez ici pour connaitre la météo de Toulouse",
               "buttons": [
                 {
                   "type": "postback",
                   "payload": "Toulouse",
                   "title": "Découvrir"
               }]
             },
             {
              "title": "à Lyon",
              "image_url": "https://mon-chatbot.com/img/lyon.jpg",
              "subtitle": "Appuyez ici pour connaitre la météo de Lyon",
              "buttons": [
                {
                  "type": "postback",
                  "payload": "Lyon",
                  "title": "Découvrir"
              }]
            },
               {
                "title": "en France",
                "image_url": "https://mon-chatbot.com/img/france.jpg",
                "subtitle": "Voir la météo pour toute la France",
                "buttons": [
                  {
                   "type":"web_url",
                   "url":"http://www.meteofrance.com/accueil",
                   "title":"Découvrir"
                 }]
              }
            ]
            }
          }
        };
        actions.reset_context( entities, context, sessionId ).then(function() {
          actions.getUserName( sessionId, context, entities ).then( function() {
            actions.envoyer_message_text( sessionId, context, entities, 'Retournons au départ '+context.userName+'. Dans quelle ville souhaitez-vous connaitre la météo ?').then(function() {
              actions.envoyer_message_bouton_generique(sessionId, context, entities, msg);
            })
          })
        })
        break;
      case "Dire_Aurevoir":
        actions.getUserName( sessionId, context, entities ).then( function() {
          actions.envoyer_message_text( sessionId, context, entities, "A bientôt "+context.userName+" ! N'hésitez-pas à revenir nous voir très vite !").then(function() {
            actions.envoyer_message_image( sessionId, context, entities, "https://mon-chatbot.com/img/byebye.jpg" );
          })
        })
        break;
      case "Envoyer_mail":
        break;
    };
  }
};

// --------------------- FONCTION POUR AFFICHER LA METEO EN FCT DE LA LAT & LNG ------------

// --------------------- LE SERVEUR WEB ------------
const wit = new Wit( {
  accessToken: WIT_TOKEN,
  actions,
  logger: new log.Logger( log.INFO )
} );
const app = express();
app.use(( {
    method,
    url
  }, rsp, next ) => {
    rsp.on( 'finish', () => {
      console.log( `${rsp.statusCode} ${method} ${url}` );
    } );
    next();
});
app.use( bodyParser.json( {
  verify: verifyRequestSignature
} ) );
// ------------------------- LE WEBHOOK / hub.verify_token à CONFIGURER AVEC LE MEME MOT DE PASSE QUE FB_VERIFY_TOKEN ------------------------
app.get( '/webhook', ( req, res ) => {
  if ( req.query[ 'hub.mode' ] === 'subscribe' && req.query[
      'hub.verify_token' ] === "vincent" ) { // remplir ici à la place de xxxx le meme mot de passe que FB_VERIFY_TOKEN
    res.send( req.query[ 'hub.challenge' ] );
  } else {
    res.sendStatus( 400 );
  }
} );
// ------------------------- LE WEBHOOK / GESTION DES EVENEMENTS ------------------------
app.post( '/webhook', ( req, res ) => {
  const data = req.body;
  if ( data.object === 'page' ) {
    data.entry.forEach( entry => {
      entry.messaging.forEach( event => {
        if ( event.message && !event.message.is_echo ) {
          var sender = event.sender.id;
          var sessionId = findOrCreateSession( sender );
          var {
            text,
            attachments,
            quick_reply
          } = event.message;

          function hasValue( obj, key ) {
            return obj.hasOwnProperty( key );
          }
          console.log(JSON.stringify(event.message));
          // -------------------------- MESSAGE IMAGE OU GEOLOCALISATION ----------------------------------
          if (event.message.attachments != null  && typeof event.message.attachments[0] != 'undefined') {
              // envoyer à Wit.ai ici

					}
          // --------------------------- MESSAGE QUICK_REPLIES --------------------
					else if ( hasValue( event.message, "text" ) && hasValue(event.message, "quick_reply" ) ) {
            // envoyer à Wit.ai ici
            wit.message( quick_reply.payload, sessions[ sessionId ].context )
              .then( ( {
                entities
              } ) => {
                choisir_prochaine_action( sessionId, sessions[
                  sessionId ].context, entities );
                console.log( 'Yay, on a une response de Wit.ai : ' + JSON.stringify(
                  entities ) );
              } )
              .catch( console.error );
          }
          // ----------------------------- MESSAGE TEXT ---------------------------
          else if ( hasValue( event.message, "text" ) ) {
              // envoyer à Wit.ai ici
              wit.message( text, sessions[ sessionId ].context )
                .then( ( {
                  entities
                } ) => {
                  choisir_prochaine_action( sessionId, sessions[
                    sessionId ].context, entities );
                  console.log( 'Yay, on a une response de Wit.ai : ' + JSON.stringify(
                    entities ) );
                } )
                .catch( console.error );
          }
          // ----------------------------------------------------------------------------
          else {
              // envoyer à Wit.ai ici
          }
        }
        // ----------------------------------------------------------------------------
        else if ( event.postback && event.postback.payload ) {
          var sender = event.sender.id;
          var sessionId = findOrCreateSession( sender );
            // envoyer à Wit.ai ici
            wit.message( event.postback.payload, sessions[ sessionId ].context )
              .then( ( {
                entities
              } ) => {
                choisir_prochaine_action( sessionId, sessions[
                  sessionId ].context, entities );
                console.log( 'Yay, on a une response de Wit.ai : ' + JSON.stringify(
                  entities ) );
              } )
              .catch( console.error );
          }
        // ----------------------------------------------------------------------------
        else {
          console.log( 'received event : ', JSON.stringify( event ) );
        }
      } );
    } );
  }
  res.sendStatus( 200 );
} );
// ----------------- VERIFICATION SIGNATURE -----------------------
function verifyRequestSignature( req, res, buf ) {
  var signature = req.headers[ "x-hub-signature" ];
  if ( !signature ) {
    console.error( "Couldn't validate the signature." );
  } else {
    var elements = signature.split( '=' );
    var method = elements[ 0 ];
    var signatureHash = elements[ 1 ];
    var expectedHash = crypto.createHmac( 'sha1', FB_APP_SECRET ).update( buf )
      .digest( 'hex' );
    if ( signatureHash != expectedHash ) {
      throw new Error( "Couldn't validate the request signature." );
    }
  }
}
app.listen( PORT );
console.log( 'Listening on :' + PORT + '...' );
