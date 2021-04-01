<template>
    <div>
        <b-sidebar id="sidebar-1" title="Sidebar" shadow right>
            <div class="px-3 py-2">
                <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo
                    odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                    risus, porta ac consectetur ac, vestibulum at eros.
                </p>
                <div>
                    <b-button
                        class='page-item'
                        pill
                        v-for="page in pages" 
                        :key="page.idx" 
                        :variant="variant_map[page.state]"
                        @click="(e)=>{return partial_onclick(page, e)}"
                    >{{page.page_num}}
                    </b-button>
                </div>
            </div>
        </b-sidebar>
    </div>
</template>


<script>
export default {
    name: "Sidelist",
    props : ['pages'],
    data: () => {
        return {
            truth : true,
            xs: [1, 2, 3, 4, 5, 6],
            variant_map : {
                'done' : 'outline-success',
                'todo' : 'outline-dark'
            }
        };

    },
    methods: {
        partial_onclick(page, e){
            e.preventDefault()
            // alert(JSON.stringify(page))
            this.$emit('page-flip', {target:page})
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