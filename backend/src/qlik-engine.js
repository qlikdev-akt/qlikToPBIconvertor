const enigma = require("enigma.js");
const schema = require("enigma.js/schemas/12.20.0.json");
const WebSocket = require("ws");

var session = null;

// exports.createSession = function (connectionString) {
//   const config = {
//     schema,
//     url: `ws://${connectionString}/app/engineData`,
//     createSocket: (url) => new WebSocket(url),
//   };

//   session = enigma.create(config);
//   if (!session) {
//     console.log("Session not created");
//     return 0;
//   }
//   return "session created";
// };

exports.connectToEngine = function (connectionString) {
  const config = {
    schema,
    url: `ws://${connectionString}/app/engineData`,
    createSocket: (url) => new WebSocket(url),
  };

  session = enigma.create(config);
  if (!session) {
    console.log("Session not created");
    return 0;
  }
  return session
    .open()
    .then((qGlobal) => {
      return qGlobal;
    })
    .catch((err) => {
      console.log("engine not connected", err);
      return 0;
    });
};

exports.endSession = function () {
  if (!session) return 0;
  session.close();
  return "session has been ended";
};

exports.openSession = function () {
  if (session) return 0;
  session.open();
};

// module.exports = conectToEngine;
// module.exports = endSession;
