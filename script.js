const timerArea = document.getElementById("timerArea");
const finishButton = document.getElementById("finishButton");
const sampleText = document.getElementById("sampleText");
const secondsElapsedHeader = document.getElementById("secondsElapsedHeader");
const finishedModal = document.getElementById("finishModalContainer");
const finishedModalClose = document.getElementById("finishModalClose");
const finishedModalContent = document.getElementById("finishedModalContent");
const headerLevelLabel = document.getElementById("headerLevelLabel");
const headerAttemptLabel = document.getElementById("headerAttemptLabel");
const inputLayer = document.getElementById("inputLayer");
const exceptHeader = document.getElementById('exceptHeader');

let timerStarted = false;
let startTime;
let elapsed;
let currentLevel = 1;
let stSpans;
let exampleTextSplitted;
let exampleText;
let textAlreadyRendered = false;
let failCount = 0;

// bunun sayesinde sayfa yüklendiğinde inputlayer zaten focuslanmış oluyor. domcontentloaded eventi içerisine yazılan satırlar sayfa yüklenir yüklenmez çalışır.
document.addEventListener("DOMContentLoaded", () => {
  inputLayer.focus();
});

let levelTexts = [
  "Geyikler ormanda sessizce yürürken yaprakların hışırtısı duyuluyordu. Bir anne geyik, yavrusunu dikkatle izliyordu.",
  "Geyikler, ormanın derinliklerinde, büyüleyici ve tehlikeli bir dünyada hayatta kalmaya çalışarak karmaşık sosyal yapılar oluşturmuşlardır.",
  "Zamanla, göç eden geyik sürülerinin davranışları, doğanın gizemli döngülerine uygun bir şekilde evrimleşmiş ve orman ekosistemini dengeleyen önemli unsurlar haline gelmiştir.",
  "Sonbaharın son günlerinde, yaşlı dişi geyiklerin göç yolculuklarını başlatırken, her adımlarının arkasında binlerce yıl süren bir öğrenme ve hayatta kalma bilgisinin izleri saklıydı.",
  "Geceyi, yıldızların titrek ışığında, soğuk rüzgarın sarstığı ağaçların altında geçirirken, geyiklerin güçlü ama narin vücutları, ormanın derin sessizliğine uyum sağlayarak varlıklarını sürdürüyordu.",
  "Geyiklerin migrasyon rotalarındaki engeller, yalnızca coğrafi zorluklarla değil, aynı zamanda kendilerine özgü sosyal dinamikler ve nesiller arası bilgi aktarımına dayalı karmaşık stratejilerle aşılmaktadır.",
  "Ormanın diğer sakinlerinden bağımsız olarak, geyiklerin hayatta kalma mücadelesi, yalnızca fiziksel yetenekleriyle değil, aynı zamanda soylarının kadim bilgilerinin ve doğayla kurdukları derin bağların bir yansıması olarak gelişmiştir.",
  "Efsanevi bir göç yolculuğu gibi, yıllar içinde şekillenen bu geyik sürülerinin hareketleri, doğal dünyanın tarihindeki en önemli ekolojik döngülerden biri olarak kaydedilmiş ve hayatta kalma için nesiller boyu süren bir mücadelenin simgesine dönüşmüştür.",
  "Geyiklerin kaybolan izleri, zamanın bilinmeyen yüzüyle birleşirken, ormanın derinliklerinden gelen gizemli bir çağrı; bir anlam yüklenmiş, eski doğa yasalarının yankısı olarak, kaybolan bir medeniyetin, belki de hayvanların göç yolculukları sırasında oluşturduğu izlerin ardında bir anlam arayışı, hiç kimsenin çözmeye cesaret edemediği bir bilmeceye dönüşmüştür.",
];
const renderTextAsSpans = (text) => {
  sampleText.innerHTML = ""; // Always clear previous spans
  exampleText = text;
  exampleTextSplitted = exampleText.trim().split(" ");

  exampleTextSplitted.forEach((eachWord) => {
    let newSpan = document.createElement("span");
    newSpan.textContent = eachWord + " ";
    sampleText.appendChild(newSpan);
  });

  stSpans = sampleText.querySelectorAll("span");
  textAlreadyRendered = true;
};
renderTextAsSpans(levelTexts[0]);

const gameLogic = (level, timeLimit, accuracyLimit) => {
  let userText = inputLayer.innerText;
  const userTextSplitted = userText.trim().split(" ");
  let minLength = Math.min(userTextSplitted.length, exampleTextSplitted.length);
  currentLevel = level;
  let correctWords = 0;
  let falseWords = 0;
  for (let index = 0; index < minLength; index++) {
    if (userTextSplitted[index] == exampleTextSplitted[index]) {
      stSpans[index].style.color = "green";
      correctWords++;
    } else if (userTextSplitted[index] != exampleTextSplitted[index]) {
      stSpans[index].style.color = "red";
      falseWords++;

    }
  }

  // real time results
  let accuracy = (correctWords / (userTextSplitted.length - 1)) * 100;
  let wpm = (userTextSplitted.length / elapsed) * 60;

  if (userText.trim().length === exampleText.trim().length) {
    clearInterval(interval);
    inputLayer.disabled = true;
    if (elapsed <= timeLimit && accuracy > accuracyLimit) {
      finishedModal.classList.remove("hidden");
      inputLayer.setAttribute("contenteditable", "false");
      inputLayer.value = "";
      finishedModalContent.innerHTML =
        "<h3> Congrats! Now you can move onto the next level. </h3> <br> <h4> Stats </h4> " +
        ` <div class="result-item">✔️ Correct words: ${correctWords} </div> <div class="result-item"> ❌ Wrong words: ${falseWords} </div>  <div class="result-item"> Accuracy: %${Math.floor(
          accuracy
        )} </div> <div class="result-item"> WPM: ${Math.floor(wpm)} </div>`;
      currentLevel++;

      sampleText.innerHTML = "";
      renderTextAsSpans(levelTexts[currentLevel - 1]);
      inputLayer.innerHTML = "";
      timerStarted = false;
      timerArea.innerHTML = "";
      textAlreadyRendered = false; // <<< BUNU EKLE
      secondsElapsedHeader.classList.add("hidden");

      headerLevelLabel.innerHTML = "Level " + currentLevel;
      headerAttemptLabel.innerHTML = "Kalan canlar " + failCount % 3;
    }  else if (failCount != 3) {
      finishedModal.classList.remove("hidden");
      inputLayer.value = "";
      inputLayer.setAttribute("contenteditable", "false");
      finishedModalContent.innerHTML =
        "<h3> You failed to meet the criteria, please try again. </h3>  <br> <h4> Stats </h4>" +
        ` <div class="result-item">✔️ Correct words: ${correctWords} </div> <div class="result-item"> ❌ Wrong words: ${falseWords} </div>  <div class="result-item"> Accuracy: %${Math.floor(
          accuracy
        )} </div> <div class="result-item"> WPM: ${Math.floor(wpm)} </div>`;
        failCount++;
      headerLevelLabel.innerHTML = "Level " + currentLevel;
      headerAttemptLabel.innerHTML = "Kalan canlar: " + Number(3 - failCount ).toString();
      sampleText.innerHTML = "";
      renderTextAsSpans(levelTexts[currentLevel - 1]);
      inputLayer.innerHTML = "";
      timerStarted = false;
      timerArea.innerHTML = "";
      textAlreadyRendered = false; // <<< BUNU EKLE
    }
    else if (failCount >= 3){
      finishedModal.classList.remove("hidden");
      inputLayer.value = "";
      inputLayer.setAttribute("contenteditable", "false");
      finishedModalContent.innerHTML = "Bütün canlarınızı kaybettiniz!";
        currentLevel = 0;
        inputLayer.setAttribute("contenteditable", "true");
        headerLevelLabel.innerHTML = "Level " + currentLevel;
        headerAttemptLabel.innerHTML = "Kalan canlar " + "3";

    }
  }

  finishedModalClose.addEventListener("click", () => {
    finishedModal.classList.add("hidden");
    inputLayer.setAttribute("contenteditable", "true");
  });
};

const gameFinishScreen = () => {
  let congratulatingText = document.createElement("div");
  let congratulatingSmallText = document.createElement("div");

  exceptHeader.replaceChildren();
  congratulatingText.textContent = "Tebrikler!";
  congratulatingText.classList.add("conguratulate");
  congratulatingSmallText.textContent = "Oyunu başarıyla bitirdin. Umarım yazma hızını geliştirmiştir!";
  congratulatingSmallText.classList.add("cong-small-text");
  exceptHeader.appendChild(congratulatingText);
  exceptHeader.appendChild(congratulatingSmallText);
  confetti();
  return "Finished!";
}

//inputLayer'e her input yapıldığında çağırılan zımbırtılar
inputLayer.addEventListener("input", () => {
  if (!timerStarted) {
    secondsElapsedHeader.classList.remove("hidden");
    startTime = performance.now();
    timerStarted = true;
    interval = setInterval(() => {
      elapsed = performance.now() / 1000 - startTime / 1000;
      timerArea.innerHTML = ` ${Math.floor(elapsed)} seconds `;
    }, 1000);
  }

  if (currentLevel == 1) {
    renderTextAsSpans(levelTexts[0]);
    gameLogic(1, 20, 85);
  }
  if (currentLevel == 2) {
    renderTextAsSpans(levelTexts[1]);
    gameLogic(2, 30, 80);
  }
  if (currentLevel == 3) {
    renderTextAsSpans(levelTexts[2]);
    gameLogic(3, 30, 80);
  }
  if (currentLevel == 4) {
    renderTextAsSpans(levelTexts[3]);
    gameLogic(4, 35, 80);
  }
  if (currentLevel == 5) {
    renderTextAsSpans(levelTexts[4]);
    gameLogic(5, 40, 80);
  }
  if (currentLevel == 6) {
    renderTextAsSpans(levelTexts[5]);
    gameLogic(6, 45, 80);
  }
  if (currentLevel == 7) {
    renderTextAsSpans(levelTexts[6]);
    gameLogic(7, 45, 80);
  }
  if (currentLevel == 8) {
    renderTextAsSpans(levelTexts[7]);
    gameLogic(8, 45, 80);
  }
  if (currentLevel == 9) {
    renderTextAsSpans(levelTexts[8]);
    gameLogic(9, 45, 80);
  }
  if (currentLevel == 10) {
    renderTextAsSpans(levelTexts[9]);
    gameLogic(10, 45, 80);
  }
  if (currentLevel == 11) {
    gameFinishScreen();
  }
});
