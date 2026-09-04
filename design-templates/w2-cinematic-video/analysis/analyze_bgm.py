"""Produce an auditable beat grid for the selected W2 campaign track."""

from __future__ import annotations

import json
from pathlib import Path

import librosa
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/audio/w2-score.wav"
OUTPUT = ROOT / "analysis/beat_data.json"


def main() -> None:
    signal, sample_rate = librosa.load(SOURCE, sr=None, mono=True)
    percussion = librosa.effects.hpss(signal)[1]
    _, beat_times = librosa.beat.beat_track(
        y=percussion,
        sr=sample_rate,
        tightness=400,
        units="time",
    )
    indices = np.arange(len(beat_times))
    design = np.vstack([indices, np.ones_like(indices)]).T
    (interval, offset), *_ = np.linalg.lstsq(design, beat_times, rcond=None)
    fitted = offset + indices * interval
    residuals = beat_times - fitted
    phase_offset = offset - round(offset / interval) * interval
    delivery_grid = np.arange(0, int(np.ceil((30.0 - phase_offset) / interval)) + 1)
    delivery_beats = phase_offset + delivery_grid * interval
    rms = librosa.feature.rms(y=signal)[0]
    rms_times = librosa.times_like(rms, sr=sample_rate)
    stride = max(1, len(rms) // 400)
    payload = {
        "source": SOURCE.name,
        "duration_seconds": round(float(librosa.get_duration(y=signal, sr=sample_rate)), 6),
        "sample_rate": int(sample_rate),
        "bpm": round(float(60 / interval), 6),
        "t0": round(float(phase_offset), 6),
        "detector_fit_offset": round(float(offset), 6),
        "beat_interval": round(float(interval), 8),
        "max_grid_residual_ms": round(float(np.abs(residuals).max() * 1000), 3),
        "beats": [round(float(value), 6) for value in delivery_beats if 0 <= value <= 30.0],
        "detected_beats": [round(float(value), 6) for value in beat_times if value <= 30.0],
        "rms": [
            {"t": round(float(rms_times[i]), 4), "value": round(float(rms[i]), 6)}
            for i in range(0, len(rms), stride)
            if rms_times[i] <= 30.0
        ],
        "method": "librosa HPSS percussion + beat_track + least-squares equal grid",
    }
    OUTPUT.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: payload[key] for key in ["bpm", "t0", "beat_interval", "max_grid_residual_ms", "duration_seconds"]}, indent=2))


if __name__ == "__main__":
    main()
