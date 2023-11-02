import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import {updateReservationsStatus, listTables} from "../utils/api";

function CancelReservations({res}){
    const [reservation, setReservation] = useState(res);
    const [error, setError] = useState(null);
    const history = useHistory();

    let reservation_id = res.reservation_id;

    useEffect(() => {
        event.preventDefault();

        const abortController = new AbortController();

        setError(null);

        if(window.confirm(`Please confrim that you want to cancel your reservation.`)){
            updateReservationsStatus({status: "cancelled"}, res.reservation_id, abortController.signal)
                .then(() => {
                    listTables();
                    window.location.reload();
                })
                .catch(setError);
        }
    })

    return(
        <>
            <ErrorAlert error={error}/>
            <tr>
                <th scope="row">{reservation.reservation_id}</th>
                <td>{reservation.first_name}</td>
                <td>{reservation.last_name}</td>
                <td>{reservation.people}</td>
                <td>{reservation.mobile_number}</td>
                <td>{reservation.reservation_date}</td>
                <td>{reservation.reservation_time}</td>
                <td data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>
                <td>
                    {reservation.status === "booked" ? (
                    <a
                    href={`/reservations/${reservation_id}/seat`}
                    className="btn btn-primary"
                    >
                    Seat
                    </a>
                    ) : (
                        <></>
                    )}
                </td>
                <td>
                {reservation.status === "booked" ? (
                        <a
                        href={`/reservations/${reservation_id}/edit`}
                        className="btn btn-secondary"
                        >
                        Edit
                        </a>
                    ) : (
                        <></>
                    )}
                </td>
                <td data-reservation-id-cancel={reservation.reservation_id}>
                    {reservation.status === "booked" ? (
                    <a className="btn btn-danger" onClick={handleCancelRes}>
                    Cancel
                        </a>
                    ) : (
                        <></>
                    )}
                </td>
            </tr>
        </>
    )
}

export default CancelReservations;