import React, {useEffect, useState} from "react";
import {useParams, useHistory} from "react-router";
import {getReservation, updateReservation} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationLayout from "../Reservations/ReservationLayout";

function EditReservation(){
    const {reservation_id} = useParams();
    const [currentReservation, setCurrentReservation] = useState({reservation_id});
    const [error, setError] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const abortController = new AbortController();
        setError(null);
        async function loadReservation(){
            try{
                let selectedReservation = await getReservation(reservation_id);
                setCurrentReservation({
                    ...returnedReservation,
                    people: Number(selectedReservation.people),
                });
            }catch(error){
                setError(error);
            }
        }
        loadReservation();
        return () => abortController.abort();
    }, [reservation_id]);

    const onChange = ({target}) => {
        setCurrentReservation({
            ...currentReservation,
            [target.name]: target.value,
        })
    }

    const onSubmit = async (event) => {
        const abortController = new AbortController();
        event.preventDefault();
        await updateReservation({
            ...currentReservation,
            people: Number(currentReservation.people),
        })
        .then((response) => {
            setCurrentReservation({...response});
            history.push(`/dashboard?date=${currentReservation.reservation_date}`);
        })
        .catch(setError);
        return () => abortController.abort();
    }

    return(
        <>
            <ErrorAlert error={error}/>
            <ReservationLayout
                history={history}
                reservation={currentReservation}
                onChange={onChange}
                onSubmit={onSubmit}
            />
        </>
    )
}

export default EditReservation;