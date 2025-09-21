const targetTextSpan = document.getElementById("targetTextSpan");
const targetInput = document.getElementById("targetInput");
const modalContainer = document.getElementById("modalContainer");
const modalButton = document.getElementById("modalClose");
const resultsText = document.getElementById("resultsText");
const resultsWPM = document.getElementById("resultsWPM");
const resultsElapsed = document.getElementById("resultsElapsed");
const timeView = document.getElementById("timeView");
//TODO: reset fonksiyonunu yapma ve tasarımı güzelleştirme
/* levellere göre textler zorlaşacak */
const levelTexts = [
  "Geyikler, doğal ortamda hayatta kalmaya çalışan otobur hayvanlardır.",
  "Kedilerin ataları, vahşi doğada yaşayan büyük kedilere dayanır. Bu yüzden içlerinde hala bir avcı içgüdüsü taşırlar. Bir tüy topunu ya da lazer noktasını kovalamaları, aslında milyonlarca yıllık avlanma becerilerinin bir yansımasıdır.",
  "Köpekler sadece birer ev arkadaşı değildir; aynı zamanda insanlığın en büyük yardımcılarındandır. Arama kurtarma görevlerinden, engelli bireylere rehberlik etmeye, terapi seanslarından güvenlik birimlerine kadar birçok alanda görev alırlar. Zekaları, sadakatleri ve inanılmaz koku alma yetenekleri sayesinde hayatımızı daha güvenli ve yaşanabilir kılarlar.",
  "Ankara'nın ayazında tek bir kalın mont yeterli olmaz. Kışın en önemli kuralı kat kat giyinmektir. İçlik, uzun kollu bir tişört, kazak ve üzerine bir mont... Bu şekilde hem ısınızı korursunuz hem de kapalı ortamlarda bunalmazsınız. Üstelik, her katman sizi rüzgardan bir kat daha korur.",
  "Antalya'nın yazı, bildiğiniz yazlara benzemez. Bu, sıradan bir mevsim değil, adeta bir cehennem sınavıdır. Güneş, gökyüzünün en tepesinden size acımadan alev püskürtürken, hava o kadar ağırlaşır ki, nefes almak bile zorlaşır. İşte bu ateş çemberinden sağ çıkmak için yapmanız gerekenler.",
  "Hikaye, Bocchi'nin, davulcu Nijika Ijichi ile şans eseri tanışmasıyla başlar. Nijika, onun yeteneğini fark eder ve onu kendi grubu Kessoku Band'e katılmaya ikna eder. Böylece Bocchi'nin yalnız dünyası, bass gitarist Ryo Yamada ve vokalist Ikuyo Kita ile renklenir. Bu grup, sadece müzikal bir işbirliği değil, aynı zamanda Bocchi için bir güven alanı haline gelir.",
];
let currentWordIndex = 0; //şu ana kadar yazdığımız kelimelerin sayısı
let correctWordCount = 0; // kaç tanesi doğru?
let wrongWordCount = 0; //kaç tanesi yanlış
let level = 0;
let selectedText = levelTexts[level];
let selectedWords = [];
let visibleWords = document.getElementsByClassName("inner-word");
let xVisibleWords = Array.from(visibleWords);

function renderLevel() {
  targetTextSpan.innerHTML = "";
  //bir önceki selectedWords'ü temizliyoruz
  selectedWords.length = 0;
  //yeni seviyenin textini alıyoruz
  selectedText = levelTexts[level];
  selectedWords = selectedText.split(" ");
  /* her bir kelime için ayrı bir span oluşturuyoruz */
  let wordId = 0;
  selectedWords.forEach((word) => {
    const span = document.createElement("span");
    span.setAttribute("id", `word-${wordId}`);
    span.classList.add("inner-word");
    span.textContent = word + " ";
    targetTextSpan.appendChild(span);
    wordId++;
  });
  // diğer değerleri sıfırlıyoruz
  currentWordIndex = 0;
  correctWordCount = 0;
  wrongWordCount = 0;
  startTime = null;

  // update visibleWords and xVisibleWords to reflect new DOM
  visibleWords = document.getElementsByClassName("inner-word");
  xVisibleWords = Array.from(visibleWords);
}

/* React'daki useEffect mantığını vanilla JS'e uyarlama */
function setLevel(newLevel) {
  level = newLevel;
  renderLevel();
}
let startTime = null;
let wpm;

targetInput.addEventListener("input", () => {
  /* ilk input eventinde zamanı başlatsın  */
  if (startTime === null) {
    startTime = Date.now();
  }
  /* bu hesaplamaları önceden yapıyoruz */
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const elapsedMinutes = elapsedTime / 60;
  //TODO: input başlayınca timer görüntülemesi de başlasın

  /* her input eventinde geçen süreyi hesaplıyoruz (bu verimsiz olduğu için daha sonra değiştirilebilir) */

  wpm = Math.floor((correctWordCount / elapsedTime) * 60);
  let currentlyWritten = targetInput.value;
  /* ilk olarak yazarken hangisini yazdığımızı bilmemiz için yazıyor olduğumuz cümle gri olacak  */
  if (!currentlyWritten.endsWith(" ")) {
    xVisibleWords[currentWordIndex].classList.add("written");
  }
  /* daha sonra ise bir kelimeyi yazmayı bitirip boşluk koyduğumuzda o kelimeyi doğru yazıp yazmadığımıza göre arkasını yeşil veya kırmızı yapacağız */
  if (currentlyWritten.endsWith(" ")) {
    xVisibleWords[currentWordIndex].classList.remove("written");
    if (currentlyWritten.trim() === selectedWords[currentWordIndex]) {
      xVisibleWords[currentWordIndex].classList.add("correct");
      correctWordCount++;
      currentWordIndex++;
      targetInput.value = "";
    } else {
      xVisibleWords[currentWordIndex].classList.add("false");
      wrongWordCount++;
      currentWordIndex++;
      targetInput.value = "";
    }
  }
  /* modalın görünmesini sağlamak için */
  function showModal(text, wpmtext, seconds) {
    resultsText.innerText = text;
    resultsElapsed.innerText = seconds;
    resultsWPM.innerText = wpmtext;
    modalContainer.classList.remove("hidden");
    targetInput.disabled = true;
  }

  /* eğer paragrafı yazmayı bitirmişsek doğruluk oranına göre sonraki seviyeye geçip geçmediğimizi sorguluyoruz */
  if (currentWordIndex === selectedWords.length) {
    if (correctWordCount >= (selectedWords.length * 8) / 10 && wpm > 30) {
      if (level + 1 < levelTexts.length) {
        xVisibleWords = Array.from(visibleWords);
        setLevel(level + 1);
        showModal(
          `Congratulations! You completed the level successfully.`,
          wpm,
          elapsedTime
        );
      } else {
        //eper geçecek seviye kalmamışsa
        alert(`Congratulations! You've completed all levels!`);
      } //eğer seviye atlama şartı sağlanamamışsa
    } else {
      showModal(`You couldn't pass the level, try harder...`, wpm, elapsedTime);
      setLevel(level);
    }
  }
  console.log(wpm);
  console.log(elapsedMinutes);
});
function closeModal() {
  modalContainer.classList.add("hidden");
  targetInput.disabled = false;
}
modalButton.addEventListener("click", () => closeModal());

renderLevel();
