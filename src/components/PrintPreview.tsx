import React from 'react';
import { TestState, WordBook } from '@/types';

interface PrintPreviewProps {
  currentTest: TestState | null;
  wordBook: WordBook | null;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({
  currentTest,
  wordBook,
}) => {
  if (!currentTest || !wordBook) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 py-20 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
        <svg className="w-16 h-16 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-base font-medium">プリントプレビュー</p>
        <p className="text-sm text-slate-400 mt-1 text-center">
          左側の「問題作成」から開始・終了番号を入力して、<br />「問題を作成」ボタンを押してください。
        </p>
      </div>
    );
  }

  const { selectedWords, startNo, endNo } = currentTest;

  // 50問を25問ずつの2列に分割
  const leftColumnWords = selectedWords.slice(0, 25);
  const rightColumnWords = selectedWords.slice(25, 50);

  return (
    <div className="space-y-8 print-container max-w-full overflow-x-auto p-4 md:p-0">
      {/* 1枚目: 問題プリント */}
      <div className="print-page bg-white w-[210mm] h-[297mm] p-[10mm] shadow-lg border border-slate-200 mx-auto box-sizing-border-box flex flex-col justify-between select-none">
        <div>
          {/* ヘッダー情報 */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-center text-black tracking-wide mb-2">
              {wordBook.title} 英単語テスト
            </h1>
            <div className="flex justify-between items-center text-xs text-black border-b border-black pb-2">
              <div>
                <span>範囲：{startNo}〜{endNo}</span>
                <span className="mx-3">|</span>
                <span>問題数：50問</span>
              </div>
              <div className="flex gap-4">
                <span>日付：＿＿月＿＿日</span>
                <span>得点：＿＿ / 50 点</span>
              </div>
            </div>
          </div>

          {/* 問題レイアウト（2列） */}
          <div className="grid grid-cols-2 gap-[6mm]">
            {/* 左列 */}
            <div>
              <table className="w-full border-collapse border border-black text-xs text-black table-fixed">
                <thead>
                  <tr className="bg-slate-50 border-b border-black">
                    <th className="border-r border-black p-1.5 text-center font-bold w-[16%]">単語番号</th>
                    <th className="border-r border-black p-1.5 text-left font-bold w-[42%]">英単語</th>
                    <th className="p-1.5 text-left font-bold w-[42%]">日本語訳</th>
                  </tr>
                </thead>
                <tbody>
                  {leftColumnWords.map((word) => (
                    <tr key={word.number} className="border-b border-black h-[9.5mm]">
                      <td className="border-r border-black p-1 text-center font-mono font-medium truncate">{word.number}</td>
                      <td className="border-r border-black p-1 font-medium font-sans break-words whitespace-normal leading-tight">{word.english}</td>
                      <td className="p-1"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 右列 */}
            <div>
              <table className="w-full border-collapse border border-black text-xs text-black table-fixed">
                <thead>
                  <tr className="bg-slate-50 border-b border-black">
                    <th className="border-r border-black p-1.5 text-center font-bold w-[16%]">単語番号</th>
                    <th className="border-r border-black p-1.5 text-left font-bold w-[42%]">英単語</th>
                    <th className="p-1.5 text-left font-bold w-[42%]">日本語訳</th>
                  </tr>
                </thead>
                <tbody>
                  {rightColumnWords.map((word) => (
                    <tr key={word.number} className="border-b border-black h-[9.5mm]">
                      <td className="border-r border-black p-1 text-center font-mono font-medium truncate">{word.number}</td>
                      <td className="border-r border-black p-1 font-medium font-sans break-words whitespace-normal leading-tight">{word.english}</td>
                      <td className="p-1"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 2枚目: 解答プリント（前半） */}
      <div className="print-page bg-white w-[210mm] h-[297mm] p-[10mm] shadow-lg border border-slate-200 mx-auto box-sizing-border-box flex flex-col justify-between select-none">
        <div>
          {/* ヘッダー情報 */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-center text-black tracking-wide mb-2">
              【解答・前半】{wordBook.title} 英単語テスト
            </h1>
            <div className="flex justify-between items-center text-xs text-black border-b border-black pb-2">
              <div>
                <span>範囲：{startNo}〜{endNo}</span>
                <span className="mx-3">|</span>
                <span>問題数：50問 (1〜25問目)</span>
              </div>
            </div>
          </div>

          {/* 解答レイアウト（1列） */}
          <div className="w-full">
            <table className="w-full border-collapse border border-black text-xs text-black table-fixed">
              <thead>
                <tr className="bg-slate-50 border-b border-black">
                  <th className="border-r border-black p-1.5 text-center font-bold w-[12%]">単語番号</th>
                  <th className="border-r border-black p-1.5 text-left font-bold w-[38%]">英単語</th>
                  <th className="p-1.5 text-left font-bold w-[50%]">答え</th>
                </tr>
              </thead>
              <tbody>
                {leftColumnWords.map((word) => (
                  <tr key={word.number} className="border-b border-black h-[9.5mm]">
                    <td className="border-r border-black p-1.5 text-center font-mono font-medium truncate">{word.number}</td>
                    <td className="border-r border-black p-1.5 font-medium font-sans break-words whitespace-normal leading-tight">{word.english}</td>
                    <td className="p-1.5 answer text-red-600 font-semibold break-words whitespace-normal leading-tight">{word.japanese}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3枚目: 解答プリント（後半） */}
      <div className="print-page bg-white w-[210mm] h-[297mm] p-[10mm] shadow-lg border border-slate-200 mx-auto box-sizing-border-box flex flex-col justify-between select-none">
        <div>
          {/* ヘッダー情報 */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-center text-black tracking-wide mb-2">
              【解答・後半】{wordBook.title} 英単語テスト
            </h1>
            <div className="flex justify-between items-center text-xs text-black border-b border-black pb-2">
              <div>
                <span>範囲：{startNo}〜{endNo}</span>
                <span className="mx-3">|</span>
                <span>問題数：50問 (26〜50問目)</span>
              </div>
            </div>
          </div>

          {/* 解答レイアウト（1列） */}
          <div className="w-full">
            <table className="w-full border-collapse border border-black text-xs text-black table-fixed">
              <thead>
                <tr className="bg-slate-50 border-b border-black">
                  <th className="border-r border-black p-1.5 text-center font-bold w-[12%]">単語番号</th>
                  <th className="border-r border-black p-1.5 text-left font-bold w-[38%]">英単語</th>
                  <th className="p-1.5 text-left font-bold w-[50%]">答え</th>
                </tr>
              </thead>
              <tbody>
                {rightColumnWords.map((word) => (
                  <tr key={word.number} className="border-b border-black h-[9.5mm]">
                    <td className="border-r border-black p-1.5 text-center font-mono font-medium truncate">{word.number}</td>
                    <td className="border-r border-black p-1.5 font-medium font-sans break-words whitespace-normal leading-tight">{word.english}</td>
                    <td className="p-1.5 answer text-red-600 font-semibold break-words whitespace-normal leading-tight">{word.japanese}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
