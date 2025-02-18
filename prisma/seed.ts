// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// ---------------- For Departments Doctor Staff ----------------

// async function main() {
//   const department1 = await prisma.department.create({
//     data: {
//       department_name: "Cardiology",
//       head_of_department: "Dr. John Doe",
//     },
//   });

//   const department2 = await prisma.department.create({
//     data: {
//       department_name: "Neurology",
//       head_of_department: "Dr. Jane Smith",
//     },
//   });

//   const department3 = await prisma.department.create({
//     data: {
//       department_name: "Orthopedics",
//       head_of_department: "Dr. Richard Miles",
//     },
//   });

//   // Create Doctors
//   await prisma.doctor.createMany({
//     data: [
//       {
//         doctor_id: "D001",
//         name: "Dr. Alice Johnson",
//         specialty: "Cardiologist",
//         contact_number: "9876543210",
//         email: "alice.johnson@example.com",
//         experience_years: 10,
//         department_name: "Cardiology",
//       },
//       {
//         doctor_id: "D002",
//         name: "Dr. Michael Brown",
//         specialty: "Neurologist",
//         contact_number: "9876543211",
//         email: "michael.brown@example.com",
//         experience_years: 12,
//         department_name: "Neurology",
//       },
//       {
//         doctor_id: "D003",
//         name: "Dr. Emily Davis",
//         specialty: "Orthopedic Surgeon",
//         contact_number: "9876543212",
//         email: "emily.davis@example.com",
//         experience_years: 8,
//         department_name: "Orthopedics",
//       },
//     ],
//   });

//   // Create Staff
//   await prisma.staff.createMany({
//     data: [
//       {
//         staff_id: "S001",
//         name: "John Miller",
//         role: "Nurse",
//         contact_number: "9876543201",
//         email: "john.miller@example.com",
//         shift_time: "Day",
//         department_name: "Cardiology",
//         salary: 30000.00,
//       },
//       {
//         staff_id: "S002",
//         name: "Laura Wilson",
//         role: "Technician",
//         contact_number: "9876543202",
//         email: "laura.wilson@example.com",
//         shift_time: "Night",
//         department_name: "Cardiology",
//         salary: 25000.00,
//       },
//       {
//         staff_id: "S003",
//         name: "Tom Harris",
//         role: "Receptionist",
//         contact_number: "9876543203",
//         email: "tom.harris@example.com",
//         shift_time: "Day",
//         department_name: "Cardiology",
//         salary: 20000.00,
//       },
//       {
//         staff_id: "S004",
//         name: "Sarah Johnson",
//         role: "Nurse",
//         contact_number: "9876543204",
//         email: "sarah.johnson@example.com",
//         shift_time: "Day",
//         department_name: "Neurology",
//         salary: 31000.00,
//       },
//       {
//         staff_id: "S005",
//         name: "James Clark",
//         role: "Technician",
//         contact_number: "9876543205",
//         email: "james.clark@example.com",
//         shift_time: "Night",
//         department_name: "Neurology",
//         salary: 27000.00,
//       },
//       {
//         staff_id: "S006",
//         name: "Susan Lee",
//         role: "Receptionist",
//         contact_number: "9876543206",
//         email: "susan.lee@example.com",
//         shift_time: "Day",
//         department_name: "Neurology",
//         salary: 21000.00,
//       },
//       {
//         staff_id: "S007",
//         name: "Robert Davis",
//         role: "Nurse",
//         contact_number: "9876543207",
//         email: "robert.davis@example.com",
//         shift_time: "Day",
//         department_name: "Orthopedics",
//         salary: 32000.00,
//       },
//       {
//         staff_id: "S008",
//         name: "Patricia Walker",
//         role: "Technician",
//         contact_number: "9876543208",
//         email: "patricia.walker@example.com",
//         shift_time: "Night",
//         department_name: "Orthopedics",
//         salary: 26000.00,
//       },
//       {
//         staff_id: "S009",
//         name: "Mark Hall",
//         role: "Receptionist",
//         contact_number: "9876543209",
//         email: "mark.hall@example.com",
//         shift_time: "Day",
//         department_name: "Orthopedics",
//         salary: 22000.00,
//       },
//       {
//         staff_id: "S010",
//         name: "Linda Green",
//         role: "Janitor",
//         contact_number: "9876543210",
//         email: "linda.green@example.com",
//         shift_time: "Night",
//         department_name: "Cardiology",
//         salary: 18000.00,
//       },
//       {
//         staff_id: "S011",
//         name: "Kevin Adams",
//         role: "Janitor",
//         contact_number: "9876543211",
//         email: "kevin.adams@example.com",
//         shift_time: "Night",
//         department_name: "Neurology",
//         salary: 19000.00,
//       },
//       {
//         staff_id: "S012",
//         name: "Jessica Martin",
//         role: "Janitor",
//         contact_number: "9876543212",
//         email: "jessica.martin@example.com",
//         shift_time: "Night",
//         department_name: "Orthopedics",
//         salary: 17000.00,
//       },
//     ],
//   });

//   console.log('Seeding finished.');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// ---------------- Medicines and manufacturers ----------------

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   // Create Manufacturers
//   const manufacturers = await prisma.manufacturer.createMany({
//     data: [
//       {
//         vendor_pharm_name: "PharmaOne",
//         vendor_name: "John Pharma",
//         contact_number: "9876543210",
//         email: "contact@pharmaone.com",
//         address: "123 Main St",
//         city: "New York",
//         state: "NY",
//         zip_code: "10001",
//       },
//       {
//         vendor_pharm_name: "MediSupply",
//         vendor_name: "Sarah Supplies",
//         contact_number: "9876543211",
//         email: "info@medisupply.com",
//         address: "456 Health Ave",
//         city: "Los Angeles",
//         state: "CA",
//         zip_code: "90001",
//       },
//       {
//         vendor_pharm_name: "GlobalMeds",
//         vendor_name: "Global Medics",
//         contact_number: "9876543212",
//         email: "sales@globalmeds.com",
//         address: "789 Pharma Blvd",
//         city: "Chicago",
//         state: "IL",
//         zip_code: "60601",
//       },
//       {
//         vendor_pharm_name: "CareCure",
//         vendor_name: "Care Cure Ltd.",
//         contact_number: "9876543213",
//         email: "support@carecure.com",
//         address: "321 Care St",
//         city: "Houston",
//         state: "TX",
//         zip_code: "77001",
//       },
//       {
//         vendor_pharm_name: "HealthFirst",
//         vendor_name: "Health First Inc.",
//         contact_number: "9876543214",
//         email: "contact@healthfirst.com",
//         address: "654 Wellness Way",
//         city: "Miami",
//         state: "FL",
//         zip_code: "33101",
//       },
//     ],
//   });

//   // Create Medicines
//   await prisma.medicine.createMany({
//     data: [
//       {
//         medicine_name: "Aspirin",
//         stock_quantity: 100,
//         price_per_unit: 2.50,
//         unit_quantity: 10,
//         batch_number: "B12345",
//         expiry_date: new Date("2025-05-01"),
//         manufacturer_name: "PharmaOne",
//       },
//       {
//         medicine_name: "Ibuprofen",
//         stock_quantity: 200,
//         price_per_unit: 3.00,
//         unit_quantity: 20,
//         batch_number: "B54321",
//         expiry_date: new Date("2026-01-01"),
//         manufacturer_name: "MediSupply",
//       },
//       {
//         medicine_name: "Paracetamol",
//         stock_quantity: 150,
//         price_per_unit: 1.50,
//         unit_quantity: 10,
//         batch_number: "B98765",
//         expiry_date: new Date("2025-12-01"),
//         manufacturer_name: "GlobalMeds",
//       },
//       {
//         medicine_name: "Amoxicillin",
//         stock_quantity: 300,
//         price_per_unit: 5.00,
//         unit_quantity: 15,
//         batch_number: "B67890",
//         expiry_date: new Date("2026-09-01"),
//         manufacturer_name: "CareCure",
//       },
//       {
//         medicine_name: "Metformin",
//         stock_quantity: 120,
//         price_per_unit: 4.00,
//         unit_quantity: 30,
//         batch_number: "B13579",
//         expiry_date: new Date("2026-03-01"),
//         manufacturer_name: "HealthFirst",
//       },
//       {
//         medicine_name: "Simvastatin",
//         stock_quantity: 180,
//         price_per_unit: 6.50,
//         unit_quantity: 20,
//         batch_number: "B24680",
//         expiry_date: new Date("2025-11-15"),
//         manufacturer_name: "PharmaOne",
//       },
//       {
//         medicine_name: "Hydrochlorothiazide",
//         stock_quantity: 220,
//         price_per_unit: 2.80,
//         unit_quantity: 25,
//         batch_number: "B10203",
//         expiry_date: new Date("2026-07-15"),
//         manufacturer_name: "MediSupply",
//       },
//       {
//         medicine_name: "Atorvastatin",
//         stock_quantity: 140,
//         price_per_unit: 7.00,
//         unit_quantity: 10,
//         batch_number: "B40506",
//         expiry_date: new Date("2026-08-25"),
//         manufacturer_name: "GlobalMeds",
//       },
//       {
//         medicine_name: "Clopidogrel",
//         stock_quantity: 190,
//         price_per_unit: 3.20,
//         unit_quantity: 20,
//         batch_number: "B70809",
//         expiry_date: new Date("2025-06-10"),
//         manufacturer_name: "CareCure",
//       },
//       {
//         medicine_name: "Warfarin",
//         stock_quantity: 250,
//         price_per_unit: 8.00,
//         unit_quantity: 15,
//         batch_number: "B90908",
//         expiry_date: new Date("2026-04-30"),
//         manufacturer_name: "HealthFirst",
//       },
//       {
//         medicine_name: "Lisinopril",
//         stock_quantity: 130,
//         price_per_unit: 5.50,
//         unit_quantity: 25,
//         batch_number: "B12121",
//         expiry_date: new Date("2025-08-20"),
//         manufacturer_name: "PharmaOne",
//       },
//       {
//         medicine_name: "Losartan",
//         stock_quantity: 160,
//         price_per_unit: 4.50,
//         unit_quantity: 30,
//         batch_number: "B13131",
//         expiry_date: new Date("2026-02-12"),
//         manufacturer_name: "MediSupply",
//       },
//       {
//         medicine_name: "Furosemide",
//         stock_quantity: 110,
//         price_per_unit: 2.20,
//         unit_quantity: 20,
//         batch_number: "B14141",
//         expiry_date: new Date("2025-10-18"),
//         manufacturer_name: "GlobalMeds",
//       },
//       {
//         medicine_name: "Enalapril",
//         stock_quantity: 170,
//         price_per_unit: 3.80,
//         unit_quantity: 15,
//         batch_number: "B15151",
//         expiry_date: new Date("2026-06-30"),
//         manufacturer_name: "CareCure",
//       },
//       {
//         medicine_name: "Digoxin",
//         stock_quantity: 210,
//         price_per_unit: 9.50,
//         unit_quantity: 10,
//         batch_number: "B16161",
//         expiry_date: new Date("2026-10-05"),
//         manufacturer_name: "HealthFirst",
//       },
//       {
//         medicine_name: "Nitroglycerin",
//         stock_quantity: 100,
//         price_per_unit: 12.00,
//         unit_quantity: 10,
//         batch_number: "B17171",
//         expiry_date: new Date("2025-05-18"),
//         manufacturer_name: "PharmaOne",
//       },
//       {
//         medicine_name: "Amlodipine",
//         stock_quantity: 240,
//         price_per_unit: 6.80,
//         unit_quantity: 25,
//         batch_number: "B18181",
//         expiry_date: new Date("2026-11-01"),
//         manufacturer_name: "MediSupply",
//       },
//       {
//         medicine_name: "Spironolactone",
//         stock_quantity: 230,
//         price_per_unit: 7.80,
//         unit_quantity: 20,
//         batch_number: "B19191",
//         expiry_date: new Date("2026-09-18"),
//         manufacturer_name: "GlobalMeds",
//       },
//       {
//         medicine_name: "Verapamil",
//         stock_quantity: 150,
//         price_per_unit: 4.20,
//         unit_quantity: 30,
//         batch_number: "B20202",
//         expiry_date: new Date("2025-12-15"),
//         manufacturer_name: "CareCure",
//       },
//       {
//         medicine_name: "Captopril",
//         stock_quantity: 125,
//         price_per_unit: 5.90,
//         unit_quantity: 20,
//         batch_number: "B21212",
//         expiry_date: new Date("2026-03-01"),
//         manufacturer_name: "HealthFirst",
//       },
//     ],
//   });

//   console.log('Seeding finished.');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// ---------------- For Patients ----------------

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   // Counter to keep track of the number of patients per day
//   let dailyPatientCounter = 1;

//   // Function to generate a patient ID in the format Pddmmyyxxxxx
//   function generatePatientId() {
//     const now = new Date();
//     const dd = String(now.getDate()).padStart(2, '0');
//     const mm = String(now.getMonth() + 1).padStart(2, '0'); // January is 0
//     const yy = String(now.getFullYear()).slice(-2);
//     const patientNumber = String(dailyPatientCounter).padStart(5, '0'); // xxxxx format
//     dailyPatientCounter++;
//     return `P${dd}${mm}${yy}${patientNumber}`;
//   }

//   // Seed data for LabTest
//   const labTests = await prisma.labTest.createMany({
//     data: [
//       { test_name: 'Blood Test', cost: 500.00, description: 'Complete Blood Count (CBC)' },
//       { test_name: 'X-Ray', cost: 1000.00, description: 'Chest X-Ray' },
//       { test_name: 'MRI Scan', cost: 5000.00, description: 'Magnetic Resonance Imaging' },
//     ],
//   });

//   // Seed data for Services
//   const services = await prisma.services.createMany({
//     data: [
//       { service_name: 'Ultrasound', cost: 1200.00, description: 'Abdominal Ultrasound' },
//       { service_name: 'ECG', cost: 800.00, description: 'Electrocardiogram' },
//       { service_name: 'Physiotherapy', cost: 1500.00, description: 'Physical Therapy' },
//     ],
//   });

//   // Seed data for Surgeries
//   const surgeries = await prisma.surgery.createMany({
//     data: [
//       { surgery_name: 'Appendectomy', cost: 20000.00, description: 'Surgical removal of the appendix' },
//       { surgery_name: 'Cataract Surgery', cost: 30000.00, description: 'Surgery to remove the lens of the eye and replace it with an artificial one' },
//       { surgery_name: 'Heart Bypass Surgery', cost: 150000.00, description: 'Surgery to improve blood flow to the heart' },
//     ],
//   });

//   // Seed data for Patients
//   const patients = await prisma.patient.createMany({
//     data: [
//       {
//         patient_id: generatePatientId(),
//         name: 'John Doe',
//         gender: 'Male',
//         date_of_birth: new Date('1980-01-15'),
//         age: 43,
//         contact_number: '9876543210',
//         email: 'johndoe@example.com',
//         address: '123 Main Street',
//         city: 'Springfield',
//         state: 'Illinois',
//         zip_code: '62704',
//         category: 'Gynecology',
//       },
//       {
//         patient_id: generatePatientId(),
//         name: 'Jane Smith',
//         gender: 'Female',
//         date_of_birth: new Date('1995-03-22'),
//         age: 28,
//         contact_number: '9876543211',
//         email: 'janesmith@example.com',
//         address: '456 Oak Avenue',
//         city: 'Hometown',
//         state: 'California',
//         zip_code: '90210',
//         category: 'IVF',
//       },
//       {
//         patient_id: generatePatientId(),
//         name: 'Alex Johnson',
//         gender: 'Other',
//         date_of_birth: new Date('1990-05-10'),
//         age: 33,
//         contact_number: '9876543212',
//         email: 'alexjohnson@example.com',
//         address: '789 Pine Lane',
//         city: 'Smalltown',
//         state: 'Texas',
//         zip_code: '75001',
//         category: 'Other',
//       },
//     ],
//   });

//   console.log("Database has been seeded successfully!");
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });


// ----- Patient data -----

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function seedPatientService() {
//   const patientServices = await prisma.patientService.createMany({
//     data: [
//       { patient_id: 'P16022500001', service_name: 'Ultrasound', quantity: 1, total_cost: 1200.00, is_paid: true  , service_date :  new Date},
//       { patient_id: 'P16022500002', service_name: 'ECG', quantity: 1, total_cost: 800.00, is_paid: false , service_date :  new Date },
//       { patient_id: 'P16022500003', service_name: 'Physiotherapy', quantity: 2, total_cost: 3000.00, is_paid: true , service_date :  new Date },
//     ],
//   });
//   console.log('PatientService data seeded successfully!');
// }

// async function seedPatientTests() {
//   const patientTests = await prisma.patientTests.createMany({
//     data: [
//       { 
//         patient_id: 'P16022500001', 
//         test_name: 'Blood Test', 
//         test_date: new Date('2024-02-01'), 
//         result_description: 'CBC result shows normal levels', 
//         is_paid: false 
//       },
//       { 
//         patient_id: 'P16022500002', 
//         test_name: 'X-Ray', 
//         test_date: new Date('2024-02-02'), 
//         result_description: 'Chest X-Ray shows no abnormalities', 
//         is_paid: true 
//       },
//       { 
//         patient_id: 'P16022500003', 
//         test_name: 'MRI Scan', 
//         test_date: new Date('2024-02-03'), 
//         result_description: 'MRI results indicate mild inflammation', 
//         is_paid: true 
//       },
//     ],
//   });
//   console.log('PatientTests data seeded successfully!');
// }

// async function seedPatientSurgery() {
//   const patientSurgeries = await prisma.patientSurgery.createMany({
//     data: [
//       { 
//         patient_id: 'P16022500001', 
//         surgery_name: 'Appendectomy', 
//         surgery_date: new Date('2024-02-05'), 
//         surgery_description: 'Appendix removal surgery performed successfully', 
//         is_paid: true 
//       },
//       { 
//         patient_id: 'P16022500002', 
//         surgery_name: 'Cataract Surgery', 
//         surgery_date: new Date('2024-02-06'), 
//         surgery_description: 'Successful cataract removal and lens replacement', 
//         is_paid: false 
//       },
//       { 
//         patient_id: 'P16022500003', 
//         surgery_name: 'Heart Bypass Surgery', 
//         surgery_date: new Date('2024-02-07'), 
//         surgery_description: 'Triple bypass surgery performed, patient stable', 
//         is_paid: true 
//       },
//     ],
//   });
//   console.log('PatientSurgery data seeded successfully!');
// }

// async function seedData() {
//   await seedPatientService();
//   await seedPatientTests();
//   await seedPatientSurgery();
// }

// seedData()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });


//  ----------------- Patient Doctor -----------------

// prisma/seed.ts

// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {

//   await prisma.patientDoctor.createMany({
//     data: [
//       {
//         patient_id: 'P16022500001',
//         doctor_id: 'D001',
//       },
//       {
//         patient_id: 'P16022500002',
//         doctor_id: 'D002',
//       },
//       {
//         patient_id: 'P16022500003',
//         doctor_id: 'D003',
//       },
//     ],
//   });
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });


// ---------------- Room data ----------------

// import { PrismaClient, RoomType } from '@prisma/client'; 

// const prisma = new PrismaClient();

// async function main() {
//   const bedData = [
//     { type: RoomType.GeneralWard, bedNumber: "GW-101", dailyRate: 500, available: true },
//     { type: RoomType.GeneralWard, bedNumber: "GW-102", dailyRate: 500, available: true },
//     { type: RoomType.Private, bedNumber: "PR-201", dailyRate: 1500, available: true },
//     { type: RoomType.Private, bedNumber: "PR-202", dailyRate: 1500, available: true },
//     { type: RoomType.ICU, bedNumber: "ICU-301", dailyRate: 3000, available: true },
//     { type: RoomType.ICU, bedNumber: "ICU-302", dailyRate: 3000, available: true },
//   ];

//   for (const bed of bedData) {
//     await prisma.beds.create({
//       data: bed,
//     });
//   }

//   console.log('Seed data inserted successfully!');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


import { PrismaClient , Gender } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.birth.create({
    data: {
      birth_id: "B16022500001",
      patient_id: "P16022500002",
      name: "Jayanti",
      fatherName: "Michael Doe",
      gender: Gender.Male,  
      date: new Date("2023-05-12T07:00:00Z"),
      typeofDelivery: "Normal",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
