import { ref } from 'vue';

export default function useAudioEffects(audio) {
    const eqFrequencies = ref([0, 3000]);
    const distortionLevel = ref(0);
    let lowpassFilterNode = null;
    let highpassFilterNode = null;
    let distortionNode = null;
    let audioCtx = null;
    let source = null;

    function createSourceWithEffects() {
        if (audioCtx == null) {
            audioCtx = new AudioContext();
        }

        if (source == null) {
            source = audioCtx.createMediaElementSource(audio.value);
            lowpassFilterNode = audioCtx.createBiquadFilter();
            lowpassFilterNode.frequency.value = eqFrequencies.value[1];
            highpassFilterNode = audioCtx.createBiquadFilter();
            highpassFilterNode.type = 'highpass';
            highpassFilterNode.frequency.value = eqFrequencies.value[0];
            distortionNode = audioCtx.createWaveShaper();
            distortionNode.curve = makeDistortionCurve(distortionLevel.value);

            source.connect(lowpassFilterNode);
            lowpassFilterNode.connect(highpassFilterNode);
            highpassFilterNode.connect(distortionNode);
            distortionNode.connect(audioCtx.destination);
        }
    }

    function makeDistortionCurve(amount) {
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
      
        for (let i = 0; i < n_samples; i++) {
          const x = (i * 2) / n_samples - 1;
          curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        }
        return curve;
    }

    function onFiltersChange() {
        highpassFilterNode.frequency.value = eqFrequencies.value[0];
        lowpassFilterNode.frequency.value = eqFrequencies.value[1];
    }

    function onDistortionChange() {
        distortionNode.curve = makeDistortionCurve(distortionLevel.value);
    }

    function closeCtx() {
        if (audioCtx) {
            audioCtx.close();
        }
    }

    return {
        eqFrequencies,
        distortionLevel,
        onFiltersChange,
        createSourceWithEffects,
        onDistortionChange,
        closeCtx,
    }
}