/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CipherGrid } from './components/CipherGrid';
import { WorkspaceSection } from './components/WorkspaceSection';
import { AdvancedToolsSection } from './components/AdvancedToolsSection';
import { Footer } from './components/Footer';
import { CompareMatrixModal } from './components/modals/CompareMatrixModal';
import { FileEncryptorModal } from './components/modals/FileEncryptorModal';
import { FrequencyAttackModal } from './components/modals/FrequencyAttackModal';
import { WorkbookModal } from './components/modals/WorkbookModal';
import { CipherId } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState('workspace');
  const [selectedCipher, setSelectedCipher] = useState<CipherId>('caesar');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal visibility states
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isFileEncryptorOpen, setIsFileEncryptorOpen] = useState(false);
  const [isFrequencyAttackOpen, setIsFrequencyAttackOpen] = useState(false);
  const [isWorkbookOpen, setIsWorkbookOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const handleSelectCipher = (cipherId: CipherId) => {
    setSelectedCipher(cipherId);
    showToast(`Switched to ${cipherId.toUpperCase()}`);
    const workspaceElement = document.getElementById('interactive-suite');
    if (workspaceElement) {
      workspaceElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenWorkspace = () => {
    const workspaceElement = document.getElementById('interactive-suite');
    if (workspaceElement) {
      workspaceElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreCiphers = () => {
    const gridElement = document.getElementById('ciphers-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const sections = ['interactive-suite', 'ciphers-grid', 'laboratory-tools'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 180;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            if (sectionId === 'interactive-suite') setActiveSection('workspace');
            else if (sectionId === 'ciphers-grid') setActiveSection('ciphers');
            else if (sectionId === 'laboratory-tools') setActiveSection('tools');
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#111111] font-body-md cipher-grid-bg flex flex-col selection:bg-[#FFE066] selection:text-[#111111]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-[#FFE066] border-2 border-[#111111] font-code-md text-xs sm:text-sm font-bold px-4 py-2 rounded-xl shadow-[4px_4px_0px_#111111] flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#B8F28B]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        activeSection={activeSection}
        onNavigate={(id) => setActiveSection(id)}
        onOpenWorkspace={handleOpenWorkspace}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-24 sm:pt-28">
        {/* Minimal Hero */}
        <HeroSection
          onStartEncrypting={handleOpenWorkspace}
          onExploreCiphers={handleExploreCiphers}
        />

        {/* Interactive Workspace */}
        <WorkspaceSection
          currentAlgorithm={selectedCipher}
          onAlgorithmChange={setSelectedCipher}
          onShowToast={showToast}
        />

        {/* Ciphers Grid */}
        <CipherGrid onSelectCipher={handleSelectCipher} />

        {/* Tools */}
        <AdvancedToolsSection
          onOpenCompare={() => setIsCompareOpen(true)}
          onOpenFileEncryptor={() => setIsFileEncryptorOpen(true)}
          onOpenFrequencyAttack={() => setIsFrequencyAttackOpen(true)}
          onOpenWorkbook={() => setIsWorkbookOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onSelectCipher={handleSelectCipher}
        onOpenWorkspace={handleOpenWorkspace}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenFileEncryptor={() => setIsFileEncryptorOpen(true)}
        onOpenFrequencyAttack={() => setIsFrequencyAttackOpen(true)}
        onOpenWorkbook={() => setIsWorkbookOpen(true)}
      />

      {/* Modals */}
      <CompareMatrixModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onSelectCipher={handleSelectCipher}
      />

      <FileEncryptorModal
        isOpen={isFileEncryptorOpen}
        onClose={() => setIsFileEncryptorOpen(false)}
        onShowToast={showToast}
      />

      <FrequencyAttackModal
        isOpen={isFrequencyAttackOpen}
        onClose={() => setIsFrequencyAttackOpen(false)}
        onApplyKey={(key) => {
          setSelectedCipher('caesar');
          showToast(`Applied Caesar shift K = ${key}`);
          handleOpenWorkspace();
        }}
        onShowToast={showToast}
      />

      <WorkbookModal
        isOpen={isWorkbookOpen}
        onClose={() => setIsWorkbookOpen(false)}
      />
    </div>
  );
}
