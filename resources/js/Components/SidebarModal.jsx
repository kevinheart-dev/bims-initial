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
                className="fixed top-0 right-0 h-full w-[700px] z-[9999]
                           bg-white  shadow-xl flex flex-col"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-[14px] border-b border-black">
                    <h2 className="text-lg font-semibold text-black">{title}</h2>
                    <button onClick={onClose} className="text-2xl text-black">&times;</button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 text-sm text-white space-y-4 overflow-y-auto h-full">
                    {children}
                </div>
            </div>
        </>
    );
}
