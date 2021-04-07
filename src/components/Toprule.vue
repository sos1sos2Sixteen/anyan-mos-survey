<template>
    <b-navbar toggleable="sm" type="dark" variant="dark" fixed="top">
        <b-navbar-brand
            ><b-icon icon="soundwave" /> ANYAN MOS Surveyer</b-navbar-brand
        >

        <b-navbar-nav>
            <b-nav-text></b-nav-text>
            <b-button v-b-toggle.sidebar-1>第{{page_num}}页</b-button>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
            <b-nav-text></b-nav-text>
            <b-nav-text><b-icon icon="paperclip" /></b-nav-text>
            <b-nav-item-dropdown :text="part_name" right>
                <b-dropdown-item>{{ survey_name }}</b-dropdown-item>
                <b-dropdown-item @click="onlogout"
                    ><span class="text-danger">退出</span></b-dropdown-item
                >
            </b-nav-item-dropdown>
        </b-navbar-nav>
    </b-navbar>
</template>

<script>
export default {
    name: "Toprule",
    props: ["page_num","part_name", "survey_name"],
    methods: {
        onlogout(e) {
            e.preventDefault();
            this.$emit("logout");
        },
    },
};
</script>