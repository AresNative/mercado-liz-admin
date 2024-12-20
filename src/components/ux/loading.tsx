import { Spinner } from "@nextui-org/react";

export default function Loading() {
    return (
        <section className="w-full h-[90vh] flex items-center">
            <Spinner size="lg" className="m-auto" />
        </section>
    )
}