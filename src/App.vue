<template>
    <div id="app">
        <Toprule />
        <Bottomrule :bar_value="current_progress" :bar_ends="is_finished"/>
        <Sidelist :pages="pages" @page-flip="onPageflip" />
        <SurveyPage
            :audio_url="pages[current.page_num].audio_link"
            :description="pages[current.page_num].description"
            :page_num="current.page_num"
            :key="current.page_num"
            @submission="onSubmission"
        />
        <!-- <SurveyPage :audio_url="app_link" :description="page1"></SurveyPage> -->
        <!-- <HelloWorld :msg="shiyao" /> -->
    </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
import Toprule from "./components/Toprule";
import SurveyPage from "./components/Survey_page.vue";
import Sidelist from "./components/Sidelist"
import Bottomrule from "./components/Bottomrule"
// import Vue from 'vue'
// import * as Vue from "vue"

// const SurveyPageClass = Vue.extend(SurveyPage)

export default {
    name: "App",
    components: {
        // HelloWorld,
        Toprule,
        SurveyPage,
        Sidelist,
        Bottomrule,
    },
    data: () => {
        return {
            current : {
                page_num : 0,
                survey_page_instance : SurveyPage
            },
            shiyao: require("./assets/debug_3.wav"),
            pages : [0,1,2,3,4,5,6,7].map((idx)=>{
                return {
                    idx : `unique_idx_${idx}`,
                    page_num : idx,
                    audio_link : require(`./assets/debug_${idx}.wav`),
                    description : `description for page : ${idx}`,
                    scores : {},
                    state : 'todo'
                }
            })
        };
    },
    computed: {
        n_finished : function() {
            return this.pages.map((pg)=>{return pg.state=='done'?1:0})
                             .reduce((a,b)=>{return a+b})
        },
        current_progress : function() {
            return (this.n_finished / this.pages.length) * 100
        },
        is_finished : function() {
            return this.n_finished == this.pages.length
        }

    },
    methods: {
        onPageflip(pg) {
            this.current.page_num = pg.target.page_num
        },
        onSubmission(result) {
            const {page_num, scores} = result
            console.log(page_num)
            this.pages[page_num].scores = scores
            this.pages[page_num].state  = 'done'
            this.nextPage()

            if(this.is_finished) {
                // if finished, roll celebration flag
                
            }
        },
        nextPage(){
            let npg = this.current.page_num + 1
            if (npg < this.pages.length) {
                // success flip
                this.current.page_num = npg
            }   // do nothing if at last page
        }
    }
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
</style>


