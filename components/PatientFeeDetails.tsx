"use client"

import React, { useState, useEffect } from "react";
import prisma from "@/lib/prisma";
import { 
  PatientService, 
  PatientTests, 
  PatientSurgery, 
  PatientAdmissionFee 
} from "@prisma/client";

interface FeeItem {
  id: string;
  name: string;
  amount: number;
  is_paid: boolean;
}

interface PatientData {
  services: FeeItem[];
  tests: FeeItem[];
  surgeries: FeeItem[];
  admissions: FeeItem[];
}

// Utility function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Type guards for data transformation
const transformServices = (services: PatientService[]): FeeItem[] => {
  return services.map(service => ({
    id: service.patient_id, // assuming this is the correct ID field
    name: service.service_name,
    amount: Number(service.total_cost),
    is_paid: service.is_paid
  }));
};

const transformTests = (tests: PatientTests[]): FeeItem[] => {
  return tests.map(test => ({
    id: test.patient_id, // assuming this is the correct ID field
    name: test.test_name,
    amount: Number(test.total_cost),
    is_paid: test.is_paid
  }));
};

const transformSurgeries = (surgeries: PatientSurgery[]): FeeItem[] => {
  return surgeries.map(surgery => ({
    id: surgery.patient_id, // assuming this is the correct ID field
    name: surgery.surgery_name,
    amount: Number(surgery.total_cost),
    is_paid: surgery.is_paid
  }));
};

const transformAdmissions = (admissions: PatientAdmissionFee[]): FeeItem[] => {
  return admissions.map(admission => ({
    id: admission.patient_id, 
    name: `Room ${admission.room_id}`,
    amount: Number(admission.totalCost),
    is_paid: admission.is_paid
  }));
};

// API call with error handling
async function fetchPatientData(patientId: string): Promise<PatientData> {
  try {
    const [services, tests, surgeries, admissions] = await Promise.all([
      prisma.patientService.findMany({
        where: { 
          patient_id: patientId, 
          is_paid: false 
        }
      }),
      prisma.patientTests.findMany({
        where: { 
          patient_id: patientId, 
          is_paid: false 
        }
      }),
      prisma.patientSurgery.findMany({
        where: { 
          patient_id: patientId, 
          is_paid: false 
        }
      }),
      prisma.patientAdmissionFee.findMany({
        where: { 
          patient_id: patientId, 
          is_paid: false 
        }
      })
    ]);

    return {
      services: transformServices(services),
      tests: transformTests(tests),
      surgeries: transformSurgeries(surgeries),
      admissions: transformAdmissions(admissions)
    };
  } catch (error) {
    console.error('Error fetching patient data:', error);
    throw new Error('Failed to fetch patient data');
  }
}

// Fee Section Component
const FeeSection: React.FC<{
  title: string;
  items: FeeItem[];
  total: number;
}> = ({ title, items, total }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between text-sm">
          <span className="text-gray-600">{item.name}</span>
          <span className="font-medium">{formatCurrency(item.amount)}</span>
        </div>
      ))}
      <div className="pt-2 border-t flex justify-between text-sm font-semibold">
        <span>Total {title}</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  </div>
);


export default function PatientFeesPage({ patientId }: {patientId: string}) {
  const [patientData, setPatientData] = useState<PatientData>({
    services: [],
    tests: [],
    surgeries: [],
    admissions: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchPatientData(patientId);
        setPatientData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  if (isLoading) {
    return <div className="p-6">Loading patient fees...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  // Calculate totals
  const calculateTotal = (items: FeeItem[]): number => 
    items.reduce((sum, item) => sum + item.amount, 0);

  const servicesTotal = calculateTotal(patientData.services);
  const testsTotal = calculateTotal(patientData.tests);
  const surgeriesTotal = calculateTotal(patientData.surgeries);
  const admissionsTotal = calculateTotal(patientData.admissions);
  
  const totalAmount = servicesTotal + testsTotal + surgeriesTotal + admissionsTotal;
  const amountPaid = 0; // Replace with actual paid amount from your system
  const remainingAmount = totalAmount - amountPaid;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Patient Fees Summary</h1>

      <div className="space-y-8">
        <FeeSection 
          title="Services" 
          items={patientData.services}
          total={servicesTotal}
        />
        
        <FeeSection 
          title="Tests" 
          items={patientData.tests}
          total={testsTotal}
        />
        
        <FeeSection 
          title="Surgeries" 
          items={patientData.surgeries}
          total={surgeriesTotal}
        />
        
        <FeeSection 
          title="Admissions" 
          items={patientData.admissions}
          total={admissionsTotal}
        />

        <div className="mt-8 pt-4 border-t-2">
          <div className="space-y-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount</span>
              <span className="text-gray-900">{formatCurrency(totalAmount)}</span>
            </div>
            
            <div className="flex justify-between text-lg font-semibold">
              <span>Amount Paid</span>
              <span className="text-green-600">{formatCurrency(amountPaid)}</span>
            </div>
            
            <div className="flex justify-between text-lg font-bold">
              <span>Remaining Amount</span>
              <span className="text-red-600">{formatCurrency(remainingAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}