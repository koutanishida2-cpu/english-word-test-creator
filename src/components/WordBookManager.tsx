import React, { useState } from 'react';
import { WordBookList, Word } from '@/types';
import { parseCSV } from '@/utils/csv';

interface WordBookManagerProps {
  wordBooks: WordBookList;
  onAddWordBook: (title: string, words: Word[]) => void;
  onDeleteWordBook: (id: string) => void;
}

export const WordBookManager: React.FC<WordBookManagerProps> = ({
  wordBooks,
  onAddWordBook,
  onDeleteWordBook,
}) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedWords, setParsedWords] = useState<Word[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const processCSVFile = (file: File) => {
    setError('');
    
    if (!file.name.endsWith('.csv')) {
      setError('CSVファイル（.csv）を選択してください。');
      setFileName('');
      setParsedWords([]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        const { words, error: csvError } = parseCSV(text);
        if (csvError) {
          setError(csvError);
          setFileName('');
          setParsedWords([]);
        } else {
          setFileName(file.name);
          setParsedWords(words);
          // ファイル名から拡張子を取り除いたものをタイトルの初期値に設定
          const defaultTitle = file.name.replace(/\.[^/.]+$/, "");
          setTitle(defaultTitle);
        }
      }
    };
    reader.onerror = () => {
      setError('ファイルの読み込み中にエラーが発生しました。');
      setFileName('');
      setParsedWords([]);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processCSVFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processCSVFile(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (!title.trim()) {
      setError('単語データのタイトルを入力してください。');
      return;
    }

    if (parsedWords.length === 0) {
      setError('CSVファイルをインポートしてください。');
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

    // 追加処理
    onAddWordBook(title.trim(), parsedWords);
    
    // 入力欄クリア
    setTitle('');
    setFileName('');
    setParsedWords([]);
    setError('');
  };

  const previewWords = parsedWords.slice(0, 5);

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
        {/* ドラッグ＆ドロップ インポーター */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            CSVファイルインポート
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('csv-file-input')?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition duration-150 flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50'
            }`}
          >
            <input
              id="csv-file-input"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            
            <svg className={`w-8 h-8 ${isDragging ? 'text-indigo-500 animate-bounce' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            
            {fileName ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-700 truncate max-w-[280px]">
                  {fileName}
                </p>
                <p className="text-xs text-green-600 font-medium flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  解析成功 ({parsedWords.length}語)
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-slate-600">
                  クリックしてファイルを選択、またはここにドロップ
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  CSV形式: 単語番号,英単語,日本語訳
                </p>
              </div>
            )}
          </div>
        </div>

        {/* プレビュー表示 */}
        {parsedWords.length > 0 && (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
              <span>検出単語数: {parsedWords.length}語</span>
              <span className="text-indigo-600 font-medium">プレビュー（先頭5行）</span>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded bg-white">
              <table className="w-full text-[11px] text-left text-slate-700 table-fixed border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-1.5 font-bold w-[20%] text-center">番号</th>
                    <th className="p-1.5 font-bold w-[40%] border-l border-slate-200">英単語</th>
                    <th className="p-1.5 font-bold w-[40%] border-l border-slate-200">日本語訳</th>
                  </tr>
                </thead>
                <tbody>
                  {previewWords.map((w, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-b-0">
                      <td className="p-1.5 text-center font-mono">{w.number}</td>
                      <td className="p-1.5 border-l border-slate-200 truncate font-medium">{w.english}</td>
                      <td className="p-1.5 border-l border-slate-200 truncate">{w.japanese}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 単語データタイトル */}
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

        <button
          type="submit"
          disabled={parsedWords.length === 0}
          className={`w-full h-11 font-medium rounded-lg transition duration-150 flex items-center justify-center gap-1 shadow-sm ${
            parsedWords.length > 0
              ? 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white cursor-pointer shadow-indigo-100'
              : 'bg-indigo-50 text-indigo-300 border border-indigo-100 cursor-not-allowed'
          }`}
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
            登録された単語データはありません。CSVをインポートして登録してください。
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
