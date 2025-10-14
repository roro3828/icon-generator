"use client"

import UUID from "@/lib/uuid";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import * as fastPng from "fast-png"

function resizePng(data: Uint8Array, size: number){
    const png = fastPng.decode(data)
    const resio = size / png.width

    const newHeight = Math.floor(png.height * resio)
    const newWidth = Math.floor(png.width * resio)

    const newImage = new Uint8Array(newHeight * newWidth * 4);

    for(let i = 0; i < png.height; i++){
        for(let j = 0; j < png.width; j++){

            for(let k = Math.floor(resio * i); k < Math.floor(resio * (i + 1)); k++){
                for(let l = Math.floor(resio * j); l < Math.floor(resio * (j + 1)); l++){
                    newImage[(k * newWidth + l) * 4] = png.data[(i * png.width + j) * 4]
                    newImage[(k * newWidth + l) * 4 + 1] = png.data[(i * png.width + j) * 4 + 1]
                    newImage[(k * newWidth + l) * 4 + 2] = png.data[(i * png.width + j) * 4 + 2]
                    newImage[(k * newWidth + l) * 4 + 3] = png.data[(i * png.width + j) * 4 + 3]
                }
            }
        }
    }

    const imgdata:  fastPng.ImageData = {
        data: newImage,
        height: newHeight,
        width: newWidth
    }
    return fastPng.encode(imgdata)
}

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
    const [upscaling, setUpscaling] = useState<boolean>(false)

    const [imageSrc, setImageSrc] = useState<string>(`${process.env.NEXT_PUBLIC_ICON_GENERATE_URL}` + uuid.toString())

    const [getUUID, setUUID] = useState<string>(uuid.toString())
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputUUID = event.target.value

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

    useEffect(() => {
        const url = `${process.env.NEXT_PUBLIC_ICON_GENERATE_URL}`+getUUID
        if(upscaling){
            fetch(url).then((res) => {
                if(res.status != 200){
                    setImageSrc(url)
                }
                else{
                    res.bytes().then((b) => {
                        const resized = resizePng(b, 256)

                        const base = "data:image/png;base64," + Buffer.from(resized).toString("base64")
                        setImageSrc(base)

                        console.log(base)
                    })
                }
            })
        }
        else{
            setImageSrc(url)
        }
    },
    [getUUID, upscaling])



    return (
        <div className=" w-full" style={{
            "imageRendering": "pixelated"
        }}>
            <div className="max-w-1/3 min-w-72 m-auto">
                
                <Image style={{"imageRendering": "pixelated"}} className="w-full p-3" width={64} height={64} src={imageSrc} alt="auto generated icon"/>

                <input onClick={handleRegenerate} className="mx-auto my-2 max-w-1/2 min-w-32 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="button" value={"Regenerate"}></input>
                <input className="w-full" value={getUUID} onChange={handleInputChange} type="text"></input>


                <input type="checkbox" checked={!hideHistory} onChange={(e) => {
                    setHiddenHistory(!e.target.checked)
                }}/>

                <input onClick={handleUndo} hidden={hideHistory} className="mx-auto my-2 max-w-1/2 min-w-32 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="button" value={"Undo"}></input>
                <input onClick={handleRedo} hidden={hideHistory} className="mx-auto my-2 max-w-1/2 min-w-32 block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" type="button" value={"Redo"}></input>
                <p hidden={hideHistory}>
                    <input type="checkbox" checked={upscaling} onChange={(e) => {
                        setUpscaling(e.target.checked)
                    }}/>
                    Show Upscaled Image
                </p>

                <Link href={`https://twitter.com/intent/tweet?original_referer=undefined&url=${process.env.NEXT_PUBLIC_THIS_URL + "?q=" + getUUID}`} className="block w-10 h-10 bg-blue-400 rounded-[50%] m-auto">
                    <div className="bg-no-repeat bg-[url('/twitter_logo_white.svg')] block relative top-3 left-[11px] w-5 h-5"/>
                </Link>
            </div>
            
        </div>
    );
}