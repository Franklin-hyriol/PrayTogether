import "./StatCard.scss";
import NumberFlow from '@number-flow/react'

type StatCardProps = {
    icon: React.ReactNode,
    value: number,
    label: string
    className?: string
}

function StatCard({ icon, value, label, className }: StatCardProps) {
    return (
        <div className={`p-6 rounded-lg text-center shadow-md border border-gray-200 transition-all duration-300 ease-in-out flex flex-col items-center gap-2 flex-1 min-w-[155px] ${className}`}>
            <div className={`stat-icon w-12 h-12 rounded-full flex items-center justify-center text-[28px] mb-2 ${className}`}>
                {icon}
            </div>
            <div className={`text-3xl font-semibold mb-2 ${className} !bg-transparent`}><NumberFlow value={value} /></div>
            <div className="text-sm text-gray-500">{label}</div>
        </div>
    );
}

export default StatCard;