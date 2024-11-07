"use client"

import { Input } from "@/components/ui/input";
import { OfferCreate } from "../interfaces/oferta";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type newOfferProps = {
    idPregunta?: number;
    updateQuestions: () => void;
}

const apiUrl = process.env.BACKEN_API;

const FormOferta: React.FC<newOfferProps> = ({idPregunta, updateQuestions}) => {

    const {register, handleSubmit, reset} = useForm<OfferCreate>();
    const router = useRouter();

    const alertOfferDuplicade = () => {
        toast.warning("Ya se envió una oferta para esta pregunta.", {
            position: "top-right"
        });
    }

    const alertOfferSuccess = () => {
        toast.success("Oferta enviada con éxito", {
            position: "top-right"
        });
    }

    const onSubmit: SubmitHandler<OfferCreate> = async (data) => {
        const defaultOfferState = 1;

        const offer = {
            idPregunta: idPregunta,
            idEstadoOferta : defaultOfferState,
            descripcion: data.descripcion,
            fechaOferta: new Date()
        }

        const accessToken = sessionStorage.getItem('access_token');
        if(!accessToken){
            console.error("Token no encontrado");
            return
        }

        try {
            const res = await fetch(`${apiUrl}/user/pregunta/send-offer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(offer)
            });

            if (!res.ok) {
                const errorData = await res.json();
        
                if (res.status === 409) {
                    alertOfferDuplicade();
                    reset();
                    return
                } else {
                    alert("Ocurrio un error inesperado, intentalo mas tarde")
                }
        
                return;
            }

            reset();
            alertOfferSuccess();
            updateQuestions();
        } catch (error) {
            
        }

        console.log(offer);
    }

    return(
        <>
            <form className="flex" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    className="mr-2"
                    placeholder="Descripcion"
                    {...register("descripcion",{required: true})}
                ></Input>
                <Button className="bg-blue-500 hover:bg-blue-600">Enviar oferta</Button>
            </form>
        </>
    )
}

export default FormOferta;