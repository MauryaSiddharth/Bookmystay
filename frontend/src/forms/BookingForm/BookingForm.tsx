import { useForm } from "react-hook-form";
import type { PaymentIntentResponse, UserType } from "../../../../backend/src/shared/types";
import * as apiClient from "../../api-client";
import { useMutation } from "@tanstack/react-query";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

type Props = {
  currentUser: UserType;
  hotelId: string;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  totalCost: number;
  paymentIntent: PaymentIntentResponse;
};

type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
};

const BookingForm = ({
  currentUser,
  hotelId,
  checkIn,
  checkOut,
  adultCount,
  childCount,
  totalCost,
  paymentIntent,
}: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: apiClient.createRoomBooking,
    onSuccess: () => {
      showToast({ message: "Booking confirmed!", type: "SUCCESS" });
      navigate("/my-bookings");
    },
    onError: (err: any) => {
      showToast({ message: err.message || "Error saving booking", type: "ERROR" });
    },
  });

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstname,
      lastName: currentUser.lastname,
      email: currentUser.email,
    },
  });

  const onSubmit = async (formData: BookingFormData) => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        },
      },
    });

    if (result.error) {
      setCardError(result.error.message || "Payment failed. Please check your card details.");
      setIsProcessing(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      mutate({
        hotelId,
        bookingData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          adultCount,
          childCount,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          totalCost,
          paymentIntentId: result.paymentIntent.id,
        },
      });
    } else {
      setCardError("Payment was not completed successfully.");
    }
    
    setIsProcessing(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        color: "#1f2937",
        fontSize: "16px",
        fontFamily: "Inter, system-ui, sans-serif",
        "::placeholder": {
          color: "#9ca3af",
        },
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
    hidePostalCode: true,
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5 shadow-sm bg-white"
    >
      <span className="text-3xl font-bold text-gray-800">
        Confirm Your Details
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex flex-col gap-1">
          First Name
          <input
            className="border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 font-normal outline-none focus:border-blue-500"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>

        <label className="text-gray-700 text-sm font-bold flex flex-col gap-1">
          Last Name
          <input
            className="border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 font-normal outline-none focus:border-blue-500"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>

        <label className="text-gray-700 text-sm font-bold flex flex-col gap-1 md:col-span-2">
          Email
          <input
            className="border rounded w-full py-2 px-3 text-gray-700 bg-gray-100 font-normal outline-none focus:border-blue-500"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <h3 className="text-xl font-bold text-gray-800">Your Price Summary</h3>
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
          <div className="text-2xl font-extrabold text-blue-900">
            Total Cost: ₹{paymentIntent.totalCost.toFixed(2)}
          </div>
          <div className="text-xs text-blue-800 mt-1">
            Includes taxes and charges
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <h3 className="text-xl font-bold text-gray-800">Payment Details</h3>
        <div className="border rounded-md border-slate-300 p-3 bg-white focus-within:border-blue-500 transition duration-200">
          <CardElement id="payment-element" options={cardElementOptions} />
        </div>
        {cardError && (
          <span className="text-red-500 text-sm font-semibold mt-1">
            {cardError}
          </span>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          disabled={isPending || isProcessing || !stripe || !elements}
          className="bg-blue-600 text-white py-3 px-6 font-bold hover:bg-blue-700 rounded-md transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg shadow-md cursor-pointer"
        >
          {isPending || isProcessing ? "Confirming Booking..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;