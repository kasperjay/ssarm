import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";
import { stat } from "fs/promises";

const CACHE_DIR = join("/tmp", "ss_transcode_cache");

if (!existsSync(CACHE_DIR)) {
  try {
    mkdirSync(CACHE_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create transcode cache dir:", err);
  }
}

export interface TranscodeOptions {
  format?: "wav" | "mp3";
  sampleRate?: 44100 | 48000;
}

export async function getOrTranscodeAudio(
  sourceFilePath: string,
  options: TranscodeOptions = {}
): Promise<{ filePath: string; contentType: string; filename: string }> {
  const targetFormat = options.format === "mp3" ? "mp3" : "wav";
  const targetSampleRate = options.sampleRate === 48000 ? 48000 : 44100;

  // Extract base name without extension
  const baseName = sourceFilePath.split("/").pop() || "audio";
  const nameWithoutExt = baseName.replace(/\.[^/.]+$/, "");
  const targetFilename = `${nameWithoutExt}_${targetSampleRate / 1000}k.${targetFormat}`;
  const cachedFilePath = join(CACHE_DIR, `${nameWithoutExt}_${targetSampleRate}_${targetFormat}.${targetFormat}`);

  // Return cached version if already transcoded
  if (existsSync(cachedFilePath)) {
    return {
      filePath: cachedFilePath,
      contentType: targetFormat === "mp3" ? "audio/mpeg" : "audio/wav",
      filename: targetFilename,
    };
  }

  // If source is already the exact requested format and extension, and we have no transcoding needed,
  // we can serve directly if rate matches, but ffmpeg ensures sample rate is exactly 44.1 or 48.
  return new Promise((resolve, reject) => {
    // Construct ffmpeg arguments
    // -y: overwrite output
    // -i: input
    // -ar: audio sample rate (44100 or 48000)
    // For MP3: -codec:a libmp3lame -b:a 320k
    // For WAV: -codec:a pcm_s16le (standard 16-bit) or pcm_s24le
    const args: string[] = ["-y", "-i", sourceFilePath, "-ar", String(targetSampleRate)];

    if (targetFormat === "mp3") {
      args.push("-codec:a", "libmp3lame", "-b:a", "320k");
    } else {
      args.push("-codec:a", "pcm_s16le");
    }

    args.push(cachedFilePath);

    const proc = spawn("/usr/bin/ffmpeg", args);

    let stderr = "";
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    proc.on("error", (err) => {
      console.warn("FFmpeg spawn error, falling back to source:", err.message);
      resolve({
        filePath: sourceFilePath,
        contentType: sourceFilePath.endsWith(".mp3") ? "audio/mpeg" : "audio/wav",
        filename: baseName,
      });
    });

    proc.on("close", async (code) => {
      if (code === 0 && existsSync(cachedFilePath)) {
        resolve({
          filePath: cachedFilePath,
          contentType: targetFormat === "mp3" ? "audio/mpeg" : "audio/wav",
          filename: targetFilename,
        });
      } else {
        console.warn(`FFmpeg exited with code ${code}. Stderr: ${stderr.slice(-300)}. Falling back to source.`);
        resolve({
          filePath: sourceFilePath,
          contentType: sourceFilePath.endsWith(".mp3") ? "audio/mpeg" : "audio/wav",
          filename: baseName,
        });
      }
    });
  });
}
