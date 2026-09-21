import React from 'react';

interface AdvancedToolsSectionProps {
  onOpenCompare: () => void;
  onOpenFileEncryptor: () => void;
  onOpenFrequencyAttack: () => void;
  onOpenWorkbook: () => void;
}

export const AdvancedToolsSection: React.FC<AdvancedToolsSectionProps> = ({
  onOpenCompare,
  onOpenFileEncryptor,
  onOpenFrequencyAttack,
  onOpenWorkbook,
}) => {
  const tools = [
    {
      id: 'btn-launch-matrix',
      name: 'Compare Ciphers',
      description: 'Side-by-side benchmark of keyspace dimensions and performance.',
      icon: 'compare_arrows',
      bg: 'bg-[#5ED9D1]',
      action: onOpenCompare,
      btnText: 'Compare',
    },
    {
      id: 'btn-run-analysis',
      name: 'Frequency Attack',
      description: 'Automated letter frequency analysis to crack unknown Caesar shifts.',
      icon: 'analytics',
      bg: 'bg-[#FF7373]',
      action: onOpenFrequencyAttack,
      btnText: 'Analyze',
    },
    {
      id: 'btn-open-encryptor',
      name: 'File Encryptor',
      description: 'Client-side file encryption for .txt and text documents.',
      icon: 'upload_file',
      bg: 'bg-[#B8F28B]',
      action: onOpenFileEncryptor,
      btnText: 'Encrypt File',
    },
    {
      id: 'btn-browse-workbook',
      name: 'Reference Guide',
      description: 'Mathematical foundations, formulas, and principles.',
      icon: 'menu_book',
      bg: 'bg-[#FFE066]',
      action: onOpenWorkbook,
      btnText: 'View Guide',
    },
  ];

  return (
    <section className="w-full pt-4 pb-12" id="laboratory-tools">
      <div className="mb-6">
        <h2 className="font-headline-xl text-2xl sm:text-3xl text-[#111111] tracking-tight">
          Tools
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.name}
            className={`${tool.bg} rounded-xl border-2 border-[#111111] p-4 shadow-[4px_4px_0px_#111111] flex flex-col justify-between`}
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-white border-2 border-[#111111] flex items-center justify-center mb-3 shadow-[2px_2px_0px_#111111]">
                <span className="material-symbols-outlined text-[22px] text-[#111111]">
                  {tool.icon}
                </span>
              </div>
              <h3 className="font-headline-md text-lg text-[#111111] font-bold mb-1">
                {tool.name}
              </h3>
              <p className="font-body-sm text-xs text-[#4C4736] leading-relaxed mb-4">
                {tool.description}
              </p>
            </div>

            <button
              id={tool.id}
              onClick={tool.action}
              className="w-full py-2 rounded-lg border-2 border-[#111111] bg-white text-[#111111] text-xs font-bold shadow-[2px_2px_0px_#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
            >
              {tool.btnText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
