<template>
    <div class="form-group mb-3">
        <Label :class="labelClasses">{{ label }}</Label>
        <Input :class="inputClasses" :placeholder="placeholder" :type="type" />
    </div>
</template>

<script setup>
    import { defineAsyncComponent } from 'vue'

    const Input = defineAsyncComponent(() => import('./Input.vue'))
    const Label = defineAsyncComponent(() => import('./Label.vue'))

    defineProps({
        type: String,
        placeholder: String,
        label: String,
        labelClasses: String,
        inputClasses: String
    })
</script>

