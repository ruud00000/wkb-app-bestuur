<template>
    <input 
        v-bind="$attrs"
        class="form-control" 
        required
        @input="$emit('update:modelValue', $event.target.value)"
    />
</template>

<script setup>
    defineProps({
        modelValue: String
    })
    const emit = defineEmits(["update:modelValue"])
</script>