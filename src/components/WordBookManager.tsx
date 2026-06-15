import React, { useState } from 'react';
import { WordBookList } from '@/types';
import { parseCSV } from '@/utils/csv';

interface WordBookManagerProps {
  wordBooks: WordBookList;
  onAddWordBook: (title: string, words: any[]) => void;
  onDeleteWordBook: (id: string) => void;
}

export const WordBookManager: React.FC<WordBookManagerProps> = ({
  wordBooks,
  onAddWordBook,
  onDeleteWordBook,
}) => {
  const [title, setTitle] = useState('');
  const [csvText, setCsvText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (!title.trim()) {
      setError('単語データのタイトルを入力してください。');
      return;
    }

    if (!csvText.trim()) {
      setError('CSVデータを入力してください。');
      return;
    }

    // 重複タイトルチェック
    const isDuplicate = wordBooks.some(
      (book) => book.title.toLowerCase() === title.trim().toLowerCase()
    );
    if (isDuplicate) {
      setError('同じタイトルの単語データがすでに登録されています。');
      return;
    }

    // CSVパース
    const { words, error: csvError } = parseCSV(csvText);
    if (csvError) {
      setError(csvError);
      return;
    }

    // 追加処理
    onAddWordBook(title.trim(), words);
    
    // 入力欄クリア
    setTitle('');
    setCsvText('');
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.754 18 18.168 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        単語データ管理
      </h2>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200 whitespace-pre-wrap">
          {error}
        </div>
      )}

      {/* 登録フォーム */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="book-title">
            単語データのタイトル
          </label>
          <input
            id="book-title"
            type="text"
            className="w-full h-11 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 transition"
            placeholder="例：高校英単語"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="csv-input">
            CSVデータ
          </label>
          <div className="text-xs text-slate-400 mb-1">
            形式: 単語番号,英単語,日本語訳 （例: 1,apple,りんご）
          </div>
          <textarea
            id="csv-input"
            rows={5}
            className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 font-mono text-sm transition"
            placeholder="1,apple,りんご&#10;2,book,本&#10;3,class,授業・クラス"
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-lg transition duration-150 flex items-center justify-center gap-1 cursor-pointer shadow-sm shadow-indigo-100"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          単語データを追加
        </button>
      </form>

      {/* 登録済み一覧 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          登録済み単語データ
        </h3>
        
        {wordBooks.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            登録された単語データはありません。上のフォームから登録してください。
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {wordBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg group hover:border-slate-300 transition"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{book.title}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>登録単語数：{book.words.length}語</span>
                    <span className="text-slate-300">•</span>
                    <span>更新：{new Date(book.updatedAt).toLocaleDateString('ja-JP')}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteWordBook(book.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition ml-2 flex-shrink-0 cursor-pointer"
                  title="削除"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
