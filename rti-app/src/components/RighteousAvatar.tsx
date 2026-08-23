export const RighteousAvatar = ({ size = 48, state = 'idle' }: { size?: number, state?: 'idle' | 'typing' | 'listening' }) => {
  const orbitAnim = state === 'listening' ? 'orbit-pulse 1s ease-in-out infinite' : 'orbit-spin 3s linear infinite';
  const faceAnim = state === 'idle' ? 'look-around 6s ease-in-out infinite' :
                   state === 'typing' ? 'reading 1.5s ease-in-out infinite' : 'none';

  return (
    <span className="inline-flex items-center justify-center relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <circle cx="24" cy="24" r="16" fill="#00F5A0"/>
        
        <g style={{ animation: faceAnim }}>
          <circle cx="19" cy="21" r="2" fill="#111"/>
          <circle cx="29" cy="21" r="2" fill="#111"/>
          
          {state === 'typing' && (
            <g>
              <rect x="14" y="16" width="10" height="10" rx="2.5" stroke="#111" strokeWidth="2.5" fill="rgba(255,255,255,0.4)" />
              <rect x="24" y="16" width="10" height="10" rx="2.5" stroke="#111" strokeWidth="2.5" fill="rgba(255,255,255,0.4)" />
              <path d="M10 21 L14 21 M34 21 L38 21" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {state !== 'typing' && (
            <path d="M19 27 Q24 32 29 27" stroke="#111" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
          )}
        </g>

        <g style={{ transformOrigin: '24px 24px', animation: orbitAnim }}>
          <path d="M8 26 Q5 14 18 9" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M36 9 Q47 18 40 30" stroke="#111" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          <path d="M38 32 L40 30 L36 30" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </g>

        {state === 'typing' && (
          <g style={{ animation: 'doc-bob 2s ease-in-out infinite' }}>
            <rect x="13" y="28" width="22" height="20" fill="#fff" stroke="#111" strokeWidth="2" rx="2" />
            <path d="M17 34 L31 34 M17 39 L31 39 M17 44 L25 44" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="13" cy="38" r="3.5" fill="#00F5A0" stroke="#111" strokeWidth="2" />
            <circle cx="35" cy="38" r="3.5" fill="#00F5A0" stroke="#111" strokeWidth="2" />
          </g>
        )}
      </svg>
      <style>{`
        @keyframes orbit-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes orbit-pulse { 0%, 100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes doc-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        @keyframes look-around {
          0%, 100% { transform: translate(0, 0); }
          10%, 20% { transform: translate(2px, -2px); }
          30%, 40% { transform: translate(-2px, 1px); }
          50%, 60% { transform: translate(3px, 0px); }
          70% { transform: translate(0px, 0px); }
          80%, 90% { transform: translate(0px, 2px); }
        }
        @keyframes reading {
          0%, 100% { transform: translate(-2px, 0); }
          25% { transform: translate(0px, 0); }
          50% { transform: translate(2px, 0); }
          75% { transform: translate(0px, 0); }
        }
      `}</style>
    </span>
  );
};
