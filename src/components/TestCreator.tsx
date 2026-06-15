import React, { useState, useEffect } from 'react';
import { WordBookList, TestState, Word } from '@/types';

interface TestCreatorProps {
  wordBooks: WordBookList;
  currentTest: TestState | null;
  onTestCreated: (test: TestState | null) => void;
}

export const TestCreator: React.FC<TestCreatorProps> = ({
  wordBooks,
  currentTest,
  onTestCreated,
}) => {
  const [selectedBookId, setSelectedBookId] = useState('');
  const [startNoStr, setStartNoStr] = useState('');
  const [endNoStr, setEndNoStr] = useState('');
  const [error, setError] = useState('');

  // 単語帳が削除されて選択中のものがなくなったらリセット
  useEffect(() => {
    if (selectedBookId && !wordBooks.some((b) => b.id === selectedBookId)) {
      setSelectedBookId('');
      setStartNoStr('');
      setEndNoStr('');
      onTestCreated(null);
    }
  }, [wordBooks, selectedBookId, onTestCreated]);

  // シャッフル関数 (Fisher-Yates)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const getFilteredWords = (bookId: string, start: number, end: number): Word[] => {
    const book = wordBooks.find((b) => b.id === bookId);
    if (!book) return [];
    return book.words.filter((w) => w.number >= start && w.number <= end);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedBookId) {
      setError('使用する単語データを選択してください。');
      return;
    }

    const book = wordBooks.find((b) => b.id === selectedBookId);
    if (!book || book.words.length === 0) {
      setError('選択中の単語データに単語がありません。');
      return;
    }

    if (!startNoStr.trim() || !endNoStr.trim()) {
      setError('開始番号と終了番号を入力してください。');
      return;
    }

    const startNo = parseInt(startNoStr, 10);
    const endNo = parseInt(endNoStr, 10);

    if (isNaN(startNo) || isNaN(endNo)) {
      setError('開始番号と終了番号には数値を入力してください。');
      return;
    }

    if (startNo > endNo) {
      setError('開始番号は終了番号以下にしてください。');
      return;
    }

    const filtered = getFilteredWords(selectedBookId, startNo, endNo);

    if (filtered.length < 50) {
      setError('指定範囲内の単語数が50語未満です。50問作成するには、50語以上の範囲を指定してください。');
      return;
    }

    // ランダムに50問を抽出
    const selectedWords = shuffleArray(filtered).slice(0, 50);

    onTestCreated({
      wordBookId: selectedBookId,
      startNo,
      endNo,
      selectedWords,
    });
  };

  const handleShuffle = () => {
    if (!currentTest) return;
    setError('');

    const filtered = getFilteredWords(
      currentTest.wordBookId,
      currentTest.startNo,
      currentTest.endNo
    );

    if (filtered.length < 50) {
      setError('指定範囲内の単語数が50語未満です。50問作成するには、50語以上の範囲を指定してください。');
      return;
    }

    const selectedWords = shuffleArray(filtered).slice(0, 50);

    onTestCreated({
      ...currentTest,
      selectedWords,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        問題作成
      </h2>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200 whitespace-pre-wrap">
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="space-y-4">
        {/* 単語データ選択 */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="book-select">
            使用する単語データ
          </label>
          <select
            id="book-select"
            className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 bg-white transition cursor-pointer"
            value={selectedBookId}
            onChange={(e) => {
              setSelectedBookId(e.target.value);
              setError('');
            }}
          >
            <option value="">単語データを選択してください</option>
            {wordBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} ({book.words.length}語)
              </option>
            ))}
          </select>
        </div>

        {/* 範囲指定 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="start-no">
              開始番号
            </label>
            <input
              id="start-no"
              type="number"
              min="1"
              placeholder="例: 1"
              className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 transition"
              value={startNoStr}
              onChange={(e) => {
                setStartNoStr(e.target.value);
                setError('');
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="end-no">
              終了番号
            </label>
            <input
              id="end-no"
              type="number"
              min="1"
              placeholder="例: 100"
              className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 transition"
              value={endNoStr}
              onChange={(e) => {
                setEndNoStr(e.target.value);
                setError('');
              }}
            />
          </div>
        </div>

        {/* 問題数表示 */}
        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span className="text-sm font-medium text-slate-600">作成問題数</span>
          <span className="text-sm font-bold text-slate-800 bg-slate-200 px-3 py-1 rounded-md">
            50問固定
          </span>
        </div>

        {/* アクションボタン */}
        <div className="space-y-2 pt-2">
          <button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition duration-150 flex items-center justify-center gap-1 cursor-pointer shadow-sm shadow-blue-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            問題を作成
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleShuffle}
              disabled={!currentTest}
              className={`h-11 font-medium rounded-lg transition duration-150 flex items-center justify-center gap-1 cursor-pointer ${
                currentTest
                  ? 'bg-slate-500 hover:bg-slate-600 active:bg-slate-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
              </svg>
              シャッフル
            </button>

            <button
              type="button"
              onClick={handlePrint}
              disabled={!currentTest}
              className={`h-11 font-medium rounded-lg transition duration-150 flex items-center justify-center gap-1 cursor-pointer ${
                currentTest
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-300 cursor-not-allowed border border-emerald-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              印刷する
            </button>
          </div>
        </div>
      </form>

      <div className="text-xs text-slate-400 text-center flex items-center justify-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>A4縦 / 問題1枚 + 解答1枚をまとめて印刷</span>
      </div>
    </div>
  );
};
