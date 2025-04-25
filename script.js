// キャラクター初期データ
const characters = [
  { name: "エクセキューショナー", image: "img/エクセキューショナー.png", score: 1500 },
  { name: "鬼", image: "img/おに.png", score: 1500 },
  { name: "カニバル", image: "img/カニバル.png", score: 1500 },
  { name: "グール", image: "img/グール.png", score: 1500 },
  { name: "クラウン", image: "img/クラウン.png", score: 1500 },
  { name: "ゴーストフェイス", image: "img/ゴーストフェイス.png", score: 1500 },
  { name: "貞子", image: "img/さだこ.png", score: 1500 },
  { name: "シェイプ", image: "img/シェイプ.png", score: 1500 },
  { name: "シンギュラリティ", image: "img/シンギュラリティ.png", score: 1500 },
  { name: "スカルマーチャント", image: "img/スカルマーチャント.png", score: 1500 },
  { name: "スピリット", image: "img/スピリット.png", score: 1500 },
  { name: "ゼノモーフ", image: "img/ゼノモーフ.png", score: 1500 },
  { name: "セノバイト", image: "img/セノバイト.png", score: 1500 },
  { name: "ダークロード", image: "img/ダークロード.png", score: 1500 },
  { name: "チャッキー", image: "img/チャッキー.png", score: 1500 },
  { name: "ツインズ", image: "img/ツインズ.png", score: 1500 },
  { name: "デススリンガー", image: "img/デススリンガー.png", score: 1500 },
  { name: "デモゴルゴン", image: "img/デモゴルゴン.png", score: 1500 },
  { name: "ドクター", image: "img/ドクター.png", score: 1500 },
  { name: "トラッパー", image: "img/トラッパー.png", score: 1500 },
  { name: "トリックスター", image: "img/トリックスター.png", score: 1500 },
  { name: "ドレッジ", image: "img/ドレッジ.png", score: 1500 },
  { name: "ナース", image: "img/ナース.png", score: 1500 },
  { name: "ナイト", image: "img/ナイト.png", score: 1500 },
  { name: "ネメシス", image: "img/ネメシス.png", score: 1500 },
  { name: "ハウンドマスター", image: "img/ハウンドマスター.png", score: 1500 },
  { name: "ハグ", image: "img/ハグ.png", score: 1500 },
  { name: "ハントレス", image: "img/ハントレス.png", score: 1500 },
  { name: "ピッグ", image: "img/ピッグ.png", score: 1500 },
  { name: "ヒルビリー", image: "img/ヒルビリー.png", score: 1500 },
  { name: "ブライト", image: "img/ブライト.png", score: 1500 },
  { name: "プレイグ", image: "img/プレイグ.png", score: 1500 },
  { name: "フレディ", image: "img/フレディ.png", score: 1500 },
  { name: "リージョン", image: "img/リージョン.png", score: 1500 },
  { name: "リッチ", image: "img/リッチ.png", score: 1500 },
  { name: "レイス", image: "img/レイス.png", score: 1500 },
  { name: "アーティスト", image: "img/アーティスト.png", score: 1500 },
  { name: "アンノウン", image: "img/アンノウン.png", score: 1500 },
  { name: "ウェスカー", image: "img/ウェスカー.png", score: 1500 },
];

let comparisonLog = new Set();
let winMap = new Map();
let count = 0;
let maxComparisons = 100;
let currentPair = [];
const shownCharacters = new Set();

const Aimg = document.getElementById("charA");
const Bimg = document.getElementById("charB");
const countDisplay = document.getElementById("count");
const resultDiv = document.getElementById("result");

// ローディング中の表示要素を作成
const loadingText = document.createElement("p");
loadingText.id = "loading";
loadingText.textContent = "読み込み中...";
loadingText.style.display = "none";
document.body.insertBefore(loadingText, document.getElementById("comparison"));

const stopButton = document.createElement("button");
stopButton.textContent = "途中で終了して結果を見る";
stopButton.onclick = showResults;
document.body.appendChild(stopButton);

const retryButton = document.createElement("button");
retryButton.textContent = "さらに20回比較する";
retryButton.style.display = "none";
retryButton.onclick = () => {
  maxComparisons += 20;
  resultDiv.style.display = "none";
  document.getElementById("comparison").style.display = "block";
  countDisplay.style.display = "block";
  stopButton.style.display = "inline-block";
  retryButton.style.display = "none";
  displayPair(getNextPair());
};
document.body.appendChild(retryButton);

function addWinRelation(winnerIndex, loserIndex) {
  if (!winMap.has(winnerIndex)) winMap.set(winnerIndex, new Set());
  winMap.get(winnerIndex).add(loserIndex);
}

function canInferWin(winnerIndex, loserIndex, visited = new Set()) {
  if (!winMap.has(winnerIndex)) return false;
  if (winMap.get(winnerIndex).has(loserIndex)) return true;
  for (let next of winMap.get(winnerIndex)) {
    if (visited.has(next)) continue;
    visited.add(next);
    if (canInferWin(next, loserIndex, visited)) return true;
  }
  return false;
}

function isComparedOrInferable(i, j) {
  return comparisonLog.has(`${i}_${j}`) ||
         comparisonLog.has(`${j}_${i}`) ||
         canInferWin(i, j) ||
         canInferWin(j, i);
}

function getTierName(score) {
  if (score >= 1600) return "Sティア";
  if (score >= 1550) return "Aティア";
  if (score >= 1500) return "Bティア";
  if (score >= 1475) return "Cティア";
  if (score >= 1450) return "Dティア";
  return "Eティア";
}

function groupByTier(characters) {
  const tiers = {};
  for (const char of characters) {
    const tier = getTierName(char.score);
    if (!tiers[tier]) tiers[tier] = [];
    tiers[tier].push(char);
  }
  return tiers;
}

function getNextPair() {
  // 特定範囲の比較を挟む（最後の20回 or 追加20回）
  if (count >= maxComparisons - 20) {
    const ranges = [
      [1450, 1475],
      [1475, 1500],
      [1500, 1550],
      [1550, 1600]
    ];
    const rangeIndex = Math.floor((count - (maxComparisons - 20)) / 5);
    const [min, max] = ranges[rangeIndex];

    const inRange = characters
      .map((c, idx) => ({ c, idx }))
      .filter(({ c }) => c.score >= min && c.score < max);

    if (inRange.length >= 2) {
      let attempts = 0;
      let i, j;
      do {
        i = inRange[Math.floor(Math.random() * inRange.length)].idx;
        j = inRange[Math.floor(Math.random() * inRange.length)].idx;
        attempts++;
      } while ((i === j || isComparedOrInferable(i, j)) && attempts < 50);
      if (attempts < 50) {
        return [i, j];
      }
      // 条件を満たすペアが見つからなければ、通常の処理に進む（何もしないで次へ）
    }
  }
  
  const unshown = characters.map((_, i) => i).filter(i => !shownCharacters.has(i));
  if (unshown.length >= 2) {
    let i = unshown[Math.floor(Math.random() * unshown.length)];
    let j;
    do {
      j = Math.floor(Math.random() * characters.length);
    } while (j === i || isComparedOrInferable(i, j));
    return [i, j];
  }
  if (count < 40) {
    let i, j;
    do {
      i = Math.floor(Math.random() * characters.length);
      j = Math.floor(Math.random() * characters.length);
    } while (i === j || isComparedOrInferable(i, j));
    return [i, j];
  } else {
    const sorted = [...characters].sort((a, b) => b.score - a.score);
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = characters.indexOf(sorted[i]);
      const b = characters.indexOf(sorted[i + 1]);
      if (!isComparedOrInferable(a, b)) return [a, b];
    }
    return getNextPair();
  }
}

function displayPair([i, j]) {
  currentPair = [i, j];
  shownCharacters.add(i);
  shownCharacters.add(j);
  
  // 一旦クリック無効化 + ローディング表示
  Aimg.onclick = null;
  Bimg.onclick = null;
  loadingText.style.display = "block";

  // 両方の画像が読み込まれるのを待ってからクリックを有効にする
  let loadedCount = 0;
  function tryEnableClick() {
    loadedCount++;
    if (loadedCount === 2) {
      loadingText.style.display = "none";
      Aimg.onclick = () => vote(i, j);
      Bimg.onclick = () => vote(j, i);
    }
  }

  Aimg.onload = tryEnableClick;
  Bimg.onload = tryEnableClick;

  Aimg.src = characters[i].image;
  Bimg.src = characters[j].image;
  Aimg.onclick = () => vote(i, j);
  Bimg.onclick = () => vote(j, i);
}

function vote(winnerIndex, loserIndex) {
  updateElo(characters[winnerIndex], characters[loserIndex]);
  comparisonLog.add(`${winnerIndex}_${loserIndex}`);
  addWinRelation(winnerIndex, loserIndex);
  count++;
  countDisplay.textContent = `${count} / ${maxComparisons}回 比較中`;
  if (count >= maxComparisons) {
    showResults();
  } else {
    displayPair(getNextPair());
  }
}

function updateElo(winner, loser, k = 32) {
  const expected = 1 / (1 + Math.pow(10, (loser.score - winner.score) / 400));
  winner.score += Math.round(k * (1 - expected));
  loser.score -= Math.round(k * (1 - expected));
}

function saveResultAsImage() {
  const resultElement = document.getElementById("result");
  html2canvas(resultElement).then(canvas => {
    const link = document.createElement("a");
    link.download = "ranking.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

function shareOnTwitter() {
  const resultText = "あなたのキャラクターランキングはここです！"; // 共有するテキスト
  const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(resultText) + "&url=" + encodeURIComponent(window.location.href);
  window.open(url, "_blank");
}

function showResults() {
  document.getElementById("comparison").style.display = "none";
  countDisplay.style.display = "none";
  stopButton.style.display = "none";
  retryButton.style.display = "inline-block";
  resultDiv.style.display = "block";

  const sorted = [...characters].sort((a, b) => b.score - a.score);
  const tiers = groupByTier(sorted);
  resultDiv.innerHTML = "<h2>あなたのランキング</h2>" +
    Object.entries(tiers).map(([tier, chars]) => {
      return `<h3>${tier}</h3><div class="tier-group">` +
        chars.map(c => `
          <div style=\"margin: 10px; text-align:center;\">
            <img src=\"${c.image}\" alt=\"${c.name}\" style=\"width:100px; height:100px;\"><br>
            ${c.name}
          </div>`).join("") +
        "</div>";
    }).join("");

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "結果を画像として保存";
  saveBtn.onclick = saveResultAsImage;
  resultDiv.appendChild(saveBtn);

  // Twitterでシェアするボタンを追加
  const shareButton = document.createElement("button");
  shareButton.textContent = "Twitterでシェア";
  shareButton.onclick = shareOnTwitter; // シェア関数を呼び出し
  resultDiv.appendChild(shareButton);
}

displayPair(getNextPair());
