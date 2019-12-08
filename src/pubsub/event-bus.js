const topics = {};

const hOP = topics.hasOwnProperty;

const EventBus = {
  subscribe: function(topic, listener) {
    if (!hOP.call(topics, topic)) {
      topics[topic] = [];
    }

      topics[topic].push(listener);
  },
  publish: function(topic, info = {}) {
    if (!hOP.call(topics, topic)) {
      return;
    }
    topics[topic].forEach(function(listener) {
      listener(info);
    })
  }
};

module.exports = EventBus;
