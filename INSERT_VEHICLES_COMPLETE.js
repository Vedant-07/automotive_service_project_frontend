// Complete Vehicle Data for Customer ID 4
// Following the exact API schema structure

const vehiclesForCustomer4 = [
  {
    vehicleId: null, // Will be auto-generated
    vin: "JHMBH5C14LM123451",
    make: "Honda",
    model: "City",
    registrationNumber: "MH12AB1234",
    isInsured: true,
    yearOfRegistration: 2022,
    isBookedForService: false,
    isServiceDone: false,
    version: 0,
    vehicleImageUrl: "https://via.placeholder.com/400?text=Honda+City+2022",
    owner: {
      userId: 4,
      userName: "Customer Four",
      userEmail: "customer4@example.com",
      userPhoneNumber: "9876543210",
      userAddress: "123 Main Street, Mumbai, Maharashtra, India",
      role: "CUSTOMER"
    },
    assignedManager: null,
    workOrders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    vehicleId: null,
    vin: "TSMABN2K521234567",
    make: "Maruti Suzuki",
    model: "Swift",
    registrationNumber: "MH12CD5678",
    isInsured: true,
    yearOfRegistration: 2021,
    isBookedForService: false,
    isServiceDone: false,
    version: 0,
    vehicleImageUrl: "https://via.placeholder.com/400?text=Maruti+Swift+2021",
    owner: {
      userId: 4,
      userName: "Customer Four",
      userEmail: "customer4@example.com",
      userPhoneNumber: "9876543210",
      userAddress: "123 Main Street, Mumbai, Maharashtra, India",
      role: "CUSTOMER"
    },
    assignedManager: null,
    workOrders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    vehicleId: null,
    vin: "MCHHA550P3H123456",
    make: "Hero MotoCorp",
    model: "Splendor",
    registrationNumber: "MH12EF9012",
    isInsured: true,
    yearOfRegistration: 2023,
    isBookedForService: false,
    isServiceDone: false,
    version: 0,
    vehicleImageUrl: "https://via.placeholder.com/400?text=Hero+Splendor+2023",
    owner: {
      userId: 4,
      userName: "Customer Four",
      userEmail: "customer4@example.com",
      userPhoneNumber: "9876543210",
      userAddress: "123 Main Street, Mumbai, Maharashtra, India",
      role: "CUSTOMER"
    },
    assignedManager: null,
    workOrders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

console.log("=".repeat(80));
console.log("COMPLETE VEHICLE DATA FOR CUSTOMER ID 4");
console.log("=".repeat(80));
console.log("\n");

console.log("📋 JSON Format (for API/Database insertion):");
console.log("─".repeat(80));
console.log(JSON.stringify(vehiclesForCustomer4, null, 2));

console.log("\n" + "=".repeat(80));
console.log("SIMPLIFIED SQL INSERT (using existing database):");
console.log("=".repeat(80) + "\n");

const sqlStatements = `
-- Vehicle 1: Honda City for Customer 4
INSERT INTO vehicle (user_id, make, model, registration_number, year_of_registration, vin, is_booked_for_service, is_insured, is_service_done, vehicle_image_url, created_at, updated_at, version)
VALUES (4, 'Honda', 'City', 'MH12AB1234', 2022, 'JHMBH5C14LM123451', FALSE, TRUE, FALSE, 'https://via.placeholder.com/400?text=Honda+City+2022', NOW(), NOW(), 0);

-- Vehicle 2: Maruti Suzuki Swift for Customer 4
INSERT INTO vehicle (user_id, make, model, registration_number, year_of_registration, vin, is_booked_for_service, is_insured, is_service_done, vehicle_image_url, created_at, updated_at, version)
VALUES (4, 'Maruti Suzuki', 'Swift', 'MH12CD5678', 2021, 'TSMABN2K521234567', FALSE, TRUE, FALSE, 'https://via.placeholder.com/400?text=Maruti+Swift+2021', NOW(), NOW(), 0);

-- Vehicle 3: Hero MotoCorp Splendor for Customer 4
INSERT INTO vehicle (user_id, make, model, registration_number, year_of_registration, vin, is_booked_for_service, is_insured, is_service_done, vehicle_image_url, created_at, updated_at, version)
VALUES (4, 'Hero MotoCorp', 'Splendor', 'MH12EF9012', 2023, 'MCHHA550P3H123456', FALSE, TRUE, FALSE, 'https://via.placeholder.com/400?text=Hero+Splendor+2023', NOW(), NOW(), 0);

-- Verify insertion
SELECT * FROM vehicle WHERE user_id = 4;
`;

console.log(sqlStatements);

console.log("\n" + "=".repeat(80));
console.log("VEHICLE SUMMARY:");
console.log("=".repeat(80));
console.log(`
Total Vehicles: 3
Owner User ID: 4
All Insured: ✅ Yes
All Available for Service: ✅ Yes
Service Manager Assigned: ❌ Not yet

Vehicles:
1. Honda City (2022) - Reg: MH12AB1234
2. Maruti Suzuki Swift (2021) - Reg: MH12CD5678
3. Hero MotoCorp Splendor (2023) - Reg: MH12EF9012
`);
