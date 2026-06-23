import { useQuery } from '@tanstack/react-query';
import * as apiClient from '../api-client';
import BookingForm from '../forms/BookingForm/BookingForm';
import { useParams } from 'react-router-dom';
import { useSearchContext } from '../contexts/SearchContext';
import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useAppContext } from '../contexts/AppContext';

const Booking = () => {
  const { stripePromise } = useAppContext();
  const { hotelId } = useParams();
  const search = useSearchContext();

  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const checkInDate = new Date(search.checkIn);
      const checkOutDate = new Date(search.checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (nights <= 0) {
        nights = 1;
      }
      setNumberOfNights(nights);
    }
  }, [search.checkIn, search.checkOut]);

  const { data: paymentIntentData, error: paymentIntentError } = useQuery({
    queryKey: ["createPaymentIntent", hotelId, numberOfNights],
    queryFn: () =>
      apiClient.createPaymentIntent(
        hotelId as string,
        numberOfNights.toString()
      ),
    enabled: !!hotelId && numberOfNights > 0,
  });

  const {
    data: currentUser,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["fetchCurrentUser"],
    queryFn: apiClient.fetchCurrentUser,
  });

  const {
    data: hotel,
    isLoading: isHotelLoading,
    error: hotelError,
  } = useQuery({
    queryKey: ["fetchHotelById", hotelId],
    queryFn: () => apiClient.fetchHotelById(hotelId || ""),
    enabled: !!hotelId,
  });

  if (isUserLoading || isHotelLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (userError || hotelError || paymentIntentError) {
    return (
      <div className="text-center py-10 text-red-500 font-bold text-xl flex flex-col gap-3 max-w-xl mx-auto p-4 bg-red-50 rounded-lg border border-red-200 my-8">
        <p>Error loading booking page details:</p>
        <p className="text-sm font-normal text-gray-600">
          {(userError as any)?.message || (hotelError as any)?.message || (paymentIntentError as any)?.message || "Unknown error"}
        </p>
      </div>
    );
  }

  if (!hotel) {
    return <div className="text-center py-10 text-red-500 font-bold text-xl">Hotel not found</div>;
  }

  const totalCost = numberOfNights * hotel.pricePerNight;

  return (
    <div className="grid md:grid-cols-[1fr_2fr] gap-8 max-w-6xl mx-auto p-4 md:p-6 ">
      {/* Booking Details Summary */}
      <div className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm h-fit flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
          Your Booking Details
        </h2>
        
        <div>
          <span className="text-sm text-gray-500 block mb-1">
            Location:
          </span>
          <p className="font-bold text-gray-800">
            {hotel.name}, {hotel.city}, {hotel.country}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <span className="text-sm text-gray-500 block mb-1">Check-in</span>
            <p className="font-bold text-gray-800">
              {new Date(search.checkIn).toDateString()}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500 block mb-1">Check-out</span>
            <p className="font-bold text-gray-800">
              {new Date(search.checkOut).toDateString()}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <span className="text-sm text-gray-500 block mb-1">Total length of stay:</span>
          <p className="font-bold text-gray-800">{numberOfNights} nights</p>
        </div>

        <div className="border-t pt-4">
          <span className="text-sm text-gray-500 block mb-1">Guests</span>
          <p className="font-bold text-gray-800">
            {search.adultCount} adults & {search.childCount} Children
          </p>
        </div>
      </div>

      {/* Confirmation Form */}
      {currentUser && paymentIntentData && (
        <Elements stripe={stripePromise} options={{
          clientSecret: paymentIntentData.clientSecret
        }}>
          <BookingForm
            currentUser={currentUser}
            hotelId={hotel._id}
            checkIn={search.checkIn}
            checkOut={search.checkOut}
            adultCount={search.adultCount}
            childCount={search.childCount}
            totalCost={totalCost}
            paymentIntent={paymentIntentData}
          />
        </Elements>
      )}
    </div>
  );
};

export default Booking;
