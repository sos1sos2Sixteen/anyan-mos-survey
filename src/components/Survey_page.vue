<template>
    <div class="SurveyPage">
        <b-container>
            <b-row>
                <b-col cols="3"></b-col>
                <b-col cols="6">
                    <p>{{ description }}</p>

                    <player :audio_link="audio_url" />

                    <b-form @submit="onSubmit">
                        <b-input-group
                            class="input-line"
                            prepend="MOS"
                            :append="form_data.mos_score"
                        >
                            <b-form-input
                                id="range-mos"
                                v-model="form_data.mos_score"
                                type="range"
                                min="1"
                                max="5"
                                step="0.5"
                            ></b-form-input>
                        </b-input-group>

                        <b-button type="submit" variant="primary"
                            >Submit</b-button
                        >
                    </b-form>
                </b-col>
                <b-col cols="3"></b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import Player from "./Player.vue";
export default {
    name: "SurveyPage",
    components: {
        Player,
    },
    props: ['page_num', 'audio_url', 'description'],
    data: () => {
        return {
            form_data: {
                mos_score: "0",
            },
        };
    },
    methods: {
        onSubmit(event) {
            event.preventDefault();
            this.$emit('submission', {page_num : this.page_num, scores : this.form_data})
        }
    },
};
</script>

<style scoped>
.input-line {
    margin-bottom: 1em;
    margin-top: 1em;
}
</style>