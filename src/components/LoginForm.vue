<template>
    <div>
        <b-form @submit="onSubmit">
            <b-form-group
                id="input-group-1"
                label="Email address:"
                label-for="input-1"
                description="仅用于区分用户，只需要输入合法的、唯一的邮箱即可"
            >
                <b-form-input
                    id="input-1"
                    v-model="form.email"
                    type="email"
                    placeholder="Enter email"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-checkbox
                id="checkbox-1"
                v-model="form.is_pro"
                name="checkbox-1"
                value="true"
                unchecked-value="false" 
            >
                我从事语音方面的研究/经常接触合成语音
            </b-form-checkbox>

            <h1></h1>

            <b-button type="submit" variant="primary">进入问卷</b-button>
        </b-form>
    </div>
</template>


<script>

import axios from "axios"

export default {
    name: "LoginForm",
    data() {
        return {
            form: {
                email: "",
                is_pro: "false",
            },
        };
    },
    methods: {
        onSubmit(e) {
            e.preventDefault()
            axios.post('/survey/login', {
                email : this.form.email,
                is_pro : (this.form.is_pro == "true")
            }).then((response)=>{
                if (response.data.succ) {
                    // succ
                    this.$emit('logincomplete', {email : response.data.data.email})
                }else{
                    // failure
                    alert(`login failure due to ${response.data.data}`)
                }
            })
            // new Promise((resolve)=>{
            //     setTimeout(resolve, 2000);
            // }).then(()=>{
            //     console.log("time out done")
            //     this.$emit("logincomplete", this.form)
            // })

        }
    }
};
</script>