const targetTextSpan = document.getElementById("targetTextSpan");
const targetInput = document.getElementById("targetInput");
const modalContainer = document.getElementById("modalContainer");
const modalInner = document.getElementById("resultsModal");
const resultsText = document.getElementById("resultsText");
const resultsWPM = document.getElementById("resultsWPM");
const resultsElapsed = document.getElementById("resultsElapsed");
const timeView = document.getElementById("timeView");
const levelView = document.getElementById("levelView");
const resetButton = document.getElementById("resetButton");
//TODO: bitirince tebrik ekranı yapılabilir basit bir alert yerine
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
/* levelView'i başta 1. seviyede olacağımız için içine 1 yazıyoruz */
levelView.innerHTML = "1";
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
/* timer başlatmak için bi fonksiyon */
function startTimer(first) {
  /* birden fazla olmaması için önceden varsa siliyoruz. */
  if (!first) {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  }

  /* eğer yazmaya başladıysak, saniyeyi gösteren şey her saniye güncellensin */
  timerInterval = setInterval(() => {
    if (startTime !== null) {
      timeView.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/></svg> ${Math.floor(
        (Date.now() - startTime) / 1000
      )}s`;
    }
  }, 1000);
}
/* başta bi çalışsın, evet pek iyi değil ama bide böyle deneyelim */
startTimer(true);
/* React'daki useEffect mantığını vanilla JS'e uyarlama */
function setLevel(newLevel) {
  level = newLevel;
  renderLevel();
}
/* modalın görünmesini sağlamak için */
function showModal(text, wpmtext, seconds) {
  resultsText.innerText = text;
  resultsElapsed.innerText = seconds;
  resultsWPM.innerText = wpmtext;
  modalContainer.classList.remove("hidden");
  targetInput.disabled = true;
}
let startTime = null;
let wpm;
let typingStarted = false;
targetInput.addEventListener("input", () => {
  /* ilk input eventinde zamanı başlatsın  */
  if (startTime === null) {
    startTime = Date.now();
  }
  /* yazı yazmanın başladığını belirtiyoruz */
  typingStarted = true;
  /* bu hesaplamaları önceden yapıyoruz */
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const elapsedMinutes = elapsedTime / 60;

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

  /* eğer paragrafı yazmayı bitirmişsek doğruluk oranına göre sonraki seviyeye geçip geçmediğimizi sorguluyoruz */
  if (currentWordIndex === selectedWords.length) {
    /* yazmamız bitince yazı yazma flagını da false yapıyoruz */
    typingStarted = false;
    /* intervali durduruyoruz */
    clearInterval(timerInterval);
    timeView.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/></svg> None yet`;
    if (correctWordCount >= (selectedWords.length * 8) / 10 && wpm > 30) {
      if (level + 1 < levelTexts.length) {
        xVisibleWords = Array.from(visibleWords);
        setLevel(level + 1);
        levelView.innerHTML = `${level + 1} `;
        startTimer(false);
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
});

/* bu fonksiyon şu anda yazmakta olduğumuz seviyeyi resetleyecek sadece, seviyeye baştan başlayacak */
function reset() {
  // diğer değerleri sıfırlıyoruz
  currentWordIndex = 0;
  correctWordCount = 0;
  wrongWordCount = 0;
  startTime = null;
  wpm = 0;
  typingStarted = false;
  targetInput.value = "";
  clearInterval(timerInterval);
  timeView.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M360-840v-80h240v80H360Zm80 440h80v-240h-80v240Zm40 320q-74 0-139.5-28.5T226-186q-49-49-77.5-114.5T120-440q0-74 28.5-139.5T226-694q49-49 114.5-77.5T480-800q62 0 119 20t107 58l56-56 56 56-56 56q38 50 58 107t20 119q0 74-28.5 139.5T734-186q-49 49-114.5 77.5T480-80Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-280Z"/></svg> None yet`;
  xVisibleWords.forEach((word) => {
    word.classList.remove("written");
    word.classList.remove("correct");
    word.classList.remove("false");
  });
  startTimer(false);
}
resetButton.addEventListener("click", () => reset());
modalContainer.addEventListener("click", (e) => closeModal(e));

function closeModal(e) {
  if (e.target === modalContainer) {
    modalContainer.classList.add("hidden");
    targetInput.disabled = false;
  }
}

renderLevel();
