export default function SidebarModal({
    isOpen,
    onClose,
    title = "Details",
    children,
}) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-[9998] bg-black/10 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Sidebar Panel with Glassmorphism */}
            <div
                className="fixed top-0 right-0 h-full w-[800px] z-[9999]
                           bg-white/35 backdrop-blur-lg shadow-2xl border border-white/20
                           rounded-l-2xl flex flex-col"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-[14px] border-b border-white/30">
                    <h2 className="text-lg font-semibold text-white">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-2xl text-white hover:text-red-400 transition"
                    >
                        &times;
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 text-sm text-white space-y-4 overflow-y-auto h-full">
                    {children}
                </div>
            </div>
        </>
    );
}
