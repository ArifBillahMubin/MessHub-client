import { Link } from "react-router";
import { House } from "lucide-react";
import errorIllustration from "../../assets/logo/Error-404.png";

const ErrorPage = () => (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-12 text-center">

        {/* 404 Illustration */}
        <img
            src={errorIllustration}
            alt="MessHub 404 - Page Not Found"
            className="w-[min(90vw,520px)] object-contain"
        />

        {/* Label */}
        <p className="mt-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-primary">
            404 Error
        </p>

        {/* Heading */}
        <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-neutral sm:text-4xl md:text-5xl">
            Oops! Page Not Found
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-sm text-base leading-relaxed text-neutral/60 md:text-lg">
            The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* CTA */}
        <Link
            to="/"
            className="
                mt-8 inline-flex items-center gap-2.5
                rounded-full bg-primary px-8 py-3.5
                text-sm font-bold text-white
                shadow-[0_4px_18px_rgba(0,107,104,0.28)]
                transition-all duration-200
                hover:-translate-y-0.5 hover:bg-primary/90
                hover:shadow-[0_8px_24px_rgba(0,107,104,0.35)]
                active:translate-y-0
            "
        >
            <House size={17} strokeWidth={2.3} />
            Go Back Home
        </Link>

    </main>
);

export default ErrorPage;
