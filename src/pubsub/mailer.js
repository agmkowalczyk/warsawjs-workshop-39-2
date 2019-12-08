const EventBus = require('./event-bus');
const debug = require('debug')('- app:event-bus');
const db = require('../database-gateway/database-gateway');



async function notify (payload) {
  const client = await db.findClient(payload.client_id);
  debug('Send confirmation mail to: ' + client.mail);
}

// dekorator funkcji notify
//
function runInBatch(command, count) {
  let queue = [];

  return function(payload) {
    queue.push(function() {
      command(payload);
    });
    if (queue.length >= count) {
      const copy = [...queue];
      queue = [];
      copy.forEach(function(command) {
        command();
      })
    }
  }
}

// EventBus.subscribe('CAR_RENTED', notify);
EventBus.subscribe('CAR_RENTED', runInBatch(notify, 2));
