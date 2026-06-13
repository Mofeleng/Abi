
"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {zodResolver} from "@hookform/resolvers/zod"
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { AuthCardSeparator } from "../components/auth-card-separator";
import { SocialSignOnButtons } from "../components/social-sign-on-buttons";
import { signInDto, SignInDto } from "../../dtos/sign-in-dto";
import { useState } from "react";
import { LoaderIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SignInView() {
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const router = useRouter();

    const form = useForm<SignInDto>({
        resolver: zodResolver(signInDto),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async ({ email, password }: SignInDto) => {
        await authClient.signIn.email({
            email,
            password,
            callbackURL: "/dashboard"
        }, {
            onRequest: () => {
                setIsLoading(true);
            },
            onSuccess: () => {
                router.push("/dashboard")
                setIsLoading(false);
            },
            onError: (err) => {
                setIsLoading(false);
                toast.error(err.error.message);
            },
            
        })
    }

    return (
        <Card className="max-w-105 w-full mx-auto">
            <CardHeader>
                <CardTitle>
                    Welcome back
                </CardTitle>
                <CardDescription>Sign in to continue analysing data with world class pipelines</CardDescription>
            </CardHeader>
            <CardContent>
                <Separator className="mb-6"/>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                     <Controller
                        name="email"
                        control={form.control}
                        render={ ( { field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="email">
                                    Email address
                                </FieldLabel>
                                <Input
                                    {...field}
                                    type="email"
                                    id="email"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="johndoe@example.com"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>    
                        )}
                    />

                     <Controller
                        name="password"
                        control={form.control}
                        render={ ( { field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="password">
                                    Create Password
                                </FieldLabel>
                                <Input
                                    {...field}
                                    type="password"
                                    id="password"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="********"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>    
                        )}
                    />

                        <Button
                            type="submit"
                            className="w-full flex flex-row gap-1 items-center"
                            disabled={isLoading}
                        >
                            {
                                isLoading ? (
                                    <>
                                        <LoaderIcon className="animate-spin" />
                                        Signing you in
                                    </>
                                ) : (
                                    <>Sign in</>
                                )
                            }
                        </Button>
                        <div className="w-full text-center">
                            <span> New to Abi? <Link href="/auth/sign-up" className="hover:text-primary hover:underline">Sign up</Link></span>
                        </div>
                </form>
                <AuthCardSeparator />
                <SocialSignOnButtons />
            </CardContent>
        </Card>
    )
}