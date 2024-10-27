import React, { useEffect, useRef, useState } from 'react';
import "./App.css"

const App = () => {
  const [audioData, setAudioData] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const [is3D, setIs3D] = useState(false);

  useEffect(() => {
    if (!audioFile) return;

    const setupAudio = async () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;

      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(audioContextRef.current.destination);

      analyserRef.current = analyser;
      setAudioData(new Uint8Array(analyser.frequencyBinCount));

      source.start();
    };

    setupAudio();
  }, [audioFile]);

  console.log(audioData)

  useEffect(() => {
    if (!audioData || !analyserRef.current) return;

    const draw = () => {
      analyserRef.current.getByteFrequencyData(audioData);
      drawBars(audioData);
      requestAnimationFrame(draw);
    };

    draw();
  }, [audioData]);

  const drawBars7 = (audioData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const maxBarHeight = canvas.height;
    const brickHeight = 2;
    const totalBars = 15;
    const barWidth = (canvas.width / totalBars) - 4;
  
    for (let i = 0; i < totalBars; i++) {
      const startFrequency = Math.floor((audioData.length / totalBars) * i);
      const endFrequency = Math.floor((audioData.length / totalBars) * (i + 1));
      const frequencyRange = audioData.slice(startFrequency, endFrequency);
  
      const averageValue = frequencyRange.reduce((sum, val) => sum + val, 0) / frequencyRange.length;
  
      const x = barWidth * i;
      const baseHeight = (maxBarHeight / 256) * averageValue;
      const heightWithFlicker = baseHeight + Math.random() * 20; // Adds random flicker effect
      const totalBricks = Math.floor(heightWithFlicker / brickHeight);
  
      for (let j = 0; j < totalBricks; j++) {
        const y = canvas.height - j * brickHeight;
  
        // Fire gradient color
        const colorIntensity = Math.floor((averageValue / 256) * 255);
        ctx.fillStyle = `rgb(${255}, ${Math.floor(colorIntensity * 0.8)}, ${Math.floor(colorIntensity * 0.4)})`;
        
        // Optional glow effect for 3D mode
        ctx.shadowBlur = is3D ? 15 : 0;
        ctx.shadowColor = is3D ? 'rgba(255, 100, 0, 0.5)' : 'transparent';
  
        ctx.fillRect(x, y - brickHeight, barWidth, brickHeight - 1);
      }
    }
  };

  const drawBars = (audioData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const maxBarHeight = canvas.height * 1.5;
    const brickHeight = 15;
    const totalBars = 12;
    const barWidth = (canvas.width / totalBars) - 4;
  
    // Define frequency range for each bar, with low frequencies on the left
    const minFrequency = 20;  // Hz, lower bound of human hearing
    const maxFrequency = 20000; // Hz, upper bound of human hearing
    const frequencyRange = maxFrequency - minFrequency;
  
    for (let i = 0; i < totalBars; i++) {
      // Map each bar to a specific range of frequencies
      const startFrequency = minFrequency + (i / totalBars) * frequencyRange;
      const endFrequency = minFrequency + ((i + 1) / totalBars) * frequencyRange;
  
      // Convert frequency range to corresponding FFT bins
      const startBin = Math.floor((startFrequency / maxFrequency) * audioData.length);
      const endBin = Math.floor((endFrequency / maxFrequency) * audioData.length);
      const frequencyRangeData = audioData.slice(startBin, endBin);
  
      // Calculate the average amplitude within this frequency range
      const averageValue = frequencyRangeData.reduce((sum, val) => sum + val, 0) / frequencyRangeData.length;
  
      // Calculate the height of the bar based on the amplitude
      const baseHeight = (maxBarHeight / 256) * averageValue;
      const heightWithFlicker = baseHeight + Math.random() * 20;
      const totalBricks = Math.floor(heightWithFlicker / brickHeight);
  
      const x = barWidth * i;
  
      // Draw the bar as stacked bricks
      for (let j = 0; j < totalBricks; j++) {
        const y = canvas.height - j * brickHeight;
  
        // Gradient color effect based on amplitude
        const colorIntensity = Math.floor((averageValue / 256) * 255);
        ctx.fillStyle = `rgb(${255}, ${Math.floor(colorIntensity * 0.8)}, ${Math.floor(colorIntensity * 0.4)})`;
  
        // 3D shadow effect if enabled
        ctx.shadowBlur = is3D ? 15 : 0;
        ctx.shadowColor = is3D ? 'rgba(255, 100, 0, 0.5)' : 'transparent';
  
        ctx.fillRect(x, y - brickHeight, barWidth, brickHeight - 1);
      }
    }
  };
  

  const drawBars121 = (audioData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxBarHeight = canvas.height;
    const brickHeight = 15;
    const totalBars = 12;
    const barWidth = (canvas.width / totalBars) - 4;

    for (let i = 0; i < totalBars; i++) {
      // Adjust frequency range mapping for better distribution
      const startFrequency = Math.floor((Math.pow(i, 1.5) / Math.pow(totalBars, 1.5)) * audioData.length);
      const endFrequency = Math.floor((Math.pow(i + 1, 1.5) / Math.pow(totalBars, 1.5)) * audioData.length);
      const frequencyRange = audioData.slice(startFrequency, endFrequency);

      // Calculate average volume in this frequency range
      const averageValue = frequencyRange.reduce((sum, val) => sum + val, 0) / frequencyRange.length;

      const x = barWidth * i;
      const baseHeight = (maxBarHeight / 256) * averageValue;
      const heightWithFlicker = baseHeight + Math.random() * 20;
      const totalBricks = Math.floor(heightWithFlicker / brickHeight);

      for (let j = 0; j < totalBricks; j++) {
        const y = canvas.height - j * brickHeight;

        // Fire gradient color effect
        const colorIntensity = Math.floor((averageValue / 256) * 255);
        ctx.fillStyle = `rgb(${255}, ${Math.floor(colorIntensity * 0.8)}, ${Math.floor(colorIntensity * 0.4)})`;
        
        ctx.shadowBlur = is3D ? 15 : 0;
        ctx.shadowColor = is3D ? 'rgba(255, 100, 0, 0.5)' : 'transparent';

        ctx.fillRect(x, y - brickHeight, barWidth, brickHeight - 1);
      }
    }
  };


  const drawBars111 = (audioData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const maxBarHeight = canvas.height;
    const brickHeight = 2;
    const totalBars = 30; // Fixed number of bars
    const barWidth = (canvas.width / totalBars) - 4;
  
    for (let i = 0; i < totalBars; i++) {
      // Map a frequency range to each bar
      const startFrequency = Math.floor((audioData.length / totalBars) * i);
      const endFrequency = Math.floor((audioData.length / totalBars) * (i + 1));
      const frequencyRange = audioData.slice(startFrequency, endFrequency);
  
      // Average the amplitude for each range to get the bar height
      const averageValue = frequencyRange.reduce((sum, val) => sum + val, 0) / frequencyRange.length;
  
      const x = barWidth * i;
      const height = (maxBarHeight / 256) * averageValue;
      const totalBricks = Math.floor(height / brickHeight);
  
      for (let j = 0; j < totalBricks; j++) {
        const y = canvas.height - j * brickHeight;
  
        // Gradient color from purple (low) to red (high)
        const colorValue = Math.floor((averageValue / 256) * 255);
        ctx.fillStyle = `rgb(${colorValue}, 0, ${255 - colorValue})`;
        ctx.shadowBlur = is3D ? 10 : 0;
        ctx.shadowColor = is3D ? 'rgba(0, 0, 0, 0.2)' : 'transparent';
  
        ctx.fillRect(x, y - brickHeight, barWidth, brickHeight - 1);
      }
    }
  };
  

  const drawBars4 = (audioData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxBarHeight = canvas.height;
    const brickHeight = 50; 
    const groupSize = 10; // Number of frequencies per brick
    const totalBars = Math.floor(audioData.length / groupSize);
    const barWidth = (canvas.width / totalBars) - 4;

    for (let i = 0; i < totalBars; i++) {
      // Average the amplitude for each group of frequencies
      const averageValue = audioData.slice(i * groupSize, (i + 1) * groupSize)
                                    .reduce((sum, val) => sum + val, 0) / groupSize;

      const x = barWidth * i;
      const height = (maxBarHeight / 256) * averageValue;
      const totalBricks = Math.floor(height / brickHeight);

      for (let j = 0; j < totalBricks; j++) {
        const y = canvas.height - j * brickHeight;

        // Gradient color from purple (low) to red (high)
        const colorValue = Math.floor((averageValue / 256) * 255);
        ctx.fillStyle = `rgb(${colorValue}, 0, ${255 - colorValue})`;
        ctx.shadowBlur = is3D ? 10 : 0;
        ctx.shadowColor = is3D ? 'rgba(0, 0, 0, 0.2)' : 'transparent';

        ctx.fillRect(x, y - brickHeight, barWidth, brickHeight - 1);
      }
    }
  };

  const drawBars3 = (audioData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const brickHeight = 10;

    audioData.forEach((value, i) => {
      const x = (canvas.width / audioData.length) * i;
      const totalBricks = Math.floor((canvas.height / 256) * value / brickHeight);

      for (let j = 0; j < totalBricks; j++) {
        const y = canvas.height - j * brickHeight;
        ctx.fillStyle = is3D ? 'rgba(255, 87, 34, 0.7)' : '#4CAF50';
        ctx.shadowBlur = is3D ? 10 : 0;
        ctx.shadowColor = is3D ? 'rgba(0, 0, 0, 0.2)' : 'transparent';
        ctx.fillRect(x, y - brickHeight, canvas.width / audioData.length - 2, brickHeight - 1);
      }
    });
  };

  const drawBars2 = (audioData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxBarHeight = canvas.height * 1.5; // Amplifies max height
    const brickHeight = 5; // Increased size of each "brick" segment
    const barWidth = (canvas.width / audioData.length) - 4;

    audioData.forEach((value, i) => {
      const x = (canvas.width / audioData.length) * i;
      const height = (maxBarHeight / 256) * value;
      const totalBricks = Math.floor(height / brickHeight);

      for (let j = 0; j < totalBricks; j++) {
        const y = canvas.height - j * brickHeight;

        // Gradient color from purple (low) to red (high)
        const colorValue = Math.floor((value / 256) * 255);
        ctx.fillStyle = `rgb(${colorValue}, 0, ${255 - colorValue})`;
        ctx.shadowBlur = is3D ? 10 : 0;
        ctx.shadowColor = is3D ? 'rgba(0, 0, 0, 0.2)' : 'transparent';

        ctx.fillRect(x, y - brickHeight, barWidth, brickHeight - 1);
      }
    });
  };

  return (
    <div className="App">
      <div className="visualization-container">
        <h1 className='padding'>Sound Visualizer</h1>
      </div>
      <div className="visualization-container">
        <canvas ref={canvasRef} width="800" height="600"></canvas>
      </div>
      <div className="control-bar">
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files[0])}
        />
        <button className="toggle-3d-btn" onClick={() => setIs3D(!is3D)}>
          {is3D ? "Switch to 2D" : "Switch to 3D"}
        </button>
      </div>
    </div>
  );
};

export default App;
