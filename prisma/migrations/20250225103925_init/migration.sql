-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('GeneralWard', 'SemiPrivate', 'Private', 'ICU');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Gynecology', 'IVF', 'Other');

-- CreateTable
CREATE TABLE "Manufacturer" (
    "vendor_pharm_name" TEXT NOT NULL,
    "vendor_name" TEXT NOT NULL,
    "contact_number" VARCHAR(10) NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" VARCHAR(10),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("vendor_pharm_name")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "medicine_id" SERIAL NOT NULL,
    "medicine_name" TEXT NOT NULL,
    "stock_quantity" INTEGER NOT NULL,
    "price_per_unit" DECIMAL(10,2) NOT NULL,
    "unit_quantity" DECIMAL(10,2) NOT NULL,
    "batch_number" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "manufacturer_name" TEXT NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("medicine_id")
);

-- CreateTable
CREATE TABLE "Department" (
    "department_name" VARCHAR(100) NOT NULL,
    "head_of_department" VARCHAR(100),

    CONSTRAINT "Department_pkey" PRIMARY KEY ("department_name")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "doctor_id" VARCHAR(15) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "specialty" VARCHAR(100) NOT NULL,
    "contact_number" VARCHAR(15) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "experience_years" INTEGER NOT NULL,
    "department_name" TEXT NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("doctor_id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "staff_id" VARCHAR(15) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(100) NOT NULL,
    "contact_number" VARCHAR(10) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "shift_time" VARCHAR(100) NOT NULL,
    "department_name" TEXT NOT NULL,
    "salary" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "LabTest" (
    "test_name" VARCHAR(100) NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "LabTest_pkey" PRIMARY KEY ("test_name")
);

-- CreateTable
CREATE TABLE "Services" (
    "service_name" VARCHAR(100) NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("service_name")
);

-- CreateTable
CREATE TABLE "Surgery" (
    "surgery_name" VARCHAR(100) NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Surgery_pkey" PRIMARY KEY ("surgery_name")
);

-- CreateTable
CREATE TABLE "Patient" (
    "patient_id" VARCHAR(15) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "gender" "Gender" NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "contact_number" VARCHAR(10) NOT NULL,
    "email" VARCHAR(100),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "zip_code" VARCHAR(10),
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" "Category" NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "prescription_id" SERIAL NOT NULL,
    "patient_id" VARCHAR(15) NOT NULL,
    "doctor_id" VARCHAR(15) NOT NULL,
    "prescription_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "medicine_name" VARCHAR(100) NOT NULL,
    "dosage" VARCHAR(100) NOT NULL,
    "duration" VARCHAR(50) NOT NULL,
    "duration_type" VARCHAR(50) NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("prescription_id")
);

-- CreateTable
CREATE TABLE "PatientDoctor" (
    "patient_id" VARCHAR(15) NOT NULL,
    "doctor_id" VARCHAR(15) NOT NULL,

    CONSTRAINT "PatientDoctor_pkey" PRIMARY KEY ("patient_id","doctor_id")
);

-- CreateTable
CREATE TABLE "PatientService" (
    "patient_id" VARCHAR(15) NOT NULL,
    "service_name" VARCHAR(100) NOT NULL,
    "service_date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_cost" DECIMAL(10,2) NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PatientService_pkey" PRIMARY KEY ("patient_id","service_name","service_date")
);

-- CreateTable
CREATE TABLE "PatientTests" (
    "patient_id" VARCHAR(15) NOT NULL,
    "test_name" VARCHAR(100) NOT NULL,
    "test_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "total_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "result_description" TEXT NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PatientTests_pkey" PRIMARY KEY ("patient_id","test_name","test_date")
);

-- CreateTable
CREATE TABLE "PatientSurgery" (
    "patient_id" VARCHAR(15) NOT NULL,
    "surgery_name" VARCHAR(100) NOT NULL,
    "surgery_date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "total_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "surgery_description" TEXT NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PatientSurgery_pkey" PRIMARY KEY ("patient_id","surgery_name","surgery_date")
);

-- CreateTable
CREATE TABLE "Beds" (
    "id" SERIAL NOT NULL,
    "type" "RoomType" NOT NULL,
    "bedNumber" VARCHAR(10) NOT NULL,
    "dailyRate" DECIMAL(10,2) NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Beds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admission" (
    "patient_id" VARCHAR(15) NOT NULL,
    "room_id" INTEGER NOT NULL,
    "admittedDate" TIMESTAMP(3) NOT NULL,
    "dischargeDate" TIMESTAMP(3),

    CONSTRAINT "Admission_pkey" PRIMARY KEY ("patient_id","room_id","admittedDate")
);

-- CreateTable
CREATE TABLE "PatientAdmissionFee" (
    "patient_id" VARCHAR(15) NOT NULL,
    "room_id" INTEGER NOT NULL,
    "admittedDate" TIMESTAMP(3) NOT NULL,
    "dischargeDate" TIMESTAMP(3) NOT NULL,
    "totalDays" INTEGER NOT NULL,
    "totalCost" DECIMAL(10,2) NOT NULL,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PatientAdmissionFee_pkey" PRIMARY KEY ("patient_id","room_id","admittedDate")
);

-- CreateTable
CREATE TABLE "Birth" (
    "birth_id" VARCHAR(15) NOT NULL,
    "patient_id" VARCHAR(15) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "fatherName" VARCHAR(100) NOT NULL,
    "gender" "Gender" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "typeofDelivery" VARCHAR(20) NOT NULL,

    CONSTRAINT "Birth_pkey" PRIMARY KEY ("birth_id")
);

-- CreateTable
CREATE TABLE "OpdPatient" (
    "id" VARCHAR(5) NOT NULL,
    "name" TEXT NOT NULL,
    "contact" VARCHAR(10) NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "doctor_id" VARCHAR(15) NOT NULL,
    "purpose" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OpdPatient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "payment_id" VARCHAR(20) NOT NULL,
    "patient_id" VARCHAR(15) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "payment_method" VARCHAR(20) NOT NULL,
    "amount_paid" DECIMAL(10,2) NOT NULL,
    "discharged" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "Income" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" VARCHAR(10) NOT NULL DEFAULT 'income',
    "date" TIMESTAMP(3) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "description" VARCHAR(20) NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" VARCHAR(10) NOT NULL DEFAULT 'expense',
    "date" TIMESTAMP(3) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "description" VARCHAR(20) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_vendor_pharm_name_key" ON "Manufacturer"("vendor_pharm_name");

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_email_key" ON "Manufacturer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_medicine_name_manufacturer_name_key" ON "Medicine"("medicine_name", "manufacturer_name");

-- CreateIndex
CREATE UNIQUE INDEX "Beds_type_bedNumber_key" ON "Beds"("type", "bedNumber");

-- AddForeignKey
ALTER TABLE "Medicine" ADD CONSTRAINT "Medicine_manufacturer_name_fkey" FOREIGN KEY ("manufacturer_name") REFERENCES "Manufacturer"("vendor_pharm_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_department_name_fkey" FOREIGN KEY ("department_name") REFERENCES "Department"("department_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_department_name_fkey" FOREIGN KEY ("department_name") REFERENCES "Department"("department_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("doctor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientDoctor" ADD CONSTRAINT "PatientDoctor_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientDoctor" ADD CONSTRAINT "PatientDoctor_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("doctor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientService" ADD CONSTRAINT "PatientService_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientService" ADD CONSTRAINT "PatientService_service_name_fkey" FOREIGN KEY ("service_name") REFERENCES "Services"("service_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientTests" ADD CONSTRAINT "PatientTests_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientTests" ADD CONSTRAINT "PatientTests_test_name_fkey" FOREIGN KEY ("test_name") REFERENCES "LabTest"("test_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientSurgery" ADD CONSTRAINT "PatientSurgery_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientSurgery" ADD CONSTRAINT "PatientSurgery_surgery_name_fkey" FOREIGN KEY ("surgery_name") REFERENCES "Surgery"("surgery_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admission" ADD CONSTRAINT "Admission_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Beds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAdmissionFee" ADD CONSTRAINT "PatientAdmissionFee_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientAdmissionFee" ADD CONSTRAINT "PatientAdmissionFee_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Beds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Birth" ADD CONSTRAINT "Birth_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpdPatient" ADD CONSTRAINT "OpdPatient_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "Doctor"("doctor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;
