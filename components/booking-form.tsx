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
import { Booking, Employee, Service, Shift } from "@/types";
import React from "react";


const BookingForm: React.FC = () => {
  const { serviceId, storeId } = useParams();
  const router = useRouter();
  const customerId = localStorage.getItem("customerId") || "";
  const [service, setService] = useState<Service>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shift, setShift] = useState<Shift>();
  const [date, setDate] = useState<Date>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  let [bookingHours, setBookingHours] = useState<Date[] | undefined>([]);
  const [shiftStart, setShiftStart] = useState<Date>();
  const [shiftEnd, setShiftEnd] = useState<Date>();
  const [bookingTimes, setBookingTimes] = useState<Date[]>();
  const [startTime, setStartTime] = useState<Number>();

  const [loading, setLoading] = useState(false);

  const bookingToastMessage = "Booking created.";
  const bookingAction = "Book Appointment";

  const onSubmit = async () => {
    const data = {
      serviceId: serviceId,
      date: date,
      startTime: startTime,
      employeeId: employeeId,
      customerId: customerId,
      shiftId: shift?.id,
    };
    console.log("DATA: ", data);
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookingsStorePost`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json(); // Access the response data
      // router.refresh();
      // router.push(`/${params.storeId}/bookings`);
      toast.success(bookingToastMessage);
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
    // console.log("SHIFT.DATE: ", typeof(shifts[2]?.date), "- DATE: ", typeof(date));
    return shifts?.some((shift) => {
      return shift.date.toString() == date.toString();
    });
  }

  useEffect(() => {
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
    if (employeeId) {
      const shifts = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/shiftsStore`,
            {
              method: "POST",
              body: JSON.stringify({ employeeId: employeeId }),
            }
          );
          const data = await response.json();
          data.forEach((item: any) => {
            item.date = formatUTCtoLocalDate(item.date);
          });
          setShifts(data);
        } catch (error) {
          console.error("There was an error!", error);
        }
      };
      shifts();
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeId && date && shift) {
      const shifts = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/bookingsStoreGet`,
            {
              method: "POST",
              body: JSON.stringify({
                shiftId: shift.id,
                employeeId: employeeId,
              }),
            }
          );
          const data = await response.json();
          data.forEach((item: any) => {
            item.date = new Date(
              date.toLocaleString("en-US", { timeZone: "America/Vancouver" })
            );
          });
          setBookings(data);

          const shiftStart = new Date(shift.date);
          shiftStart.setHours(
            Math.floor(shift.startTime / 100),
            shift.startTime % 100
          );
          setShiftStart(shiftStart);

          const shiftEnd = new Date(shift.date);
          shiftEnd.setHours(
            Math.floor(shift.endTime / 100),
            shift.endTime % 100
          );
          setShiftEnd(shiftEnd);
          let bookingTimes: Date[] = data.map((item: any) => {
            let date = new Date(item.date);
            date.setHours(
              Math.floor(item.startTime / 100),
              item.startTime % 100
            );
            return date;
          });
          setBookingTimes(bookingTimes);
          setBookingHours(
            getAvailableBookingTimes(shiftStart, shiftEnd, bookingTimes)
          );
        } catch (error) {
          console.error("There was an error!", error);
        }
      };
      shifts();
    }
  }, [date]);

  function getAvailableBookingTimes(
    shiftStart: Date,
    shiftEnd: Date,
    bookedTimes: Date[]
  ): Date[] {
    const availableTimes: Date[] = [];
    const interval = 15 * 60 * 1000; // 15 minutes in milliseconds
    let appointmentDuration = service?.duration;
    if (!appointmentDuration) {
      return [];
    }
    appointmentDuration = appointmentDuration * 60 * 1000;
    for (
      let time = new Date(shiftStart.getTime());
      time.getTime() + appointmentDuration <= shiftEnd.getTime();
      time.setTime(time.getTime() + interval)
    ) {
      const appointmentEnd = new Date(time.getTime() + appointmentDuration);

      const isBooked = bookedTimes.some((bookedTime) => {
        const bookedEnd = new Date(bookedTime.getTime() + appointmentDuration);
        return time < bookedEnd && appointmentEnd > bookedTime;
      });

      if (!isBooked) {
        availableTimes.push(new Date(time.getTime()));
      }
    }
    return availableTimes;
  }

  function formatTime(dateString: string): number {
    const date: Date = new Date(dateString);
    let hours: number = date.getHours();
    let minutes: number = date.getMinutes();
    const formattedTime: string = `${hours}${
      minutes < 10 ? "0" : ""
    }${minutes}`;

    return parseInt(formattedTime, 10);
  }
  return (
    <>
      <div>
        <h2 className="mb-10 text-2xl text-center font-bold text-gray-800">
          Book
        </h2>
        <div className="md:grid md:grid-cols-2 gap-8">
          {/* EMPLOYEE ID */}
          <div className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
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
                    shifts.forEach((item) => {
                      if (item.date.toString() === value?.toString()) {
                        setShift(item);
                      }
                    });
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
          <div className="flex flex-col gap-2">
            <label className="text-md font-light">Booking Time</label>
            <Select
              defaultValue={startTime?.toString()}
              onValueChange={(value) => {
                setStartTime(formatTime(value));
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
                    disabled={loading || !employeeId || !date || !shift}
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
            disabled={loading || !employeeId || !date || !shift || !startTime}
            className="py-6 mt-10 w-[20vw] md:text-lg text-white bg-slate-700 shadow-lg"
          >
            {bookingAction}
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookingForm;
