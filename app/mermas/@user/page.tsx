"use client"
import Table from "@/components/table";
import Providers from "@/hooks/provider";

export default function Mermas() {

    return (
        <div>
            <Providers>
                <Table />
            </Providers>
        </div>
    )
}