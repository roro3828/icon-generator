"use client"

import UUID from "@/lib/uuid";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";


export default function Home() {

    const param = useSearchParams().get("q")
    const uuid = param === null ? new UUID() : UUID.isUUID(param) ? new UUID(param) : new UUID();

    const [getUUID, setUUID] = useState<string>(uuid.toString())
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUUID(event.target.value)
    }
    const handleRegenerate = (event: React.MouseEventHandler<HTMLInputElement>) => {
        setUUID(new UUID().toString());
    }

    return (
        <div className=" w-full" style={{
            "imageRendering": "pixelated"
        }}>
            <div className="w-1/3 m-auto">
                <input onClick={handleRegenerate} className="m-auto w-1/6 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="button" value={"Regenerate"}></input>
                <input className="w-full" value={getUUID} onChange={handleInputChange} type="text"></input>
                <Image style={{"imageRendering": "pixelated"}} className="w-full p-3" width={64} height={64} src={`${process.env.NEXT_PUBLIC_ICON_GENERATE_URL}`+getUUID} alt="auto generated icon"/>

            </div>
            
        </div>
    );
}