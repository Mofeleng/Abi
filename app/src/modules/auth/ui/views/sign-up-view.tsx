"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {zodResolver} from "@hookform/resolvers/zod"
import { signUpDto, SignUpDto } from "../../dtos/sign-up-dto";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";
import { AuthCardSeparator } from "../components/auth-card-separator";
import { SocialSignOnButtons } from "../components/social-sign-on-buttons";

export function SignUpView() {
    const form = useForm<SignUpDto>({
        resolver: zodResolver(signUpDto),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });

    const onSubmit = (values: SignUpDto) => {

    }

    return (
        <Card className="max-w-105 w-full mx-auto">
            <CardHeader>
                <CardTitle>
                    Welcome to Abi
                </CardTitle>
                <CardDescription>Create your account to start automating your business intelligence</CardDescription>
            </CardHeader>
            <CardContent>
                <Separator className="mb-6"/>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <Controller
                        name="name"
                        control={form.control}
                        render={ ( { field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="name">
                                    Full name
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="name"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="John Doe"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>    
                        )}
                    />

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
                            className="w-full"
                        >
                            Create account
                        </Button>
                        <div className="w-full text-center">
                            <span> Already have an account? <Link href="/auth/sign-in" className="hover:text-primary hover:underline">Sign in</Link></span>
                        </div>
                </form>
                <AuthCardSeparator />
                <SocialSignOnButtons />
            </CardContent>
        </Card>
    )
}