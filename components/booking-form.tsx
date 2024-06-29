"use client";

import { useState, useEffect, use } from "react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";


import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingStartAndEnd, Employee, Service, Shift } from "@/types";
import React from "react";
import getShifts from "@/actions/get-shifts";
import getBookings from "@/actions/get-bookings";

const BookingForm: React.FC = () => {
  const { serviceId, storeId } = useParams();
  const router = useRouter();
  const customerId = localStorage.getItem("customerId") || "";
  const customerEmail = localStorage.getItem("customerEmail") || "";
  const [service, setService] = useState<Service>();
  const [employees, setEmployees] = useState<Employee[]>();
  const [employeeId, setEmployeeId] = useState("");
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shift, setShift] = useState<Shift>();
  const [date, setDate] = useState<Date>();
  let [bookingHours, setBookingHours] = useState<Date[] | undefined>();
  const [bookingStartDateAndTime, setBookingStartDateAndTime] =
    useState<String>();

  const [loading, setLoading] = useState(false);

  const toastMessage = "Booked... Confirmation has been sent to your email.";
  const action = "Book Appointment";

  const onSubmit = async () => {
    if (!employeeId) {
      toast.error("Please select a staff member.");
      return;
    }
    if (!date) {
      toast.error("Please select a date.");
      return;
    }
    if (!bookingStartDateAndTime) {
      toast.error("Please select a time.");
      return;
    }
    const startOfBooking = new Date(bookingStartDateAndTime as string); // Convert bookingStartDateAndTime to a string before assigning it to start
    const endOfBooking = new Date(
      startOfBooking.getTime() + (service?.duration ?? 0) * 60000
    );
    const data = {
      serviceId: serviceId,
      startOfBooking: startOfBooking,
      endOfBooking: endOfBooking,
      employeeId: employeeId,
      customerId: customerId,
      shiftId: shift?.id,
      email: customerEmail,
    };

    try {
      const URL=`${process.env.NEXT_PUBLIC_API_URL}/shifts`;
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json(); // Access the response data
      router.refresh();
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Depending where the app is deployed the timeZone may need to be changed.
  function formatUTCtoLocalDate(date: Date) {
    return new Date(
      date.toLocaleString("en-US", { timeZone: "America/Vancouver" })
    );
  }

  // Function called from the date disabled attribute to check if the date is the same as the employeeId.
  // If the date is the same as the employeeId then the date is NOT disabled.
  function isDateSameAsEmployeeId(date: Date, shifts: Shift[]) {
    return shifts?.some((shift) => {
      let temp = new Date(shift.startShift);
      temp.setHours(0, 0, 0, 0);
      return temp.toString() == date.toString();
    });
  }

  useEffect(() => {
    // Fetch employees and services from the API
    const employees = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/employeesStore`
        );
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };
    // Fetch the service from the API
    const service = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/services/${serviceId}`
        );
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };
    service();
    employees();
  }, []);

  useEffect(() => {
    // Fetch all shifts of employeeId from the API, and returns the shifts from today onwards, then setShifts.
    if (service && employeeId) {
      const getShiftsUE = async () => {
        try {
          const data = await getShifts({
            employeeId: employeeId,
          });
          setShifts(data);
        } catch (error) {
          console.error("There was an error!", error);
        }
      };
      getShiftsUE();
    }
  }, [employeeId]);

  useEffect(() => {
    // this useEffect is used to gather data needed for the availableSlots function,
    //  ultimately used for selecting the time of the booking
    // get the shift the user selected, and setShift
    if (service && employeeId && date) {
      const shift = shifts.find((item) => {
        let startShift = new Date(item.startShift);
        startShift.setHours(0, 0, 0, 0);
        return startShift.toString() == date.toString();
      });
      setShift(shift);

      // set the shift start and end times
      let startShift = "";
      let endShift = "";
      if (shift) {
        startShift = shift.startShift.toString();
        endShift = shift.endShift.toString();
      }

      const bookings = async () => {
        try {
          const data = await getBookings ({
            shiftId: shift?.id,
            employeeId: employeeId,
          });
          const startAndEndOfBookings: BookingStartAndEnd[] = data.map(
            (item: any) => {
              let startOfBooking = new Date(item.startOfBooking).toString();
              let endOfBooking = new Date(item.endOfBooking).toString();
              return { startOfBooking, endOfBooking };
            }
          );

          if (service?.duration == undefined) {
            return;
          }
          const availableSlots = getAvailableTimeSlots(
            startShift,
            endShift,
            startAndEndOfBookings,
            service?.duration
          );
          setBookingHours(availableSlots);
        } catch (error) {
          console.error("There was an error!", error);
        }
      };
      bookings();
    }
  }, [employeeId, date]);

  // ***************************
  function getAvailableTimeSlots(
    startTime: string,
    endTime: string,
    bookings: BookingStartAndEnd[],
    serviceDuration: number
  ): Date[] {
    const shiftStart = new Date(startTime);
    const shiftEnd = new Date(endTime);

    // Convert booking times to Date objects
    const parsedBookings = bookings.map((booking) => ({
      startOfBooking: new Date(booking.startOfBooking),
      endOfBooking: new Date(booking.endOfBooking),
    }));

    // Helper function to add minutes to a date
    function addMinutes(date: Date, minutes: number): Date {
      return new Date(date.getTime() + minutes * 60000);
    }

    // Helper function to check if a time slot overlaps with existing bookings
    function isOverlapping(start: Date, end: Date): boolean {
      return parsedBookings.some(
        (booking) =>
          (start < booking.endOfBooking && end > booking.startOfBooking) ||
          (start < booking.startOfBooking &&
            end > addMinutes(booking.startOfBooking, +serviceDuration))
      );
    }

    // Generate 15-minute intervals
    let availableSlots: Date[] = [];
    for (
      let currentTime = shiftStart;
      addMinutes(currentTime, serviceDuration) <= shiftEnd;
      currentTime = addMinutes(currentTime, 15)
    ) {
      const slotEnd = addMinutes(currentTime, serviceDuration);
      if (!isOverlapping(currentTime, slotEnd) && slotEnd <= shiftEnd) {
        availableSlots.push(new Date(currentTime));
      }
    }
    return availableSlots;
  }

  return (
    <>
      <div>
        <h2 className="mb-10 text-2xl text-center font-bold text-[#C68DBA]">
          Book Appointment
        </h2>
        <div className="md:grid md:grid-cols-2 gap-8 text-[#C68DBA]">
          {/* EMPLOYEE ID */}
          <div className="flex flex-col gap-2 my-3 md:my-0">
            <label className="text-md font-light">Book Staff</label>
            <Select
              defaultValue={employeeId}
              onValueChange={(value) => setEmployeeId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a staff to book in with" />
              </SelectTrigger>

              <SelectContent className="w-full bg-white">
                {employees?.map((item) => (
                  <SelectItem key={item.id} value={item.id} disabled={loading}>
                    {item.fName} {item.lName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* DATE PICKER */}
          <div className="flex flex-col gap-2 my-3 md:my-0">
            <label className="text-md font-light">Booking Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white h-[325px]"
                align="start"
              >
                <Calendar
                  className="overflow-hidden font-bold"
                  mode="single"
                  selected={date}
                  onSelect={(value) => {
                    setDate(value);
                    // shifts.map((item) => {
                    //   const temp = new Date(item.startShift.getDate());
                    //   if (temp.toString() === value?.getDate().toString()) {
                    //     setShift(item);
                    //   }
                    // });
                  }}
                  disabled={(date) => {
                    const currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    const maxDate = new Date();
                    maxDate.setDate(currentDate.getDate() + 60);
                    return (
                      employeeId == undefined ||
                      date < currentDate ||
                      date >= maxDate ||
                      !isDateSameAsEmployeeId(date, shifts || [])
                    );
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* START TIME */}
          <div className="flex flex-col gap-2 my-3 md:my-0">
            <label className="text-md font-light">Booking Time</label>
            <Select
              // defaultValue={startTime?.toString()}
              onValueChange={(value) => {
                setBookingStartDateAndTime(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pick an available time" />
              </SelectTrigger>
              <SelectContent className="w-[20vw] bg-white mt-1 block pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md">
                {bookingHours?.map((time) => (
                  <SelectItem
                    key={time.toString()}
                    value={time.toString()}
                    disabled={loading || !employeeId || !date}
                  >
                    {format(time, "p")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Button
            onClick={onSubmit}
            disabled={loading}
            className="py-6 mt-10 w-full md:w-[25vw] md:text-lg text-white border border-white bg-[#C68DBA] shadow-lg"
          >
            {action}
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookingForm;
