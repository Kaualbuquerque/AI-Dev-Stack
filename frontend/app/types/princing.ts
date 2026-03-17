export type PricingType = 'Free' | 'Freemium' | 'Paid'

export const pricingConfig: Record<PricingType, { label: string; className: string; icon: string }> = {
    Free: { label: 'Free', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: '🎉' },
    Freemium: { label: 'Freemium', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: '✨' },
    Paid: { label: 'Paid', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '💎' },
};

