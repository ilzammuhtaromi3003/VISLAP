<template lang="">
    <v-footer class="d-flex flex-column mx-n4 mt-8 pb-0" border>
            <div class="bg-white text-blue-darken-3 d-flex w-100 align-center px-4">
            <strong>Get connected with us on social networks!</strong>

            <v-spacer></v-spacer>

            <v-btn
                v-for="icon in icons"
                :key="icon"
                class="mx-4"
                :icon="icon"
                variant="plain"
                size="small"
            ></v-btn>
            </div>

            <div class="px-4 py-2 bg-blue-darken-3 text-center w-100">
            2023 — <strong>Vislap</strong>
            </div>
        </v-footer>
</template>
<script>
export default {
    data() {
        return {
            icons: [
                'mdi-facebook',
                'mdi-twitter',
                'mdi-linkedin',
                'mdi-instagram',
            ],
        }
    },
}
</script>
<style lang="">
    
</style>