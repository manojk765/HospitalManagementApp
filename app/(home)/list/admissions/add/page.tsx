"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface Patient {
  patient_id: string
  name: string
  email: string
}

interface Room {
  id: string
  type: string
  bedNumber: string
  dailyRate: number
  available: boolean
}

interface Admission {
  patient_id: string
  room_id: string
  admittedDate: string
  dischargeDate : string
}

interface AdmissionFormData {
  patient_id: string
  room_id: string
  admittedDate: string
}

export default function AdmissionPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [admissions, setAdmissions] = useState<Admission[]>([])
  const [selectedPatient, setSelectedPatient] = useState("")
  const [selectedRoom, setSelectedRoom] = useState("")
  const [admittedDate, setAdmittedDate] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");

  // Filter patients based on search query, or return all if no query is entered
  const filteredPatients = patients.filter(
    (patient) =>
      !searchQuery ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const router = useRouter()

  useEffect(() =>{
    const today = new Date().toISOString().split('T')[0]; 
    setAdmittedDate(today); 
  },[])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null); 
      }, 3000);
      return () => clearTimeout(timer); 
    }
  }, [error]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
  
        const [patientsResponse, roomsResponse, admissionsResponse] = await Promise.all([
          fetch("/api/patient"),
          fetch("/api/rooms"),
          fetch("/api/admissions"),
        ]);
  
        if (!patientsResponse.ok || !roomsResponse.ok || !admissionsResponse.ok) {
          throw new Error("Failed to fetch data");
        }
  
        const patientsData: Patient[] = await patientsResponse.json();
        const roomsData: Room[] = await roomsResponse.json();
        const admissionsData: Admission[] = await admissionsResponse.json();
  
        const formattedPatientsData = patientsData.map((patient) => ({
          patient_id : patient.patient_id,
          name: patient.name,
          email: patient.email,
        }));
  
        const formattedRoomsData = roomsData.map((room) => ({
          id: room.id,
          type: room.type,
          bedNumber: room.bedNumber,
          dailyRate: room.dailyRate,
          available: room.available,
        }));
  
        const formattedAdmissionsData = admissionsData.map((admission) => ({
          patient_id: admission.patient_id,
          room_id: admission.room_id,
          admittedDate: admission.admittedDate,
          dischargeDate: admission.dischargeDate,
        }));
  
        setPatients(formattedPatientsData);
        setRooms(formattedRoomsData);
        setAdmissions(formattedAdmissionsData);
      } catch (err) {
        setError("Failed to load data. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const fetchUpdatedBookings = async () => {
    try{
      const admissionsResponse = await fetch("/api/admissions") ;

      const admissionsData = await admissionsResponse.json()
  
      const formattedAdmissionsData = admissionsData.map((admission: Admission) => ({
        patient_id: admission.patient_id,
        room_id: admission.room_id,
        admittedDate: admission.admittedDate,
        dischargeDate : admission.dischargeDate
      }))
  
      setAdmissions(formattedAdmissionsData)
    }catch (err) {
      setError("Failed to load data. Please try again.")
      console.error("Error fetching data:", err)
    } 
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      setError(null)

      const formData: AdmissionFormData = {
        patient_id: selectedPatient,
        room_id: selectedRoom,
        admittedDate,
      }

      const response = await fetch("/api/admissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const today = new Date().toISOString().split('T')[0]; 
        setAdmittedDate(today); 
        setSelectedPatient('');
        setSelectedRoom('') ;
        throw new Error(errorData.error || "Admission failed") 
      }

      const roomResponse = await fetch(`/api/rooms/${selectedRoom}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: false }),
      });

      if (!roomResponse.ok) {
        throw new Error('Failed to update room availability');
      }

      const today = new Date().toISOString().split('T')[0]; 
      setAdmittedDate(today); 
      setSelectedPatient('');
      setSelectedRoom('') ;
      fetchUpdatedBookings() ;
      router.push("/list/admissions/add")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admission failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmission , setEditingAdmission] = useState<Admission | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const handleEditClick = ( admission : Admission) => {
    setIsModalOpen(true)
    setEditingAdmission(admission)
  }

  const handleEdit = async ( admission : Admission | null , totalCost : number , dischargeDate : string ) => {
    if( !admission ){
      console.log("No Admission")
    }else{
      try { 
        const response = await fetch(
          `/api/admissions/update?patientId=${admission.patient_id}&roomId=${admission.room_id}&admittedDate=${admission.admittedDate}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              dischargeDate: dischargeDate,
            }),
          }
        );
        console.log(response)
      }catch(error){
        console.log(error)
      }
       
      const roomResponse = await fetch(`/api/rooms/${admission.room_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: true }),
      });

      if (!roomResponse.ok) {
        throw new Error('Failed to update room availability');
      }

      const totalDays = Math.ceil(
        (new Date(dischargeDate).getTime() -
          new Date(admission.admittedDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

      try {
        const response = await fetch('/api/admission-fee', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patient_id: admission.patient_id,
            room_id: admission.room_id,
            admittedDate: admission.admittedDate,
            dischargeDate: dischargeDate,
            totalDays,
            totalCost,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to create admission fee');
        }
    
        const newAdmissionFee = await response.json();
        console.log('Admission fee added successfully:', newAdmissionFee);
      } catch (error) {
        console.error('Error saving admission fee:', error);
      }

    }

    await fetchUpdatedBookings() ;
    
  };
  
  // Modal 

  const handleClose = () => {
    setIsModalOpen(false);  
    setEditingAdmission(null); 
  };

  const handleSave = (updatedAdmission: Admission , totalCost: number , dischargeDate : string ) => {
    setEditingAdmission(updatedAdmission);
    handleEdit(editingAdmission , totalCost , dischargeDate);
  };
  
  const Modal = ({
    isOpen,
    onClose,
    admission,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    admission: Admission | null;
    onSave: (updatedAdmission: Admission, totalCost: number , dischargeDate : string ) => void;
  }) => {
    const [totalCost, setTotalCost] = useState(0);
    const [canEditTotalCost, setCanEditTotalCost] = useState(false);
    const [dischargeDate, setDischargeDate] = useState('');
    const [totalDays, setTotalDays] = useState(0);
  
    useEffect(() => {
      if (admission && admission.dischargeDate) {
        setDischargeDate(admission.dischargeDate);
      }
    }, [admission]);
  
    // Update total days when discharge date changes
    useEffect(() => {
      if (admission && dischargeDate) {
        const admittedDate = new Date(admission.admittedDate);
        const discharge = new Date(dischargeDate);
        const days = Math.ceil((discharge.getTime() - admittedDate.getTime()) / (1000 * 60 * 60 * 24)) ;
        setTotalDays(days);
  
        // If room exists, update total cost based on daily rate
        const room = rooms.find((r) => r.id === admission?.room_id);
        if (room) {
          setTotalCost(days * room.dailyRate);
        }
      }
    }, [admission, dischargeDate]);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
  
      if (admission) {
        const updatedAdmission = { ...admission, dischargeDate };
  
        onSave(updatedAdmission, totalCost, dischargeDate);
      }
  
      onClose();
    };
  
    const handleDischargeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDischargeDate(e.target.value);
    };
  
    if (!isOpen) return null;
  
    const room = rooms.find((r) => r.id === admission?.room_id);
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-4">Edit Admission</h2>
  
            {/* Patient ID */}
            <label className="block font-medium mb-1">Patient Id</label>
            <input
              value={admission?.patient_id || ''}
              disabled
              className="block w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
  
            {/* Room */}
            <label className="block font-medium mb-1">Room</label>
            <input
              value={`${room?.type || ''}-${room?.bedNumber || ''}`}
              disabled
              className="block w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
  
            {/* Admitted Date */}
            <label className="block font-medium mb-1">Admitted Date</label>
            <input
              type="date"
              value={admission ? new Date(admission.admittedDate).toISOString().split('T')[0] : ''}
              disabled
              className="block w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
  
            {/* Discharge Date */}
            <label className="block font-medium mb-1">Discharge Date</label>
            <input
              type="date"
              value={dischargeDate}
              onChange={handleDischargeDateChange}
              required
              min={admission?.admittedDate?.toString().split('T')[0]}
              className="block w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
  
            
            {dischargeDate && (
              <>
                <label className="block font-medium mb-1">Total Days</label>
                <input
                  value={totalDays}
                  disabled
                  className="block w-full p-2 border border-gray-300 rounded-lg mb-4"
                />
              </>
            )}
  
            {dischargeDate && (
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="number"
                  id="totalCost"
                  value={totalCost}
                  onChange={(e) => setTotalCost(Number(e.target.value))}
                  disabled={!canEditTotalCost}
                  className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                />
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    canEditTotalCost
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setCanEditTotalCost(!canEditTotalCost)}
                >
                  {canEditTotalCost ? 'Lock' : 'Edit'}
                </button>
              </div>
            )}
  
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">New Patient Admission</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 mb-8">
        <div>
          {/* Search Input */}
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Patient:
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient ID or name"
            className="w-full p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Select Dropdown */}
          <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-2">
            Select Patient:
          </label>
          <select
            id="patient"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a patient</option>
            {filteredPatients.map((patient) => (
              <option key={patient.patient_id} value={patient.patient_id}>
                {patient.patient_id} - {patient.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-2">
            Select Room/Bed:
          </label>
          <select
            id="room"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a room/bed</option>
            {rooms
              .filter((room) => room.available)
              .map((room) => (
                <option key={room.id} value={room.id}>
                  {room.type} - {room.bedNumber} (${room.dailyRate}/day)
                </option>
              ))}
          </select>
        </div>

        <div>
          <label htmlFor="admittedDate" className="block text-sm font-medium text-gray-700 mb-2">
            Admitted Date:
          </label>
          <input
            type="date"
            id="admittedDate"
            value={admittedDate}
            onChange={(e) => setAdmittedDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
            ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? "Admitting Patient..." : "Admit Patient"}
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Current Admissions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-100 border-b">Patient</th>
              <th className="px-4 py-2 bg-gray-100 border-b">Room</th>
              <th className="px-4 py-2 bg-gray-100 border-b">Admitted Date</th>
              <th className="px-4 py-2 bg-gray-100 border-b">Discharged Date</th>
              <th className="px-4 py-2 bg-gray-100 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions
              .filter((admission) => admission.dischargeDate === null)
              .map((admission) => {
                const patient = patients.find((p) => p.patient_id === admission.patient_id);
                const room = rooms.find((r) => r.id === admission.room_id);
                return (
                  <tr key={admission.patient_id}>
                    <td className="px-4 py-2 border-b">{patient ? patient.name : "Unknown"}</td>
                    <td className="px-4 py-2 border-b">
                      {room ? `${room.type} - ${room.bedNumber}` : "Unknown"}
                    </td>
                    <td className="px-4 py-2 border-b">{formatDate(admission.admittedDate)}</td>
                    <td className="px-4 py-2 border-b">Not Discharged</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="text-white bg-blue-500 rounded-lg px-2 py-1 m-2"
                        onClick={() => handleEditClick(admission)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
        </table>
        
        
      </div>

      {editingAdmission && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleClose}
          admission ={ editingAdmission }
          onSave={handleSave}  
        />
      )}
    </div>
  )
}

