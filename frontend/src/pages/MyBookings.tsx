import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-client";
import { BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiCalendar } from "react-icons/bi";

const MyBookings = () => {
  const {
    data: hotels,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["fetchMyBookings"],
    queryFn: apiClient.fetchMyBookings,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500 font-bold text-xl">
        Error fetching bookings. Please try again.
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm max-w-2xl mx-auto my-8">
        <BiHotel className="mx-auto text-6xl text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Bookings Found</h2>
        <p className="text-gray-500 mb-6">You haven't booked any stays yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>

      <div className="grid grid-cols-1 gap-8">
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            className="grid grid-cols-1 md:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-6 gap-6 bg-white shadow-sm hover:shadow-md transition duration-200"
          >
            {/* Hotel Image Section */}
            <div className="w-full h-[200px] md:h-full overflow-hidden rounded-md">
              <img
                src={hotel.imageUrls[0]}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Hotel & Bookings Details */}
            <div className="flex flex-col justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{hotel.name}</h2>
                <div className="flex items-center text-gray-500 mt-1">
                  <BsMap className="mr-1" />
                  <span className="text-sm">
                    {hotel.city}, {hotel.country}
                  </span>
                </div>
              </div>

              {/* Individual Bookings Sub-list */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Your Reservations
                </span>
                {hotel.bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="border border-slate-200 rounded-md p-4 bg-slate-50 grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                  >
                    <div className="flex items-center gap-2">
                      <BiCalendar className="text-blue-600 text-lg flex-shrink-0" />
                      <div>
                        <span className="text-xs text-gray-500 block">Dates</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {new Date(booking.checkIn).toDateString()} -{" "}
                          {new Date(booking.checkOut).toDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <BiHotel className="text-blue-600 text-lg flex-shrink-0" />
                      <div>
                        <span className="text-xs text-gray-500 block">Guests</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {booking.adultCount} adults, {booking.childCount} children
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 md:justify-end">
                      <BiMoney className="text-blue-600 text-lg flex-shrink-0" />
                      <div>
                        <span className="text-xs text-gray-500 block">Amount Paid</span>
                        <span className="text-lg font-bold text-blue-900">
                          ₹{booking.totalCost}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;

