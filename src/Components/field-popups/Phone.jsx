import { useEffect, useState } from 'react';
import { usePopup } from "@/hooks/use-popup.js";
import { ElzaPhone } from './ElzaPhone';
import { IdeaPhone } from './IdeaPhone';

export function Phone({ setBatteryDied, BatteryDied }) {
    const { closePopup } = usePopup();
    const [time, setTime] = useState(new Date());
    const [battery, setBattery] = useState(100);
    const [countdown, setCountdown] = useState(100);
    const [ElzaOpened, setElzaOpened] = useState(false);
    const [IdeaOpened, setIdeaOpened] = useState(false);
    const [AppOpened, setAppOpened] = useState(false);

    const closeAppHandler = () => {
        setAppOpened(false);
        if (ElzaOpened) {
            setElzaOpened(false);
        }
        if (IdeaOpened) {
            setIdeaOpened(false);
        }
    };

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setTime(new Date());
        }, 2000);

        return () => clearInterval(timeInterval); 
    }, []);

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timerInterval);
                    closePopup();
                    setBatteryDied(true);
                    return 0;
                }
                return prev - 1;
            });
    
            setBattery(prev => {
                if (prev - 1 <= 0) {
                    setBatteryDied(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 2000);
    
        return () => clearInterval(timerInterval);
    }, []);

    const HandleElza = () => {
        setElzaOpened(true);
        setAppOpened(true);
    };

    const HandleIdea = () => {
        setIdeaOpened(true);
        setAppOpened(true);
    };

    return (
        <>
            {!AppOpened ? (
                <div className="flex absolute inset-0 bg-cover bg-center top-[0.6rem] right-[0.6rem] left-[0.6rem] bottom-[0.6rem] rounded-[2.4rem]" style={{ backgroundImage: "url('src/Pictures/P25wallpaper.jpg')"}}>
                    <div className="grid grid-cols-3 gap-20 ml-[1.1rem] mr-[1.1rem] mt-[0.6rem] mb-[0.6rem] h-[3rem]">
                        <div className='text-[1.1rem] font-bold'>{time.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" })}</div>
                        <div className='font-bold text-[8rem] mt-[-7.5rem] pl-[0.4rem]'>.</div>
                        <div className='font-bold text-[1.1rem] text-right'>{battery}%</div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 ml-[1.1rem] mt-[5rem] mb-[0.6rem] mr-[1.1rem] absolute">
                        <div className='cursor-pointer'><img src="src/Logos/Console.png"/></div>
                        <div className='cursor-pointer'><img src="src/Logos/Angeles.png"/></div>
                        <div className='cursor-pointer'><img src="src/Logos/Mix.png"/></div>
                        <div className='cursor-pointer'>
                            <button onClick={HandleElza}><img src="src/Logos/Elza_app_logo.png"/></button>
                        </div>
                        <div className='cursor-pointer'>
                            <button onClick={HandleIdea}><img src="src/Logos/Idea_app_logo.png"/></button>
                        </div>
                    </div>
                </div>
            ) : ElzaOpened ? (
                <ElzaPhone time={time} battery={battery} closeApp={closeAppHandler} />
            ) : IdeaOpened ? (
                <IdeaPhone time={time} battery={battery} closeApp={closeAppHandler} />
            ) : (
                <h1>nem</h1>
            )}
        </>
    );
}
