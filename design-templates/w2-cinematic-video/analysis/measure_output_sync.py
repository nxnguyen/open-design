"""Measure output audio offset and shot-boundary beat errors after encoding."""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from scipy.io import wavfile
from scipy.signal import correlate, correlation_lags


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "out/qa/final/source-score-8k.wav"
RENDER = ROOT / "out/qa/final/render-audio-8k.wav"
BEATS = ROOT / "analysis/beat_data.json"
OUTPUT = ROOT / "analysis/output_sync.json"
BOUNDARIES = [118, 280, 413, 546, 679]
FPS = 30


def mono_float(path: Path) -> tuple[int, np.ndarray]:
    sample_rate, data = wavfile.read(path)
    values = data.astype(np.float64)
    if values.ndim > 1:
        values = values.mean(axis=1)
    values -= values.mean()
    peak = np.max(np.abs(values)) or 1
    return sample_rate, values / peak


def main() -> None:
    source_rate, source = mono_float(SOURCE)
    render_rate, rendered = mono_float(RENDER)
    if source_rate != render_rate:
        raise RuntimeError("Sample rates differ")
    correlation = correlate(rendered, source, mode="full", method="fft")
    lags = correlation_lags(len(rendered), len(source), mode="full")
    window = np.abs(lags) <= int(source_rate * 0.25)
    window_lags = lags[window]
    window_corr = correlation[window]
    best_index = int(np.argmax(window_corr))
    best_lag_samples = int(window_lags[best_index])
    beat_data = json.loads(BEATS.read_text(encoding="utf-8"))
    t0 = float(beat_data["t0"])
    interval = float(beat_data["beat_interval"])
    boundaries = []
    for frame in BOUNDARIES:
        seconds = frame / FPS
        beat_number = round((seconds - t0) / interval)
        beat_seconds = t0 + beat_number * interval
        error_seconds = seconds - beat_seconds
        boundaries.append(
            {
                "frame": frame,
                "seconds": round(seconds, 6),
                "nearest_beat": beat_number,
                "beat_seconds": round(beat_seconds, 6),
                "error_ms": round(error_seconds * 1000, 3),
                "error_frames": round(error_seconds * FPS, 3),
            }
        )
    payload = {
        "sample_rate": source_rate,
        "output_audio_lag_samples": best_lag_samples,
        "output_audio_lag_ms": round(best_lag_samples / source_rate * 1000, 3),
        "shot_boundary_errors": boundaries,
        "max_absolute_boundary_error_frames": max(abs(row["error_frames"]) for row in boundaries),
        "acceptance": {
            "audio_lag_ms": "informational; mastered mix includes SFX and dynamics processing",
            "shot_boundary_error": "PASS when every cut is within 1.5 frames of the selected beat grid",
        },
    }
    OUTPUT.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
