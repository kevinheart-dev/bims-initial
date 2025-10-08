import { Check, X } from "lucide-react";

const PasswordValidationChecklist = ({ data }) => {
    const password = data.password || "";
    const passwordConfirmation = data.password_confirmation || "";

    const rules = [
        {
            label: "At least 8 characters",
            valid: password.length >= 8,
        },
        {
            label: "Contains a number",
            valid: /\d/.test(password),
        },
        {
            label: "Contains a special character (!@#$%^&*)",
            valid: /[!@#$%^&*]/.test(password),
        },
        {
            label: "Matches confirmation",
            valid: password === passwordConfirmation && password !== "",
        },
    ];

    return (
        <div className="mt-2 text-sm">
            <ul className="space-y-1">
                {rules.map((rule, idx) => (
                    <li
                        key={idx}
                        className={`flex items-center gap-1 ${
                            rule.valid ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {rule.valid ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <X className="w-4 h-4" />
                        )}
                        {rule.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PasswordValidationChecklist;
