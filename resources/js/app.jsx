import "../css/app.css";
import "./bootstrap";
import { BrowserRouter } from "react-router-dom";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

import { Toaster } from "react-hot-toast";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <BrowserRouter>
                <>
                    <Toaster
                        position="top-right"
                        toastOptions={{ duration: 4000 }}
                    />
                    <App {...props} />
                </>
            </BrowserRouter>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
