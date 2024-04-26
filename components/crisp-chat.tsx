"use client"

import { useEffect } from "react"
import {Crisp} from "crisp-sdk-web"; 

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("450e9ccf-ee7b-45fa-8859-53613104c9fa");
    }, [])
    return null; 
}