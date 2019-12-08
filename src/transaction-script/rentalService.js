const knex = require('knex')(require('../../knexfile'));
const db = require('../database-gateway/database-gateway');

async function rentCar({ car_id, client_id }) {
  const car = await db.findCar(car_id);
  // const car = await knex('cars')
  //   .first()
  //   .where('car_id', car_id);
  const clientRentalCount = await db.rentalCountFor(client_id);
  // const { clientRentalCount } = await knex('rentals')
  //   .first()
  //   .count('client_id as clientRentalCount')
  //   .where('client_id', client_id);
  const client = await db.findClient(client_id);
  // const client = await knex('users')
  //   .first()
  //   .where('user_id', client_id);

  let deposit = 0;
  if (clientRentalCount < 1 && !client.isVip) {
    deposit = Math.max(10000, car.price * 0.2);
  } else if (clientRentalCount >= 1 && !client.isVip) {
    deposit = Math.min(Math.max(10000, car.price * 0.15), 60000);
  } else if (client.isVip) {
    deposit = Math.min(Math.max(5000, car.price * 0.1), 40000);
  }

  await db.insertRental(car_id, client_id, deposit);
  // await knex('rentals').insert({
  //   car_id,
  //   client_id,
  //   deposit,
  //   state: 'RESERVED',
  // });
}

module.exports = { rentCar };
