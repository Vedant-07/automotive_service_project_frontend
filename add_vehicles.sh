#!/bin/bash

# Add Vehicle 1: Honda City for Customer 4
echo "Adding Vehicle 1: Honda City"
echo "========================================"
curl -X 'POST' \
  'http://localhost:9005/api/customers/4/vehicles' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <CUSTOMER_4_TOKEN_HERE>' \
  -d '{
    "vin": "JHMBH5C14LM123451",
    "make": "Honda",
    "model": "City",
    "registrationNumber": "MH12AB1234",
    "isInsured": true,
    "yearOfRegistration": 2022,
    "isBookedForService": false,
    "isServiceDone": false,
    "vehicleImageUrl": "https://via.placeholder.com/400?text=Honda+City+2022",
    "owner": {
      "userId": 4,
      "userName": "Manan Pandya",
      "userEmail": "swarachokshi1@gmail.com",
      "userPhoneNumber": "9328286456",
      "userAddress": "315 A Block Aditya Soigne Apartments, GM Palya, Bangalore",
      "role": "CUSTOMER"
    }
  }'

echo -e "\n\n"

# Add Vehicle 2: Maruti Swift
echo "Adding Vehicle 2: Maruti Suzuki Swift"
echo "========================================"
curl -X 'POST' \
  'http://localhost:9005/api/customers/4/vehicles' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <CUSTOMER_4_TOKEN_HERE>' \
  -d '{
    "vin": "TSMABN2K521234567",
    "make": "Maruti Suzuki",
    "model": "Swift",
    "registrationNumber": "MH12CD5678",
    "isInsured": true,
    "yearOfRegistration": 2021,
    "isBookedForService": false,
    "isServiceDone": false,
    "vehicleImageUrl": "https://via.placeholder.com/400?text=Maruti+Swift+2021",
    "owner": {
      "userId": 4,
      "userName": "Manan Pandya",
      "userEmail": "swarachokshi1@gmail.com",
      "userPhoneNumber": "9328286456",
      "userAddress": "315 A Block Aditya Soigne Apartments, GM Palya, Bangalore",
      "role": "CUSTOMER"
    }
  }'

echo -e "\n\n"

# Add Vehicle 3: Hero Splendor
echo "Adding Vehicle 3: Hero MotoCorp Splendor"
echo "========================================"
curl -X 'POST' \
  'http://localhost:9005/api/customers/4/vehicles' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <CUSTOMER_4_TOKEN_HERE>' \
  -d '{
    "vin": "MCHHA550P3H123456",
    "make": "Hero MotoCorp",
    "model": "Splendor",
    "registrationNumber": "MH12EF9012",
    "isInsured": true,
    "yearOfRegistration": 2023,
    "isBookedForService": false,
    "isServiceDone": false,
    "vehicleImageUrl": "https://via.placeholder.com/400?text=Hero+Splendor+2023",
    "owner": {
      "userId": 4,
      "userName": "Manan Pandya",
      "userEmail": "swarachokshi1@gmail.com",
      "userPhoneNumber": "9328286456",
      "userAddress": "315 A Block Aditya Soigne Apartments, GM Palya, Bangalore",
      "role": "CUSTOMER"
    }
  }'
