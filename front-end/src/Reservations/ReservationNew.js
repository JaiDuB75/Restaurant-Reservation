import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";
//import { hasValidDateAndTime } from "./ReservationValidate";

export const ReservationNew = () => {
  const initialReservationState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [reservation, setReservation] = useState({
    ...initialReservationState,
  });
  const [reservationErrors, setReservationErrors] = useState(false);
  const history = useHistory();

  const changeHandler = (event) => {
    if (event.target.name === "people") {
      setReservation({
        ...reservation,
        [event.target.name]: Number(event.target.value),
      });
    } else {
      setReservation({
        ...reservation,
        [event.target.name]: event.target.value,
      });
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await createReservation(reservation, abortController.signal);
      history.push(`/dashboard?date=${reservation.reservation_date}`);
    } catch (error) {
      setReservationErrors(error);
    }
    return () => abortController.abort();
  };

  return (
    <section>
      <h2>Create a Reservation:</h2>
      <ErrorAlert error={reservationErrors} />
      <ReservationForm
        reservation={reservation}
        changeHandler={changeHandler}
        submitHandler={submitHandler}
      />
    </section>
  );
};

export default ReservationNew;