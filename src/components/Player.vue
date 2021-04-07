<template>
    <div class="player">
        <av-waveform
            :playtime-slider-color="'#fafafa'"
            :played-line-color="'#444444'"
            :noplayed-line-color="'#49A6A6'"
            :audio-src="audio_link"
            :symmetric="true"
        ></av-waveform>
    </div>
</template>

<script>
export default {
    name: "Player",
    props: {
        audio_link: String,
    },
};
</script>

<style scoped>
.player {
    margin-top: 1em;
    margin-bottom: 1em;
}
</style>
