import React from "react";
import BookingForm from "./booking-form";
import getEmployees from "@/actions/get-employees";
import getShifts from "@/actions/get-shifts";
import getService from "@/actions/get-service";

export default async function Booking() {
  const employees = await getEmployees();
  const shifts = await getShifts();

  return (
    <>
      <div className="mx-auto mb-10 text-2xl font-bold">BOOKING</div>
      <BookingForm employees={employees} shifts={shifts} />
    </>
  );
}
