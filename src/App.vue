<template>
    <div id="app">
        <Toprule
            @logout="onlogout"
            :part_name="current.part_name"
            :survey_name="description.name"
            :page_num="current.page_num"
        />
        <Bottomrule :bar_value="current_progress" :bar_ends="is_finished" />
        <Sidelist
            :pages="page_state"
            @page-flip="onPageflip"
            :page_num="current.page_num"
        />
        <component
            :is="current.survey_page_instance"
            :v-if="current.inited"
            :page_num="current.page_num"
            :page_content="current_page_content"
            :page_state="current_page_state"
            :response="response"
            :global_desc="description.description"
            :key="current.page_num"
            @submission="onSubmission"
        />

        <b-overlay :show="show_succ_overlay" no-wrap fixed>
            <template #overlay>
                <div class="text-center">
                    <b-icon
                        icon="check2-circle"
                        font-scale="3"
                        style="margin-bottom: 20px"
                    ></b-icon>
                    <h4>Thank you!</h4>
                    <p>Your results have been uploaded.</p>
                    <b-button
                        ref="cancel"
                        variant="outline-danger"
                        size="lg"
                        @click="current.overlay_state = Overlay.hidden"
                    >
                        Ok
                    </b-button>
                </div>
            </template>
        </b-overlay>
        <b-overlay :show="show_load_overlay" no-wrap fixed>
            <template #overlay>
                <div class="text-center">
                    <b-icon
                        icon="three-dots"
                        animation="cylon"
                        font-scale="4"
                    ></b-icon>
                    <h4>Loading Survey...</h4>
                </div>
            </template>
        </b-overlay>
        <b-overlay :show="show_error_overlay" no-wrap fixed>
            <template #overlay>
                <div class="text-center">
                    <b-icon
                        icon="bug-fill"
                        variant="danger"
                        animation="spin-pulse"
                        font-scale="4"
                    ></b-icon>

                    <h4 style="margin-top: 10px">
                        {{ current.error_message }}
                    </h4>
                </div>
            </template>
        </b-overlay>

        <b-overlay :show="show_login_overlay" no-wrap fixed>
            <template #overlay>
                <LoginForm @logincomplete="on_login_complete" />
            </template>
        </b-overlay>
    </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Toprule from "./components/Toprule";
import SurveyPage from "./components/Survey_page.vue";
import Sidelist from "./components/Sidelist";
import Bottomrule from "./components/Bottomrule";
import LoginForm from "./components/LoginForm";
import axios from "axios";
import Cookies from "js-cookie";
import { Overlay, Page, response_to_enum, INVALID_SCORE } from "./headers";

export default {
    name: "App",
    components: {
        // HelloWorld,
        Toprule,
        // SurveyPage,
        Sidelist,
        Bottomrule,
        LoginForm,
    },
    data: () => {
        return {
            current: {
                part_name: "未登录",
                page_num: -1,
                overlay_state: Overlay.hidden,
                error_message: "",
                inited: false,
                survey_page_instance: HelloWorld,
                survey_key: -1,
            },

            description: {
                name: "",
                description: "",
            },

            response: [-1].map(() => {
                return {
                    name: "default name",
                    type: "MOS",
                    desc: "default description",
                };
            }),

            page_content: [-1].map((idx) => {
                return {
                    page_num: idx,
                    stimuli: [],
                };
            }),

            page_state: [-1].map((idx) => {
                return {
                    page_num: idx,
                    scores: {},
                    state: Page.todo,
                };
            }),
        };
    },
    computed: {
        current_page_content: function () {
            return this.page_content[this.current.page_num];
        },
        current_page_state: function () {
            return this.page_state[this.current.page_num];
        },

        n_finished: function () {
            return this.page_state
                .map((pg) => {
                    return pg.state == Page.done ? 1 : 0;
                })
                .reduce((a, b) => {
                    return a + b;
                });
        },
        current_progress: function () {
            return (this.n_finished / this.page_state.length) * 100;
        },
        is_finished: function () {
            return this.n_finished == this.page_state.length;
        },

        show_load_overlay: function () {
            return this.current.overlay_state == Overlay.loading;
        },

        show_succ_overlay: function () {
            return this.current.overlay_state == Overlay.succ;
        },

        show_error_overlay: function () {
            return this.current.overlay_state == Overlay.error;
        },

        show_login_overlay: function () {
            return this.current.overlay_state == Overlay.login;
        },
    },
    created() {
        console.log("app created");

        if (Cookies.get("part_email") != undefined) {
            this.current.part_name = Cookies.get("part_email");
            this.start_load_survey_content();
        } else {
            this.current.overlay_state = Overlay.login;
        }
    },
    methods: {
        onlogout() {
            Cookies.remove("part_email");
            location.reload();
        },
        onPageflip(pg) {
            // called on sidebar pageflip
            this.current.page_num = pg.target.page_num;
        },
        onSubmission(result) {
            const { page_num, scores } = result;
            axios
                .post("/survey/submit", {
                    instance_id: this.current.survey_key,
                    page_num: page_num,
                    scores: scores,
                })
                .then((response) => {
                    if (response.data.succ) {
                        // a success response alters the front-end state
                        this.page_state[page_num].scores = scores;
                        this.page_state[page_num].state = Page.done;
                        if (this.is_finished) {
                            this.current.overlay_state = Overlay.succ;
                        }
                    } else {
                        // get application error
                        alert(
                            `something went wrong submitting the last page, please return and re-sbumit ${page_num}`
                        );
                    }
                })
                .catch(() => {
                    // get network error
                    alert(
                        `something went wrong submitting the last page , please return and re-sbumit${page_num}`
                    );
                });

            this.nextPage();
        },
        nextPage() {
            // called by onSubmission to flip to nextpage
            let npg = this.current.page_num + 1;
            if (npg < this.page_content.length) {
                // success flip
                this.current.page_num = npg;
            } // do nothing if at last page
        },

        on_login_complete(login_data) {
            // called on login complete
            this.current.part_name = login_data.email;
            Cookies.set("part_email", login_data.email, { expires: 1 });
            this.start_load_survey_content();
        },

        start_load_survey_content() {
            // called by on_login_complete or automatic login when cookie is detected

            // 1. setup loading scree
            this.current.overlay_state = Overlay.loading;

            // 2. request content
            axios
                .post("/survey/create", {
                    part: Cookies.get("part_email"),
                    survey_key: this.$route.query.survey_id,
                })
                .then((response) => {
                    if (response.data.succ) {
                        //
                        this.render_survey_content(response.data.data);
                        this.current.overlay_state = Overlay.hidden;
                    } else {
                        // app error
                        this.current.overlay_state = Overlay.error;
                        this.current.error_message = response.data.data;
                    }
                })
                .catch(() => {
                    this.current.overlay_state = Overlay.error;
                    alert(`something went wrong during fetching survey`);
                });
        },

        render_survey_content(content) {
            /**
             * content = {
             *      instance_id : keyid,
             *      description : {
             *          "survey_group" : string,
             *          "survey_name"  : string,
             *          "survey_legnth" : number,
             *          "survey_content" : {}
             *      },
             *      state : {}
             * }
             */

            const { instance_id, description, state } = content;

            this.current.survey_key = instance_id;

            // 1. deal with description
            // 1.1 response
            this.response = description.survey_content.responses.map((resp) => {
                return {
                    name: resp.name,
                    type: response_to_enum(resp.type),
                    desc: resp.desc,
                };
            });
            // 1.2 page_content
            this.page_content = description.survey_content.stimuli.map(
                (stm, idx) => {
                    return {
                        page_num: idx,
                        stimuli: stm,
                    };
                }
            );

            // 1.3 description
            this.description = {
                name: `${description.survey_group}::${description.survey_name}`,
                description: description.survey_content.survey_description,
            };

            // 2. deal with state
            console.log(state);
            // state : [{page_num : int, score : {name1 : {v : score}}}]

            // initialize local state
            this.page_state = description.survey_content.stimuli.map(
                (stm, idx) => {
                    const t_scores = {};
                    this.response.forEach((resp) => {
                        t_scores[resp.name] = { v: INVALID_SCORE };
                    });
                    return {
                        page_num: idx,
                        state: Page.todo,
                        scores: t_scores, // {name : {v: value}} because binded objects can't be basic
                    };
                }
            );

            // update local state to server state
            state.forEach((stt) => {
                const { page_num, score } = stt;
                this.page_state[page_num].state = Page.done;
                this.page_state[page_num].scores = score;
            });

            this.current.inited = true;
            this.current.survey_page_instance = SurveyPage;
            this.current.page_num = 0;
        },
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

.markdown {
    text-align: left;
}
</style>


