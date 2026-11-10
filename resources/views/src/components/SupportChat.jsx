import React from 'react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/15753862748"
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
      id="whatsapp-support-btn"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 hover:bg-[#20ba5a] hover:shadow-[0_0_22px_rgba(37,211,102,0.7)] group"
    >
      {/* Ping animation ring */}
      <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-20" />

      <svg
        width="28"
        height="28"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="relative transition-transform group-hover:rotate-6"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.407 9.862-9.83.001-2.628-1.02-5.1-2.871-6.953C16.593 1.99 14.12 1.01 11.5 1.01c-5.44 0-9.863 4.41-9.866 9.833-.001 1.762.48 3.487 1.396 4.992l-.995 3.63 3.733-.974zm11.144-7.535c-.328-.163-1.94-.954-2.24-1.063-.3-.11-.518-.163-.737.163-.219.327-.847 1.063-1.038 1.282-.19.217-.382.244-.71.081-1.123-.563-1.92-.93-2.678-2.23-.195-.336.195-.312.558-1.036.06-.12.03-.223-.015-.313-.045-.09-.41-1.01-.563-1.378-.15-.36-.315-.31-.41-.315l-.35-.005c-.246 0-.645.093-.982.463-.337.37-1.287 1.253-1.287 3.052 0 1.8 1.309 3.54 1.49 3.785.183.245 2.57 3.932 6.24 5.51 2.89 1.237 3.48 1.01 4.73 1.01.812 0 1.62-.397 1.848-1.007.228-.61.228-1.137.16-1.246-.07-.11-.257-.163-.585-.327z" />
      </svg>

      {/* Tooltip */}
      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-md bg-black/80 px-3 py-1.5 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 border border-white/10">
        Chat on WhatsApp
      </span>
    </a>
  );
}
