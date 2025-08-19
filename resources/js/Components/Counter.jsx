import { useEffect, useState } from "react";

function Counter({ end, duration = 900 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const frames = Math.floor(duration / 14); // ~60fps
        const step = Math.max(Math.floor(end / frames), 1); // how much to add per frame

        const timer = setInterval(() => {
            start += step;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 16);

        return () => clearInterval(timer);
    }, [end, duration]);

    return <span>{count.toLocaleString()}</span>;
}

export default Counter;
