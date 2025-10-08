import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import axios from "axios";
import InputField from "./InputField";
import useAppUrl from "@/hooks/useAppUrl";
import InputLabel from "./InputLabel";

export default function EmailValidationInput({
    data,
    setData,
    originalEmail,
    isSuperAdmin = false,
}) {
    const [emailValid, setEmailValid] = useState(null);
    const [emailUnique, setEmailUnique] = useState(null);
    const [checking, setChecking] = useState(false);
    const APP_URL = useAppUrl();

    // Step 1: Validate format
    useEffect(() => {
        if (!data.email) {
            setEmailValid(null);
            setEmailUnique(null);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(emailRegex.test(data.email));
    }, [data.email]);

    // Step 2: Check uniqueness only if changed
    useEffect(() => {
        if (!emailValid || data.email === originalEmail) {
            setEmailUnique(true); // treat unchanged email as valid
            setChecking(false);
            return;
        }

        const controller = new AbortController();
        setChecking(true);

        axios
            .post(
                `${APP_URL}/check-email-unique`,
                { email: data.email },
                {
                    headers: {
                        "X-CSRF-TOKEN": document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content,
                    },
                    signal: controller.signal,
                }
            )
            .then((res) => {
                setEmailUnique(res.data.unique);
            })
            .catch((err) => {
                if (!axios.isCancel(err)) setEmailUnique(false);
            })
            .finally(() => setChecking(false));

        return () => controller.abort();
    }, [data.email, emailValid, originalEmail]);

    return (
        <div className="w-full">
            {isSuperAdmin ? (
                <>
                    <InputLabel htmlFor="email" value="Email" />
                    <InputField
                        id="email"
                        name="email"
                        type="email"
                        value={data.email || ""}
                        placeholder="Optional: contact email"
                        onChange={(e) => setData("email", e.target.value)}
                    />
                </>
            ) : (
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={data.email || ""}
                    onChange={(e) => setData("email", e.target.value)}
                />
            )}

            {emailValid !== null && (
                <p
                    className={`mt-1 text-sm flex items-center gap-1 ${
                        emailValid && emailUnique !== false
                            ? "text-green-600"
                            : "text-red-600"
                    }`}
                >
                    {emailValid && emailUnique ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <X className="w-4 h-4" />
                    )}
                    {!emailValid
                        ? "Invalid email format"
                        : checking
                        ? "Checking uniqueness..."
                        : emailUnique === false
                        ? "Email already taken"
                        : "Valid and unique email"}
                </p>
            )}
        </div>
    );
}
