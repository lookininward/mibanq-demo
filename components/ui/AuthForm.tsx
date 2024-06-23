'use client';

import Image from "next/image"
import Link from "next/link"
import { useState } from "react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/lib/actions/user.actions";
import PlaidLink from "./PlaidLink";

function AuthForm({ type }: AuthFormProps) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            if (type === 'sign-up') {
                // Sign up with Appwrite
                const userData = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    address1: data.address1!,
                    city: data.city!,
                    state: data.state!,
                    postalCode: data.postalCode!,
                    dateOfBirth: data.dateOfBirth!,
                    ssn: data.ssn!,
                    email: data.email,
                    password: data.password,
                }
                const newUser = await signUp(userData);
                debugger;
                setUser(newUser);
            }

            if (type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password,
                });

                if (response) {
                    router.push('/');
                }
            }

        } catch (error) {
        } finally {
            setIsLoading(false);

        }

    }
    return (
        <section className="auth-form">
            <header className="flex flex-col gap-4 md:gap-8">
                <Link href='/' className='cursor-pointer flex  items-center gap-1 padding-x-4'>
                    <Image src='/icons/logo.svg' width={34} height={34} alt='Logo' />
                    <h1 className='text-26 font-ibm-plex-serif font-bold text-black-1 ml-1'>MiBanq</h1>
                </Link>

                <div className="flex flex-col gap-1 md:gap-2">
                    <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
                        {user ? 'Link Account' : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                        <p className="text-16 font-normal text-gray-600">
                            {user ? 'Link your account to continue' : 'Enter your details below to get started'}
                        </p>
                    </h1>
                </div>
            </header>

            {user ? (
                <div className="flex flex-col gap-4">
                    <PlaidLink user={user} variant="primary" />
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {type === 'sign-up' && (
                                <>
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="firstName"
                                            label="First Name"
                                            placeholder="Enter your first name"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="lastName"
                                            label="Last Name"
                                            placeholder="Enter your last name"
                                        />
                                    </div>

                                    <CustomInput
                                        control={form.control}
                                        name="address1"
                                        label="Address"
                                        placeholder="Enter your address"
                                    />
                                    <CustomInput
                                        control={form.control}
                                        name="city"
                                        label="City"
                                        placeholder="Enter your city"
                                    />
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="state"
                                            label="State"
                                            placeholder="Enter your state"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="postalCode"
                                            label="Postal Code"
                                            placeholder="Enter your postal code"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="dateOfBirth"
                                            label="Date of Birth"
                                            placeholder="YYYY-MM-DD"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="ssn"
                                            label="SSN"
                                            placeholder="Enter your SSN"
                                        />
                                    </div>
                                </>
                            )}

                            <CustomInput
                                control={form.control}
                                name="email"
                                label="Email"
                                placeholder="Enter your email"
                            />
                            <CustomInput
                                control={form.control}
                                name="password"
                                label="Password"
                                placeholder="Enter your password"
                            />
                            <div className="flex flex-col gap-4">
                                <Button
                                    type="submit"
                                    className="form-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2
                                                size={24}
                                                className="animate-spin"
                                            />
                                            &nbsp; Loading...
                                        </>
                                    ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                                </Button>
                            </div>
                        </form>
                    </Form>

                    <footer className="flex justify-center gap-1">
                        <p className="text-14 font-normal text-gray-600">
                            {type === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}
                        </p>
                        <Link
                            href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
                            className="form-link"
                        >
                            {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
                        </Link>
                    </footer>
                </>
            )}
        </section>
    )
}

export default AuthForm