// Script to insert test vehicles for customer ID 4
// Using correct database schema

const testVehicles = [
  {
    userId: 4,
    make: "Honda",
    model: "City",
    registrationNumber: "MH12AB1234",
    yearOfRegistration: 2022,
    vin: "JHMBH5C14LM123451",
    isBooked: false,
    isInsured: true,
    isServiceDone: false,
    imageUrl: "https://via.placeholder.com/300?text=Honda+City"
  },
  {
    userId: 4,
    make: "Maruti Suzuki",
    model: "Swift",
    registrationNumber: "MH12CD5678",
    yearOfRegistration: 2021,
    vin: "TSMABN2K521234567",
    isBooked: false,
    isInsured: true,
    isServiceDone: false,
    imageUrl: "https://via.placeholder.com/300?text=Maruti+Swift"
  },
  {
    userId: 4,
    make: "Hero MotoCorp",
    model: "Splendor",
    registrationNumber: "MH12EF9012",
    yearOfRegistration: 2023,
    vin: "MCHHA550P3H123456",
    isBooked: false,
    isInsured: true,
    isServiceDone: false,
    imageUrl: "https://via.placeholder.com/300?text=Hero+Splendor"
  }
];

// SQL INSERT statements for MySQL
console.log("MySQL INSERT Statements:");
console.log("========================\n");

testVehicles.forEach((vehicle) => {
  const sql = `
INSERT INTO vehicle (user_id, make, model, registration_number, year_of_registration, vin, is_booked_for_service, is_insured, is_service_done, vehicle_image_url, created_at, updated_at, version)
VALUES (
  ${vehicle.userId},
  '${vehicle.make}',
  '${vehicle.model}',
  '${vehicle.registrationNumber}',
  ${vehicle.yearOfRegistration},
  '${vehicle.vin}',
  ${vehicle.isBooked ? 1 : 0},
  ${vehicle.isInsured ? 1 : 0},
  ${vehicle.isServiceDone ? 1 : 0},
  '${vehicle.imageUrl}',
  NOW(),
  NOW(),
  0
);
  `;
  console.log(sql);
});

console.log("\n\nJSON for reference:");
console.log("===================");
console.log(JSON.stringify(testVehicles, null, 2));
