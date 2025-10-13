"use client"

import UUID from "@/lib/uuid";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";


export default function Home() {

    const param = useSearchParams().get("q")
    const uuid = param === null ? new UUID() : UUID.isUUID(param) ? new UUID(param) : new UUID();

    const [history, setHistory] = useState<string[]>([]);
    const [revhistory, setRevHistory] = useState<string[]>([]);

    function addToHistory(uuid: string){
        setHistory([
            ...history,
            getUUID
        ])

        setRevHistory([])
    }

    const [hideHistory, setHiddenHistory] = useState<boolean>(true)

    const [getUUID, setUUID] = useState<string>(uuid.toString())
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputUUID = event.target.value
        if(!UUID.isUUID(inputUUID)){
            return
        }

        addToHistory(getUUID)

        setUUID(inputUUID)
    }
    const handleRegenerate = () => {
        addToHistory(getUUID)

        setUUID(new UUID().toString());
    }

    const handleUndo = () => {
        if(history.length == 0){
            return
        }
        const lastUUID = history[history.length - 1]

        setHistory(history.slice(0, history.length - 1))
        setRevHistory([
            ...revhistory,
            getUUID
        ])

        setUUID(lastUUID)

        return
    }
    const handleRedo = () => {
        if(revhistory.length == 0){
            return
        }
        const lastUUID = revhistory[revhistory.length - 1]

        setRevHistory(revhistory.slice(0, revhistory.length - 1))
        setHistory([
            ...history,
            getUUID
        ])

        setUUID(lastUUID)

        return
    }



    return (
        <div className=" w-full" style={{
            "imageRendering": "pixelated"
        }}>
            <div className="max-w-1/3 min-w-72 m-auto">
                <Image style={{"imageRendering": "pixelated"}} className="w-full p-3" width={64} height={64} src={`${process.env.NEXT_PUBLIC_ICON_GENERATE_URL}`+getUUID} alt="auto generated icon"/>
                
                <input onClick={handleRegenerate} className="mx-auto my-2 max-w-1/2 min-w-32 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="button" value={"Regenerate"}></input>
                <input className="w-full" value={getUUID} onChange={handleInputChange} type="text"></input>


                <input type="checkbox" checked={!hideHistory} onChange={(e) => {
                    setHiddenHistory(!e.target.checked)
                }}/>

                <input onClick={handleUndo} hidden={hideHistory} className="mx-auto my-2 max-w-1/2 min-w-32 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="button" value={"Undo"}></input>
                <input onClick={handleRedo} hidden={hideHistory} className="mx-auto my-2 max-w-1/2 min-w-32 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="button" value={"Redo"}></input>

                <Link href={`https://twitter.com/intent/tweet?original_referer=undefined&url=${process.env.NEXT_PUBLIC_THIS_URL + "?q=" + getUUID}`} className="block w-10 h-10 bg-blue-400 rounded-[50%] m-auto">
                    <div className="bg-no-repeat bg-[url('/twitter_logo_white.svg')] block relative top-3 left-[11px] w-5 h-5"/>
                </Link>
            </div>
            
        </div>
    );
}