<script setup>
    import { ref, onUnmounted } from 'vue'
    import music from '../assets/song.mp3'
    import useAudioEffects from '@/hooks/effects';

    const audio = ref(null);
    const fileInput = ref(null);
    const trackUrl = ref(music);
    const isPLaying = ref(false);
    const volume = ref(60);
    const { eqFrequencies, onFiltersChange, closeCtx, createSourceWithEffects, onDistortionChange, distortionLevel } = useAudioEffects(audio)

    function playAudio() {
        createSourceWithEffects();

        if (!isPLaying.value) {
            audio.value.play();
        } else {
            audio.value.pause();
        }
        isPLaying.value = !isPLaying.value;
    }

    function onVolumeChange() {
        audio.value.volume = volume.value / 100;
    }

    function onAudioSelect(event) {
        const file = event.target.files[0];

        if (file) {
            trackUrl.value = URL.createObjectURL(file);
            audio.value.src = trackUrl;
            audio.value.load();
        }
    }

    function chooseAudio() {
        fileInput.value.click();
    }

    onUnmounted(() => {
        closeCtx();
    })
</script>

<template>
    <div class="wrapper">
        <h1>Player with FX</h1>
        <audio ref="audio" :src="trackUrl"></audio>
        <button class="action" @click="playAudio">{{ isPLaying ? 'Pause' : 'Play' }}</button>
        <div class="effects-controls">
            <div>
                <label>Volume</label>
                <a-slider :min="0" :max="100" v-model:value="volume" @change="onVolumeChange" />
            </div>
            <div>
                <label>EQ</label>
                <a-slider :min="0" :max="20000" range v-model:value="eqFrequencies" @change="onFiltersChange" />
            </div>
            <div>
                <label>Distortion</label>
                <a-slider :min="0" :max="20" v-model:value="distortionLevel" @change="onDistortionChange" />
            </div>
        </div>
        <button class="action" @click="chooseAudio">
            <input ref="fileInput" type="file" @change="onAudioSelect" accept="audio/*" hidden/>
            <span class="file-input-text">Choose audio (optional)</span>
        </button>
    </div>
</template>

<style scoped>
    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
    }

    .action {
        height: 54px;
        width: 300px;
        border-radius: 54px;
        background-color: #f2f2f2;
        text-align: center;
        cursor: pointer;
    }

    .file-input-text {
        line-height: 54px;
    }

    .effects-controls {
        width: 300px;
        border-radius: 30px;
        background-color: #f2f2f2;
        padding: 20px;
    }

    button {
        background: none;
        border: none;
    }
</style>