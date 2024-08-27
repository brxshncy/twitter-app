import React from "react";

interface IAuthLayout {
    children: React.ReactNode;
}
const AuthLayout = ({ children }: IAuthLayout) => {
    return (
        <div className='container mx-auto min-h-screen w-full flex items-center'>
            {children}
        </div>
    );
};

export default AuthLayout;
