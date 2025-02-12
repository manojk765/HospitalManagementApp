// import { PrismaClient, Gender , Category } from '@prisma/client'; 
// const prisma = new PrismaClient();

// async function main() {
//   const today = new Date();
//   const dd = String(today.getDate()).padStart(2, '0');
//   const mm = String(today.getMonth() + 1).padStart(2, '0');
//   const yy = String(today.getFullYear()).slice(-2);
//   const dateString = `${dd}${mm}${yy}`;

//   const patientsToday = await prisma.patient.count({
//     where: {
//       registration_date: {
//         gte: new Date(today.setHours(0, 0, 0, 0)),
//         lt: new Date(today.setHours(23, 59, 59, 999)),
//       },
//     },
//   });

//   const patientData = [
//     {
//       patient_id: `P${dateString}${String(patientsToday + 1).padStart(5, '0')}`,
//       name: 'John Doe',
//       gender: Gender.Male,  
//       date_of_birth: new Date('1990-01-01'),
//       age: 34,
//       contact_number: '9876543210',
//       email: 'john.doe@example.com',
//       address: '123 Main Street',
//       city: 'Springfield',
//       state: 'Illinois',
//       zip_code: '62704',
//       category: Category.Gynecology,
//     },
//     {
//       patient_id: `P${dateString}${String(patientsToday + 2).padStart(5, '0')}`,
//       name: 'Jane Smith',
//       gender: Gender.Female, 
//       date_of_birth: new Date('1985-07-15'),
//       age: 39,
//       contact_number: '9876543211',
//       email: 'jane.smith@example.com',
//       address: '456 Oak Avenue',
//       city: 'Riverside',
//       state: 'California',
//       zip_code: '92501',
//       category: Category.IVF,
//     },
//     {
//       patient_id: `P${dateString}${String(patientsToday + 3).padStart(5, '0')}`,
//       name: 'Emily Johnson',
//       gender: Gender.Female,  
//       date_of_birth: new Date('1995-03-20'),
//       age: 29,
//       contact_number: '9876543212',
//       email: 'emily.johnson@example.com',
//       address: '789 Pine Lane',
//       city: 'Austin',
//       state: 'Texas',
//       zip_code: '73301',
//       category: Category.Other,
//     },
//   ];


//   // Insert the sample data into the Patient table
//   for (const patient of patientData) {
//     await prisma.patient.create({
//       data: patient,
//     });
//   }

  
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// const services = await prisma.patientService.createMany({
//   data: [
//     {
//       patient_id: patientId,
//       service_name: 'X-Ray',
//       cost: 250.0,
//       quantity: 1,
//       service_type: ServiceType.Diagnostic ,
//       total_cost: 250.0 , 
//     },
//     {
//       patient_id: patientId,
//       service_name: 'Physical Therapy',
//       cost: 150.0,
//       quantity: 2,
//       service_type: ServiceType.Medication, 
//       total_cost: 300.0
//     },
//     {
//       patient_id: patientId,
//       service_name: 'Blood Test',
//       cost: 100.0,
//       quantity: 1,
//       service_type: ServiceType.Medication, 
//       total_cost:100.0
//     },
//   ],
// });

// console.log('Sample patients seeded successfully.');

import { PrismaClient , ServiceType } from '@prisma/client';

  const prisma = new PrismaClient();
  
  async function main() {
    const patientId = 'P04022500001';  
    const doctorId = 1; 

  
    const existingPatient = await prisma.patient.findUnique({
      where: {
        patient_id: patientId,
      },
    });
  
    if (!existingPatient) {
      console.log(`Patient with ID ${patientId} does not exist.`);
      return;
    }
  
    console.log('Existing patient found:', existingPatient);

    // Seed data for prescriptions
    // await prisma.prescription.createMany({
    //   data: [
    //     {
    //       patient_id: patientId,
    //       doctor_id: doctorId,
    //       prescription_date: new Date(),  // Date with time, but time part can be ignored
    //       medicine_name: 'Paracetamol',
    //       dosage: '500mg',
    //       duration: '5',
    //       duration_type: 'Days',
    //       is_paid: true, // Payment status
    //     },
    //     {
    //       patient_id: patientId,
    //       doctor_id: doctorId,
    //       prescription_date: new Date(),  // Date with time, but time part can be ignored
    //       medicine_name: 'Ibuprofen',
    //       dosage: '200mg',
    //       duration: '1',
    //       duration_type: 'Weeks',
    //       is_paid: false, // Payment status
    //     },
    //   ],
    // });
  
    // console.log('Prescriptions added for patient');
  
    
    await prisma.patientTests.createMany({
      data: [
        {
          patient_id: patientId,
          test_name: 'Lipid Profile',
          test_date: new Date(), // Date with time, but time part can be ignored
          result_description: 'Normal hemoglobin levels',
          doctor_id: doctorId,
          is_paid: true, // Payment status
        },
        {
          patient_id: patientId,
          test_name: 'Complete Blood Count',
          test_date: new Date(), // Date with time, but time part can be ignored
          result_description: 'No fractures, mild inflammation',
          doctor_id: doctorId,
          is_paid: false, // Payment status
        },
      ],
    });
  
    console.log('Patient tests added for patient');
  }
  
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  