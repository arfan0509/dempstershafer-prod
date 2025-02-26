import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ModalKonfirmasi = ({ isOpen, message, onConfirm, onCancel, }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4", children: _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-center", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-800 mb-4", children: "Konfirmasi" }), _jsx("p", { className: "text-gray-600 mb-6", children: message }), _jsxs("div", { className: "flex justify-center gap-3", children: [_jsx("button", { onClick: onCancel, className: "px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition", children: "Batal" }), _jsx("button", { onClick: onConfirm, className: "px-4 py-2 bg-[#4F81C7] text-white rounded-md hover:bg-[#3A6BA8] transition", children: "Konfirmasi" })] })] }) }));
};
export default ModalKonfirmasi;
