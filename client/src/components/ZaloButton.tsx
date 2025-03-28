import React from 'react';

export function ZaloButton() {
  return (
    <a
      href="https://zalo.me/your-zalo-id"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#0068FF] text-white shadow-lg hover:bg-[#0054CC] transition-colors"
      aria-label="Chat on Zalo"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.545,3C7.866,3,4.069,6.797,4.069,11.476c0,2.815,1.379,5.314,3.531,6.855c0,0,0.276,0 0.156,0.614s-0.332,2.151-0.332,2.151s-0.073,0.298,0.167,0.373c0.239,0.075,0.958-0.56,1.504-1.031c0.42-0.363,0.604-0.634,0.604-0.634c1.901,0.369,3.935,0.035,5.57-0.83c2.723-1.445,4.013-4.175,3.49-6.872C18.545,6 15.224,3,12.545,3z M9.5,14.5h-2v-5h2V14.5z M14.5,14.5h-2v-5h2V14.5z"/>
      </svg>
    </a>
  );
}