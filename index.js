const targetTextSpan = document.getElementById("targetTextSpan");
const targetInput = document.getElementById("targetInput");
const visibleWords = document.getElementsByClassName("inner-word");
/* levellere göre textler zorlaşacak */
const levelTexts = [
  "Geyikler, doğal ortamda hayatta kalmaya çalışan otobur hayvanlardır.",
  "Kedilerin ataları, vahşi doğada yaşayan büyük kedilere dayanır. Bu yüzden içlerinde hala bir avcı içgüdüsü taşırlar. Bir tüy topunu ya da lazer noktasını kovalamaları, aslında milyonlarca yıllık avlanma becerilerinin bir yansımasıdır.",
  "Köpekler sadece birer ev arkadaşı değildir; aynı zamanda insanlığın en büyük yardımcılarındandır. Arama kurtarma görevlerinden, engelli bireylere rehberlik etmeye, terapi seanslarından güvenlik birimlerine kadar birçok alanda görev alırlar. Zekaları, sadakatleri ve inanılmaz koku alma yetenekleri sayesinde hayatımızı daha güvenli ve yaşanabilir kılarlar.",
  "Ankara'nın ayazında tek bir kalın mont yeterli olmaz. Kışın en önemli kuralı kat kat giyinmektir. İçlik, uzun kollu bir tişört, kazak ve üzerine bir mont... Bu şekilde hem ısınızı korursunuz hem de kapalı ortamlarda bunalmazsınız. Üstelik, her katman sizi rüzgardan bir kat daha korur.",
  "Antalya'nın yazı, bildiğiniz yazlara benzemez. Bu, sıradan bir mevsim değil, adeta bir cehennem sınavıdır. Güneş, gökyüzünün en tepesinden size acımadan alev püskürtürken, hava o kadar ağırlaşır ki, nefes almak bile zorlaşır. İşte bu ateş çemberinden sağ çıkmak için yapmanız gerekenler.",
  "Hikaye, Bocchi'nin, davulcu Nijika Ijichi ile şans eseri tanışmasıyla başlar. Nijika, onun yeteneğini fark eder ve onu kendi grubu Kessoku Band'e katılmaya ikna eder. Böylece Bocchi'nin yalnız dünyası, bass gitarist Ryo Yamada ve vokalist Ikuyo Kita ile renklenir. Bu grup, sadece müzikal bir işbirliği değil, aynı zamanda Bocchi için bir güven alanı haline gelir.",
];
/* kaçıncı kelimeyi yazmakta olduğumuzu tutan değişken */
let currentWordIndex = 0;
/* şuanki seviyemizi tutan şey */
let level = 0;
const selectedText = levelTexts[level];
/* seviyemize göre olan texti  */
const selectedWords = selectedText.split(" ");
let wordId = 0;
selectedWords.forEach((word) => {
  const span = document.createElement("span");
  span.setAttribute("id", `word-${wordId}`);
  span.classList.add("inner-word");
  span.textContent = word + " ";
  targetTextSpan.appendChild(span);
  wordId = wordId + 1;
});

targetInput.addEventListener("input", (e) => {
  const currentValue = e.target.value;
  console.log(currentValue);
  /* eğer kelimenin son karakteri boşluksa o zaman o kelimeyi yazmayı bitirdik demektir */
  if (currentValue.endsWith(" ")) {
    const writtenWord = currentValue.trim();
    /* eğer kelime doğru yazılmış ise */
    if (
      writtenWord.toLowerCase() ===
      selectedWords[currentWordIndex].toLowerCase()
    ) {
      visibleWords[currentWordIndex].style.backgroundColor = "green";
    } else {
      visibleWords[currentWordIndex].style.backgroundColor = "red";
    }
    currentWordIndex++;
    targetInput.value = "";
  }
});
