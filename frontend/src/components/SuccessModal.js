import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion"; // ✅ Animasi dengan Framer Motion
const SuccessModal = ({ isOpen, message, onClose }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50", children: _jsxs(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { duration: 0.3 }, className: "bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center", children: [_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: "spring", stiffness: 260, damping: 20 }, className: "flex justify-center items-center bg-green-100 rounded-full w-20 h-20 mx-auto mb-4", children: _jsx("svg", { className: "w-12 h-12 text-green-500", fill: "none", stroke: "currentColor", strokeWidth: "3", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) }) }), _jsx("h3", { className: "text-2xl font-semibold text-gray-800 mb-2", children: "Berhasil!" }), _jsx("p", { className: "text-gray-600 mb-4", children: message }), _jsx("button", { onClick: onClose, className: "w-full py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-500 transition duration-300", children: "Tutup" })] }) }));
};
export default SuccessModal;
