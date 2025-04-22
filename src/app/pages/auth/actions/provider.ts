"use client"


import { signIn } from "@/src/auth";
import { CredentialsSignin } from "next-auth";


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const ProviderLoginSignUp = (provider: string) => {


    console.log("1");
    console.log("provider: " + provider);

    try {
        console.log("2");
        signIn(provider);
        console.log("3");
    } catch (error) {
        const err = error as CredentialsSignin;
        return err.cause;
    }


};


export default ProviderLoginSignUp;