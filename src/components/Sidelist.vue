<template>
    <div>
        <b-sidebar id="sidebar-1" title="问卷目录" shadow right>
            <div class="px-3 py-2">
                <p>
                    下面列出了本次问卷的所有题号。其中<span class="text-success">绿色</span>按钮代表已经完成，
                    而灰色代表未完成。
                </p>
                <div>
                    <b-button
                        class='page-item'
                        pill
                        v-for="(p_state,idx) in pages" 
                        :key="idx" 
                        :variant="get_page_variant(idx, p_state.state)"
                        @click="(e)=>{return partial_onclick(p_state, e)}"
                    >{{p_state.page_num}}
                    </b-button>
                </div>
            </div>
        </b-sidebar>
    </div>
</template>


<script>
import {Page} from '../headers'

export default {
    name: "Sidelist",
    props : ['pages', 'page_num'],
    data: () => {
        return {
            truth : true,
            xs: [1, 2, 3, 4, 5, 6],
            variant_map : {
                [Page.done] : 'success',
                [Page.todo] : 'dark'
            },
        };

    },
    methods: {
        partial_onclick(page, e){
            e.preventDefault()
            // alert(JSON.stringify(page))
            this.$emit('page-flip', {target:page})
        },
        get_page_variant(idx, state) {

            if (idx == this.page_num) {
                return `${this.variant_map[state]}`
            }else{
                return `outline-${this.variant_map[state]}`
            }
        }
    }
};
</script>

<style scoped>
.page-item{
    /* height: 2em; */
    /* padding:5px; */
    width:3em;
    float : left;
    margin : 10px

}
</style>