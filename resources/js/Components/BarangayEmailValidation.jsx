import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import axios from "axios";
import InputField from "./InputField";
import useAppUrl from "@/hooks/useAppUrl";

export default function BarangayEmailValidation({
    data,
    setData,
    originalEmail,
    barangayEmail, // 👈 new prop for brgy email
}) {
    const [emailValid, setEmailValid] = useState(null);
    const [emailUnique, setEmailUnique] = useState(null);
    const [checking, setChecking] = useState(false);
    const [isBarangayEmail, setIsBarangayEmail] = useState(false); // 👈 new flag
    const APP_URL = useAppUrl();

    // Step 1: Validate format
    useEffect(() => {
        if (!data.email) {
            setEmailValid(null);
            setEmailUnique(null);
            setIsBarangayEmail(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(emailRegex.test(data.email));

        // Flag if same as barangay email
        setIsBarangayEmail(data.email === barangayEmail);
    }, [data.email, barangayEmail]);

    // Step 2: Check uniqueness only if changed & not barangay email
    useEffect(() => {
        if (!emailValid) {
            setEmailUnique(null);
            setChecking(false);
            return;
        }

        if (data.email === originalEmail || isBarangayEmail) {
            setEmailUnique(true); // treat unchanged or barangay email as valid
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
    }, [data.email, emailValid, originalEmail, isBarangayEmail]);

    return (
        <div className="w-full">
            <InputField
                label="Email"
                name="email"
                type="email"
                value={data.email || ""}
                onChange={(e) => setData("email", e.target.value)}
            />

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
                        : isBarangayEmail
                        ? "Same as barangay email (allowed)"
                        : emailUnique === false
                        ? "Email already taken"
                        : "Valid and unique email"}
                </p>
            )}
        </div>
    );
}
