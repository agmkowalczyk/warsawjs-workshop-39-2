const knex = require('knex')(require('../../knexfile'));

function findCar(car_id) {
  return knex('cars')
    .first()
    .where('car_id', car_id);
}
async function rentalCountFor(client_id) {
  const { clientRentalCount } = await knex('rentals')
    .first()
    .count('client_id as clientRentalCount')
    .where('client_id', client_id);
  return clientRentalCount;
}

function findClient(client_id) {
  return knex('users')
    .first()
    .where('user_id', client_id);
}

function insertRental(car_id, client_id, deposit) {
  return knex('rentals').insert({
    car_id,
    client_id,
    deposit,
    state: 'RESERVED',
  });
}

module.exports = {
  findCar,
  rentalCountFor,
  findClient,
  insertRental,
};
