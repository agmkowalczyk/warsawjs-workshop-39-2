const Rental = require('../domain-model/rental');
const RentalBuilder = require('../builder/rental-builder');

// describe('Rental class', () => {
//   test('should change state to deposit paid', () => {
//     const rental = new Rental(1,1,1,8000);
//     rental.payDeposit();
//     console.log(rental);
//     expect(true).toBe(true);
//
//   })
// });


describe('Rental class', () => {
  test('should change state to deposit paid', () => {
    const rental = new Rental(1, 1, 1, 8000);
    rental.payDeposit();
    expect(rental.getState().equals(Rental.RentalState.DEPOSIT_PAID)).toBe(
      true
    );
  });

  test('should change state to deposit returned', () => {
    const rental = new Rental(1, 1, 1, 8000, Rental.RentalState.DEPOSIT_PAID);
    rental.returnDeposit();
    expect(rental.getState().equals(Rental.RentalState.DEPOSIT_SETTLED)).toBe(
      true
    );
  });

  test('should change state to deposit returned 2', () => {
    const builder = new RentalBuilder();
    const rental = builder
      .rentBy(1)
      .selectCar(2)
      .depositAmount(8000)
      .inState(Rental.RentalState.DEPOSIT_PAID)
      .build();
    rental.returnDeposit();
    expect(rental.getState().equals(Rental.RentalState.DEPOSIT_SETTLED)).toBe(
      true
    );
  });
});

test('should change state to deposit returned 3', () => {
  const builder = new RentalBuilder();
  const rental = builder
    .std()
    .inState(Rental.RentalState.DEPOSIT_PAID)
    .build();
  rental.returnDeposit();
  expect(rental.getState().equals(Rental.RentalState.DEPOSIT_SETTLED)).toBe(
    true
  );
});

test('should change state to deposit returned 4', () => {
  const builder = new RentalBuilder();
  const rental = builder.buildPaid();
  rental.returnDeposit();
  expect(rental.getState().equals(Rental.RentalState.DEPOSIT_SETTLED)).toBe(
    true
  );
});
