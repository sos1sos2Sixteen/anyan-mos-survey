<template>
    <div class="SurveyPage">
        <b-container>
            <b-row>
                <b-col cols="2"></b-col>
                <b-col cols="8">
                    <markduck class="markdown" :markdown="global_desc" />
                    <player
                        v-for="(alink, index) in page_content.stimuli"
                        :key="`${alink}_${index}`"
                        :audio_link="alink"
                    />
                </b-col>
                <b-col cols="2"></b-col>
            </b-row>

            <b-row>
                <b-col cols="3"></b-col>
                <b-col cols="6">
                    <b-form @submit="onSubmit">
                        <div v-for="(resp, idx) in response" :key="idx">
                            <b-input-group
                                v-if="is_MOS(resp.type)"
                                class="spaced"
                                :prepend="resp.name"
                                :append="to_equal_width(form_data[resp.name].v)"
                            >
                                <b-form-input
                                    id="range-mos"
                                    v-model="form_data[resp.name].v"
                                    type="range"
                                    min="1"
                                    max="5"
                                    step="0.5"
                                ></b-form-input>
                            </b-input-group>

                            <b-form-group
                                v-if="is_ABX(resp.type)"
                                :label="resp.name"
                            >
                                <b-form-radio-group v-model="form_data[resp.name].v">
                                    <b-form-radio value="A">A</b-form-radio>
                                    <b-form-radio value="X">X</b-form-radio>
                                    <b-form-radio value="B">B</b-form-radio>
                                </b-form-radio-group>
                            </b-form-group>
                        </div>

                        <b-button class="spaced" type="submit" variant="primary"
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
import markduck from "markduckjs";
import rehypePrism from "@mapbox/rehype-prism";
import "prismjs/themes/prism.css";
import { INVALID_SCORE, Response_type } from "../headers";

// let dcopy = function(x) {
//     return JSON.parse(JSON.stringify(x))
// }

/**
 * props
 *
 * page_num : int, current page index
 * page_content : {page_num : idx, stimuli : [string]}
 * page_state : {page_num : idx, scores : {name1 : {v: value_1}}, state : Page}
 * response : [{idx : int, name : string, type : Response_type, desc : String}]
 */

export default {
    name: "SurveyPage",
    components: {
        Player,
        markduck: markduck({
            rehypePlugins: [rehypePrism],
        }),
    },
    props: [
        "page_num",
        "page_content",
        "page_state",
        "response",
        "global_desc",
    ],
    data: () => {
        return {
            form_data: {},
        };
    },
    computed: {
        valid_submission() {
            // TODO wrong impl
            return this.response
                .map((resp) => {
                    return this.form_data[resp.name].v != INVALID_SCORE;
                })
                .reduce((a, b) => {
                    return a && b;
                });
        },
    },

    created() {
        this.response.forEach((resp) => {
            this.form_data[resp.name] = this.page_state.scores[resp.name];
        });
    },
    methods: {
        onSubmit(event) {
            event.preventDefault();
            if (this.valid_submission) {
                this.$emit("submission", {
                    page_num: this.page_num,
                    scores: this.form_data,
                });
            } else {
                alert("please provide valid inputs to all fields to continue");
            }
        },
        to_equal_width(score) {
            // score : string
            return `${Number(score).toFixed(1)}`;
        },

        is_MOS(ty) {
            return ty == Response_type.MOS;
        },
        is_ABX(ty) {
            return ty == Response_type.ABX;
        },
    },
};
</script>

<style scoped>
.spaced {
    margin-top: 1em;
    margin-bottom: 1em;
}

.SurveyPage {
    margin-bottom: 20px;
}
</style>