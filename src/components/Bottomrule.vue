<template>
    <!-- <b-navbar toggleable="lg" type="dark" variant="default" fixed="bottom"> -->
        <b-progress :value="bar_value" :variant="bar_variant"></b-progress>
    <!-- </b-navbar> -->
</template>

<script>
export default {
    name: "Bottomrule",
    props: ["bar_value", "bar_ends"],
    computed: {
        bar_variant : function(){
            if (this.bar_ends == true){
                return 'sucess'
            }else{
                return 'warning'
            }
        }
    }
};
</script>