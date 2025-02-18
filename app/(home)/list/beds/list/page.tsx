import prisma from "@/lib/prisma"

export default async function RoomsPage() {
  const rooms = await prisma.beds.findMany()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Available Rooms/Beds</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room: any ) => (
          <div key={room.id} className="bg-gray-100 p-4 rounded">
            <p className="font-semibold">{room.type}</p>
            <p className="text-gray-600">Bed Number: {room.bedNumber}</p>
            <p className="text-gray-600">Daily Rate: ₹{room.dailyRate.toString()}</p>
            <p className={room.available ? "text-green-600" : "text-red-600"}>
              {room.available ? "Available" : "Occupied"}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

