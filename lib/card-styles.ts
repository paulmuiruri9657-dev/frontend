export const CARD_STYLES = {
    standard: {
        width: 'w-[160px] sm:w-[180px] md:w-[200px]',
        imageHeight: 'h-[160px] sm:h-[180px] md:h-[200px]',
    },
    compact: {
        width: 'w-[140px] sm:w-[160px] md:w-[180px]',
        imageHeight: 'h-[140px] sm:h-[160px] md:h-[180px]',
    },
    flash: {
        width: 'w-[150px] sm:w-[170px] md:w-[190px]',
        imageHeight: 'h-[150px] sm:h-[170px] md:h-[190px]',
    }
} as const;

export type CardVariant = keyof typeof CARD_STYLES;
