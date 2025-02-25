import os
from flask import Flask, request, jsonify, send_file
from TTS.api import TTS
from pydub import AudioSegment

os.system("pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118")
os.environ["COQUI_TOS_AGREED"] = "1"

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Automatically accept Coqui license

# Load TTS model
tts_model = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
tts_model.to("cuda")  # Use GPU explicitly

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "API is working!"})

@app.route("/generate_podcast", methods=["POST"])
def generate_podcast():
    script = request.form.get("script")
    language = request.form.get("language", "en")

    if not script:
        return jsonify({"error": "Missing script"}), 400

    script = eval(script)

    # Save reference audio files
    reference_audio_paths = {}
    for file_key in request.files:
        file = request.files[file_key]
        save_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(save_path)
        reference_audio_paths[file.filename.split(".")[0]] = save_path

    # Generate speech for each dialogue
    generated_audio_files = []
    for i, part in enumerate(script):
        speaker = part["speaker"]
        text = part["text"]
        reference_audio_path = reference_audio_paths.get(speaker)

        if not reference_audio_path:
            return jsonify({"error": f"Reference audio missing for {speaker}"}), 400

        output_path = os.path.join(OUTPUT_FOLDER, f"output_{i}.wav")
        tts_model.tts_to_file(text=text, speaker_wav=reference_audio_path, language=language, file_path=output_path)
        generated_audio_files.append(output_path)

    # Merge audio files
    final_audio = AudioSegment.empty()
    for file in sorted(generated_audio_files):
        final_audio += AudioSegment.from_wav(file)

    final_podcast_path = os.path.join(OUTPUT_FOLDER, "final_podcast.wav")
    final_audio.export(final_podcast_path, format="wav")

    return send_file(final_podcast_path, as_attachment=True)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Get dynamic port for Render
    app.run(host="0.0.0.0", port=port)  # Allow external access
