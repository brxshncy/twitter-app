"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { registerUser } from "@/app/actions/auth.action";

interface ISignupForm {
    name: "email" | "username" | "name" | "password" | "confirm_password";
    label: string;
    placeholder: string;
    type: string;
}
const SignupForm = () => {
    const initialState = {
        data: "",
    };

    const signupFormSchema = z
        .object({
            email: z.string().email({ message: "Invalid email address" }),
            username: z.string().min(1, { message: "Username is required" }),
            name: z.string().min(1, { message: "Name is required" }),
            password: z.string(),
            confirm_password: z.string(),
        })
        .refine((data) => data.password === data.confirm_password, {
            message: "Password don't match",
            path: ["confirm_password"],
        });

    const form = useForm<z.infer<typeof signupFormSchema>>({
        resolver: zodResolver(signupFormSchema),
    });

    const onSubmit = async (values: z.infer<typeof signupFormSchema>) => {
        await registerUser(values);
    };

    const signupForm: ISignupForm[] = [
        {
            name: "email",
            label: "Email",
            placeholder: "Email",
            type: "text",
        },
        {
            name: "username",
            label: "User Name",
            placeholder: "User Name",
            type: "text",
        },
        {
            name: "name",
            label: "Name",
            placeholder: "Name",
            type: "text",
        },
        {
            name: "password",
            label: "Password",
            placeholder: "Password",
            type: "password",
        },
        {
            name: "confirm_password",
            label: "Confirm Password",
            placeholder: "Confirm Password",
            type: "password",
        },
    ];

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col gap-2 w-full max-w-[600px] p-5'
            >
                {signupForm.map((obj) => {
                    return (
                        <FormField
                            control={form.control}
                            name={obj.name}
                            key={obj.name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{obj.label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={obj.placeholder}
                                            {...field}
                                            type={obj.type}
                                            className='appearance-none border outline-none focus:ring-0 focus-visible:ring-0 focus:outline-none border-gray-300 bg-transparent p-2 w-full focus:border-blue-500 rounded-md'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    );
                })}
                <Button
                    className='bg-blue-500 text-white rounded-lg     active:bg-blue-400 hover:bg-blue-400'
                    type='submit'
                >
                    Submit
                </Button>
            </form>
        </Form>
    );
};

export default SignupForm;
