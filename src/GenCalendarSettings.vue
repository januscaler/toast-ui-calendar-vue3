<template>
	<v-dialog :theme="darkMode ? 'dark' : 'light'" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600">
		<template v-slot:activator="{ props: activatorProps }">
			<slot name="activator" v-bind="{ props: activatorProps }"></slot>
		</template>

		<v-card>
			<template #title>
				<div class="tw:flex tw:justify-between tw:items-center">
					<div class="tw:flex tw:items-center tw:gap-x-[10px]">
						<v-icon>fas fa-gear</v-icon>
						<span>{{ $t('settings.title') }}</span>
					</div>
					<v-btn @click="$emit('update:modelValue', false)" density="compact" color="red" icon>
						<v-icon>fas fa-close</v-icon>
					</v-btn>
				</div>
			</template>
			<v-card-text>
				<v-row dense>
					<v-col cols="12">
						<v-select
							:model-value="primaryTimezone"
							item-title="text"
							item-value="value"
							@update:model-value="$emit('update:primaryTimezone', $event)"
							:items="timeZonesForSelect"
							:label="$t('settings.primaryTimezone')"
							required
						></v-select>
					</v-col>
					<v-col cols="12">
						<v-select
							item-title="text"
							item-value="value"
							:model-value="secondaryTimezone"
							@update:model-value="$emit('update:secondaryTimezone', $event)"
							:items="timeZonesForSelect"
							:label="$t('settings.secondaryTimezone')"
							required
						></v-select>
					</v-col>
				</v-row>
			</v-card-text>

			<v-divider></v-divider>
		</v-card>
	</v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	darkMode: boolean;
	modelValue: boolean;
	timeZones: any[];
	primaryTimezone?: string;
	secondaryTimezone?: string;
}>();
defineEmits(['update:modelValue', 'update:primaryTimezone', 'update:secondaryTimezone']);

const timeZonesForSelect = computed(() => {
	return props.timeZones.map((tz) => ({
		text: tz.displayLabel,
		value: tz.timezoneName,
	}));
});
</script>

<style scoped></style>
