"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Countdowmn() {
    const [duration, setDuration] = useState<number | string>("");
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const timeRef = useRef<NodeJS.Timeout | null>(null);

    const handleSetDuration = (): void => {
        if (typeof duration === "number" && duration > 0) {
            setTimeLeft(duration);
            setIsActive(false);
            setIsPaused(false);
            if (timeRef.current) {
                clearInterval(timeRef.current)
            }
        }
    };

    const handleStart = (): void => {
        if (timeLeft > 0) {
            setIsActive(true);
            setIsPaused(false);
        }
    };

    const handlePause = ():void => {
        if (isActive) {
            setIsPaused(true);
            setIsActive(false);

        if (timeRef.current) {
            clearInterval(timeRef.current);
        }
    }
}

    const handleReset = (): void => {
        setIsActive(false);
        setIsPaused(false);
        setTimeLeft(0);
        if (timeRef.current) {
            clearInterval(timeRef.current);
        }
    }
    
    useEffect(() => {
        if (isActive && !isPaused) {
            timeRef.current = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if(prevTime <= 1) {
                        clearInterval(timeRef.current!);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => {
            if (timeRef.current) {
                clearInterval(timeRef.current);
            }
        };
    }, [isActive, isPaused]);
    const formatTime = (time:number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return(`${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`); 
        //padstart function for adding 0 in the start of the number if there was a single number
    
    };
    const handleDurationChange = (e:ChangeEvent<HTMLInputElement>): void => {
        setDuration(Number(e.target.value) || "")
    }


return(
    <div className="h-screen flex justify-center bg-neutral-300 items-center">
        <div className="bg-neutral-500 h-[60vh] w-[50%] flex flex-col justify-center items-center border-4 border-black rounded-xl">
            <Input type="number" id="duration" placeholder="Enter Duration in Seconds" value={duration} onChange={handleDurationChange} className="bg-white text-black border-black h-[8%] w-[70%] text-[90%] p-0 pl-2 font-sans font-semibold "/>
        <div className="text-[11vh] font-bold text-white">{formatTime(timeLeft)}</div>
        <div className="flex justify-center gap-[3%]">
        <Button onClick={handleStart} className="bg-white text-black rounded-xl h-[4vh] w-[20%] text-[2vh] border-2 border-black">{isPaused ? "Resume" : "Start"}</Button>
        <Button onClick={handlePause} className="bg-white text-black rounded-xl h-[4vh] w-[20%] text-[2vh] border-2 border-black">Pause</Button>
        <Button onClick={handleSetDuration} className="bg-white text-black rounded-xl h-[4vh] w-[20%] text-[2vh] border-2 border-black">Set</Button>
        <Button onClick={handleReset} className="bg-white text-black rounded-xl h-[4vh] w-[20%] text-[2vh] border-2 border-black">Reset</Button>
        </div>
        </div>
    </div>
)    
    
}