'use client';

import { useState, useEffect } from 'react';
import { WordBookList, TestState } from '@/types';
import { WordBookManager } from '@/components/WordBookManager';
import { TestCreator } from '@/components/TestCreator';
import { PrintPreview } from '@/components/PrintPreview';

export default function Home() {
  const [wordBooks, setWordBooks] = useState<WordBookList>([]);
  const [currentTest, setCurrentTest] = useState<TestState | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // localStorage からの読み込み (マウント後)
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('wordBookList');
    if (saved) {
      try {
        setWordBooks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved word books', e);
      }
    }
  }, []);

  // localStorage への保存
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('wordBookList', JSON.stringify(wordBooks));
    }
  }, [wordBooks, isMounted]);

  const handleAddWordBook = (title: string, words: any[]) => {
    const newBook = {
      id: typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID 
        ? window.crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 9),
      title,
      words,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWordBooks((prev) => [newBook, ...prev]);
  };

  const handleDeleteWordBook = (id: string) => {
    if (window.confirm('この単語データを削除してもよろしいですか？')) {
      setWordBooks((prev) => prev.filter((book) => book.id !== id));
      if (currentTest && currentTest.wordBookId === id) {
        setCurrentTest(null);
      }
    }
  };

  const selectedBook = currentTest
    ? wordBooks.find((b) => b.id === currentTest.wordBookId) || null
    : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* ヘッダー (印刷時は非表示) */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 no-print shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-lg">✍️</span>
            英単語プリント作成アプリ
          </h1>
          <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded">PC & iPad 対応</span>
        </div>
      </header>

      {/* メインレイアウト */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 左カラム: コントロールパネル (印刷時は非表示) */}
          <div className="lg:col-span-5 space-y-6 no-print">
            {isMounted ? (
              <>
                <TestCreator
                  wordBooks={wordBooks}
                  currentTest={currentTest}
                  onTestCreated={setCurrentTest}
                />
                <WordBookManager
                  wordBooks={wordBooks}
                  onAddWordBook={handleAddWordBook}
                  onDeleteWordBook={handleDeleteWordBook}
                />
              </>
            ) : (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center h-48">
                <div className="text-slate-400 text-sm animate-pulse flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>読み込み中...</span>
                </div>
              </div>
            )}
          </div>

          {/* 右カラム: プレビューエリア */}
          <div className="lg:col-span-7 lg:sticky lg:top-6 space-y-4 print:col-span-12 print:relative print:top-0">
            {/* プレビューヘッダー (印刷時は非表示) */}
            <div className="flex items-center justify-between no-print px-2">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                プリントプレビュー
              </h2>
              {currentTest && (
                <span className="text-xs text-slate-400 hidden sm:inline">
                  ※実際のA4用紙サイズ（余白10mm）で表示しています
                </span>
              )}
            </div>
            
            {/* スクロール可能なコンテナ */}
            <div className="bg-slate-200/50 p-2 sm:p-4 rounded-xl border border-slate-300/60 overflow-y-auto max-h-[85vh] shadow-inner print:p-0 print:bg-transparent print:border-none print:overflow-visible print:max-h-none print:shadow-none flex justify-center">
              {isMounted ? (
                <PrintPreview
                  currentTest={currentTest}
                  wordBook={selectedBook}
                />
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
