import { useEffect, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";

const AudioLoader = () => {
  const canvasRef = useRef(null);
  let animationFrameId;
  let wavePoints = new Array(60).fill(150); // Initial baseline

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 600;
    canvas.height = 350;

    const lerp = (start, end, amount) => start * (1 - amount) + end * amount;

    // Generate fluctuating wave heights
    const generateWave = () => {
      for (let i = 0; i < wavePoints.length; i++) {
        let targetHeight = Math.random() * 140 + 50; // Randomized height (50px - 190px)
        wavePoints[i] = lerp(wavePoints[i], targetHeight, 0.1);
      }
    };

    const drawGraph = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#000"; // Background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create a colorful gradient for the waveform
      let gradient = ctx.createLinearGradient(50, 0, canvas.width, 0);
      gradient.addColorStop(0, "cyan");
      gradient.addColorStop(0.3, "lime");
      gradient.addColorStop(0.6, "yellow");
      gradient.addColorStop(1, "red");

      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = gradient;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "lime";

      ctx.moveTo(50, wavePoints[0]);
      for (let i = 1; i < wavePoints.length; i++) {
        const x = (i / wavePoints.length) * (canvas.width - 100) + 50;
        ctx.lineTo(x, wavePoints[i]);
      }
      ctx.stroke();

      generateWave();
      animationFrameId = requestAnimationFrame(drawGraph);
    };

    drawGraph();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <canvas ref={canvasRef} className="rounded-lg shadow-lg" />

      {/* Microphone Icon */}
      <div className="absolute flex flex-col items-center ">
        <FaMicrophone className="text-red-500 text-6xl mt-12 animate-pulse drop-shadow-md" />
        <span className="text-white mt-2 font-semibold">Audio Generating...</span>
      </div>
    </div>
  );
};

export default AudioLoader;
