import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
    data: Uint8Array;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(22, 119, 255, 0.2)'; // AntD Blue with opacity

        const barWidth = (width / data.length) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < data.length; i++) {
            barHeight = data[i] / 2;

            ctx.fillStyle = `rgb(${barHeight + 100}, 50, 255)`;
            ctx.fillRect(x, height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }, [data]);

    return <canvas ref={canvasRef} width={600} height={100} style={{ width: '100%', height: '100px' }} />;
};
