import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center
                        bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300
                        relative overflow-hidden">

            {/* Animated background circles */}
            <div className="absolute -top-10 -left-10 w-60 h-60 bg-blue-400 opacity-30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-600 opacity-20 rounded-full blur-3xl animate-bounce"></div>

            {/* Logo with float animation */}
            <div className="animate-float">
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20" />
                </Link>
            </div>

            {/* Card with fade/slide animation */}
            <div className="mt-6 w-full overflow-hidden bg-white/90 backdrop-blur-md px-6 py-6
                            shadow-xl sm:max-w-md sm:rounded-2xl animate-fadeIn">
                {children}
            </div>
        </div>
    );
}
