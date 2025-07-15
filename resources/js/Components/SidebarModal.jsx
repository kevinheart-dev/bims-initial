export default function SidebarModal({ isOpen, onClose, title = "Details", children }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-[9998]"
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <div
                className="fixed top-0 right-0 h-full w-[800px] z-[9999]
                           bg-white/40 backdrop-blur-sm border-l border-white/30 shadow-xl"
            >
                <div className="flex justify-between items-center p-4 border-b border-white/30">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <button onClick={onClose} className="text-2xl text-white">&times;</button>
                </div>

                <div className="p-6 text-sm text-white space-y-4">
                    {children}
                </div>
            </div>
        </>
    );
}
