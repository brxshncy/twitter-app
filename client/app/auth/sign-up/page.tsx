import SignupForm from "@/components/forms/SignupForm";
import { Button } from "@/components/ui/button";
import React from "react";

const SignUpPage = () => {
    return (
        <main className='text-white  min-h-[400px]  min-w-[600px] border-gray-50 rounded-md mx-auto  flex flex-col items-center bg-primary px-3 pt-5'>
            <h1 className='text-2xl'>Create your account</h1>
            <SignupForm />
        </main>
    );
};

export default SignUpPage;
