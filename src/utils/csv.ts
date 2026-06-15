import { Word } from '../types';

export function parseCSV(csvText: string): { words: Word[]; error?: string } {
  const cleanText = csvText.trim();
  if (!cleanText) {
    return { words: [], error: 'CSVデータを入力してください。' };
  }

  const lines = cleanText.split(/\r?\n/);
  const words: Word[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // 空行は無視

    const parts = line.split(',');
    if (parts.length < 3) {
      return {
        words: [],
        error: `CSV形式が不正です。${i + 1}行目: 「単語番号,英単語,日本語訳」の3列を入力してください。`
      };
    }

    const numStr = parts[0].trim();
    const english = parts[1].trim();
    // 日本語訳にカンマが含まれる可能性を考慮し、3列目以降を再結合する
    const japanese = parts.slice(2).join(',').trim();

    const number = parseInt(numStr, 10);
    if (isNaN(number) || number <= 0) {
      return {
        words: [],
        error: `CSV形式が不正です。${i + 1}行目: 単語番号には正の整数を指定してください。`
      };
    }

    if (!english || !japanese) {
      return {
        words: [],
        error: `CSV形式が不正です。${i + 1}行目: 英単語と日本語訳は空にできません。`
      };
    }

    words.push({
      number,
      english,
      japanese
    });
  }

  if (words.length === 0) {
    return { words: [], error: '有効な単語データが入力されていません。' };
  }

  return { words };
}
