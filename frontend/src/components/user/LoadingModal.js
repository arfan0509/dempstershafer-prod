import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const LoadingModal = () => {
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [showCompleteMessage, setShowCompleteMessage] = useState(false);
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev === 99) {
                    clearInterval(timer);
                    setTimeout(() => {
                        setShowCompleteMessage(true); // Show "Diagnosis selesai"
                        setTimeout(() => {
                            setCompleted(true); // Hide after 2 seconds
                        }, 2000);
                    }, 0);
                }
                return prev + 1;
            });
        }, 30); // Update progress every 30ms
        return () => clearInterval(timer); // Clean up on unmount
    }, []);
    return (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50", children: _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-1/3 text-center", children: [_jsxs("div", { className: "mb-4", children: [_jsx("div", { className: "relative w-full h-6 bg-gray-200 rounded-full overflow-hidden", children: _jsx("div", { className: "absolute top-0 left-0 h-full bg-[#4F81C7] transition-all duration-300", style: { width: `${progress}%` } }) }), _jsxs("div", { className: "mt-2 text-xl font-semibold text-[#4F81C7]", children: [progress, "%"] })] }), _jsx("p", { className: "text-lg font-semibold text-gray-700", children: "Memproses Diagnosis..." }), showCompleteMessage && !completed && (_jsxs("div", { className: "mt-4 text-green-600 text-xl font-bold", children: [_jsx("span", { className: "text-2xl", children: "\u2714" }), " Diagnosis Selesai"] }))] }) }));
};
export default LoadingModal;
