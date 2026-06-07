'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api/client';
import { LoadingIndicator } from '@/components/dashboard/LoadingIndicator';

const MAX_PLAYS = 3;
const fileCache = new Map();

export default function Media({ id, dashboard }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(null);
  const audioRef = React.createRef();

  const handlePlay = () => {
    if (playCount < MAX_PLAYS) {
      audioRef.current.play();
      setIsPlaying(true);
      setPlayCount(playCount + 1);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleDurationChange = () => {
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    let cancelled = false;

    const cached = fileCache.get(id);
    if (cached) {
      setFile(cached);
      setLoading(false);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);
    setFile(null);

    api
      .get(`/file/${id}`)
      .then((response) => {
        if (cancelled) return;
        fileCache.set(id, response.data);
        setFile(response.data);
      })
      .catch((err) => {
        if (cancelled) return;
        console.log(err);
        setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <LoadingIndicator label="Loading…" size="sm" className="py-4" />;
  }

  if (error || !file) {
    return (
      <p className="py-4 text-center text-xs text-ink-faint">Could not load file</p>
    );
  }

  const { name, base64, type } = file;

  if (type.startsWith('image/')) {
    return (
      <div className="w-full h-fit">
        <img
          src={`data:${type};base64,${base64}`}
          alt={name}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  if (dashboard && type.startsWith('audio/')) {
    return (
      <div className="flex flex-row items-center">
        <audio src={`data:audio/mp3;base64,${base64}`} controls />
      </div>
    );
  }

  if (type.startsWith('audio/') && !dashboard) {
    return (
      <div className="flex flex-row items-center">
        <audio
          src={`data:audio/mp3;base64,${base64}`}
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onEnded={handleEnded}
        />
        <button
          onClick={handlePlay}
          disabled={isPlaying || playCount >= MAX_PLAYS}
          className="flex items-center justify-center rounded-full w-fit h-fit text-accent2"
        >
          <i className="pi pi-caret-right" style={{ fontSize: '2rem' }}></i>
        </button>
        {duration && (
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            className="w-full rounded-md "
            step="0.01"
            onChange={(e) => {
              audioRef.current.currentTime = e.target.value;
              setCurrentTime(audioRef.current.currentTime);
            }}
          />
        )}
        <div className="p-2 text-lg font-bold font-nunito ">{`${
          MAX_PLAYS - playCount
        }x`}</div>
      </div>
    );
  }

  return <p>Unsupported file type: {type}</p>;
}
