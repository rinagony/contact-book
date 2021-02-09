<template>
    <div>
        <h3>1</h3>
    </div>
</template>

<script>
export default {
    data() {
        return {
            person: {},
        }
    },
    methods: {
        test() {
            let a = {name: 'Alice', age: 20};
            this.person = a;
            a.age = 30;
            let b = a;
            console.log(b);
        }
    },
    created() {
        this.test()
    }
}
</script>