import { ref, Ref, readonly  } from 'vue';

export enum LabelTypes {
    Year,
    HalfYears,
    QuarterYears,
    Months,
    Weeks,
    Days
};

export function useLabels() {
    const labelType = ref(LabelTypes.Year);
    const labelCount = ref(0);
    const labels = ref([]);
    const dateRange = ref([new Date(), new Date()]);

    const setDateRange = (start: Date, end: Date) => {
        if (start > end) {
            dateRange.value = [end, start];
        }

        if (!start && end < new Date()) {
            throw new Error('start date required');
        }

        if (!end && start > new Date()) {
            throw new Error('end date required');
        }

        dateRange.value = [start, end]
    };

    const setLabelCount = (count: number) => {
        labelCount.value = Math.abs(count);
    };

    const setLabelType = (type: LabelTypes) => {
        labelType.value = type;
    }

    return {
        labels: readonly(labels),
        labelType: readonly(labelType),
        setLabelType,
        setLabelCount,
        setDateRange,
    };
}