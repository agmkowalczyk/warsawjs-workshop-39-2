const db = require('../database-gateway/database-gateway');
const EventBus = require('../pubsub/event-bus');

async function rentCar({ car_id, client_id }) {
  const car = await db.findCar(car_id);
  const clientRentalCount = await db.rentalCountFor(client_id);
  const client = await db.findClient(client_id);
  const calculator = createCalculator({ car, clientRentalCount, client });

  let deposit = calculator.deposit;

  await db.insertRental(car_id, client_id, deposit);
  EventBus.publish('CAR_RENTED', { car_id, client_id, deposit });
}

function createCalculator({ car, clientRentalCount, client }) {
  if (clientRentalCount < 1 && !client.isVip) {
    return new NewClientStrategy(car);
  } else if (clientRentalCount >= 1 && !client.isVip) {
    return new StandardClientStrategy(car);
  } else if (client.isVip) {
    return new VipClientStrategy(car);
  }
}

class DepositCalculator {
  constructor(car) {
    this.car = car;
  }
  get deposit() {
    throw new Error('subclass resposibility');
  }
}

class NewClientStrategy extends DepositCalculator {
  get deposit() {
    return Math.max(10000, this.car.price * 0.2);
  }
}

class StandardClientStrategy extends DepositCalculator {
  get deposit() {
    return  Math.min(Math.max(10000, this.car.price * 0.15), 60000);
  }
}

class VipClientStrategy extends DepositCalculator {
  get deposit() {
    return Math.min(Math.max(5000, this.car.price * 0.1), 40000);
  }
}

module.exports = { rentCar };
