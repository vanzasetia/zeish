(function () {
  "use strict";
  const textField = document.querySelector("textarea");

  const createButton = (text) => {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.textContent = text;
    return button;
  };

  const setUpApplication = () => {
    const generateTopWordsButton = createButton("Generate top words");
    generateTopWordsButton.classList.add("js-generate-top-keywords");

    const counter = `
  <div class="counter">
    <h2 class="counter__title">Statistics</h2>
    <p>Characters (with spaces): <span class="js-total-characters">0</span></p>
    <p>Characters (no spaces): <span class="js-total-characters-without-spaces">0</span></p>
    <p>Words: <span class="js-total-words">0</span></p>
    <p>Lines: <span class="js-total-lines">0</span></p>
  </div>
  `;
    const topKeywords = `
  <div class="leaderboard">
    <h2 class="leaderboard__title">Top keywords</h2>
    <ol type="1" class="leaderboard__list js-leaderboard-keywords"></ol>
  </div>
  `;
    const topPhrasesTwoWords = `
  <div class="leaderboard">
    <h2 class="leaderboard__title">The top two-word phrases</h2>
    <ol type="1" class="leaderboard__list js-leaderboard-two-words"></ol>
  </div>
  `;

    const topPhrasesThreeWords = `
  <div class="leaderboard">
    <h2 class="leaderboard__title">The top three-word phrases</h2>
    <ol type="1" class="leaderboard__list js-leaderboard-three-words"></ol>
  </div>
  `;

    textField.insertAdjacentHTML("afterend", topPhrasesThreeWords);
    textField.insertAdjacentHTML("afterend", topPhrasesTwoWords);
    textField.insertAdjacentHTML("afterend", topKeywords);
    textField.insertAdjacentHTML("afterend", counter);
    textField.insertAdjacentElement("afterend", generateTopWordsButton);
  };
  setUpApplication();

  const showTopWordsButton = document.querySelector(
    ".js-generate-top-keywords"
  );
  const totalCharacters = document.querySelector(".js-total-characters");
  const totalCharactersWithoutSpaces = document.querySelector(
    ".js-total-characters-without-spaces"
  );
  const totalWords = document.querySelector(".js-total-words");
  const totalLines = document.querySelector(".js-total-lines");
  const wordRegEx = /[a-zA-Z\d]{1,}/g;
  const EMPTY = 0;

  const countCharacters = () => {
    const text = textField.value;
    totalCharacters.textContent = text.length;
  };

  const countCharactersWithoutSpaces = () => {
    const text = textField.value;
    const notSpaceRegEx = /\S/g;
    const textWithoutSpaces = text.match(notSpaceRegEx);
    if (textWithoutSpaces === null) {
      totalCharactersWithoutSpaces.textContent = EMPTY;
    } else {
      totalCharactersWithoutSpaces.textContent = textWithoutSpaces.length;
    }
  };

  const countWords = () => {
    const text = textField.value;
    const words = text.match(wordRegEx);
    if (words === null) {
      totalWords.textContent = EMPTY;
    } else {
      totalWords.textContent = words.length;
    }
  };

  const countLines = () => {
    const text = textField.value;
    const lineFeedRegEx = /\n/g;
    const lines = text.match(lineFeedRegEx);
    const FIRST_LINE = 1;
    if (lines === null) {
      totalLines.textContent = FIRST_LINE;
    } else {
      totalLines.textContent = lines.length + FIRST_LINE;
    }
  };

  const saveText = () => {
    const text = textField.value;
    localStorage.setItem("text", text);
  };

  const getWordsStatistic = (words) => {
    const informationStatistic = words.reduce((statistic, quantity) => {
      if (statistic[quantity]) {
        statistic[quantity]++;
      } else {
        statistic[quantity] = 1;
      }
      return statistic;
    }, {});
    return informationStatistic;
  };

  const sortWordsStatistic = (statistic) => {
    let sortable = [];
    for (const word in statistic) {
      sortable.push([word, statistic[word]]);
    }
    sortable.sort((a, b) => {
      return b[1] - a[1];
    });
    return sortable;
  };

  const showStatistic = (words, list, styling = "") => {
    if (words === null) {
      list.innerHTML = "";
    } else {
      const wordsStatistic = getWordsStatistic(words);
      const sortedWordsStatistic = sortWordsStatistic(wordsStatistic);
      const listItems = sortedWordsStatistic
        .map((singleWordStatistic) => {
          const word = singleWordStatistic[0];
          const total = singleWordStatistic[1];
          return `<li class="leaderboard__item ${styling}">
                    <span class="leaderboard__word">${word}</span>
                    <span class="leaderboard__total">Total: ${total}</span>
                  </li>`;
        })
        .join("");
      list.innerHTML = listItems;
    }
  };

  const showTopKeywords = () => {
    const text = textField.value;
    const lowerCaseText = text.toLowerCase();
    const words = lowerCaseText.match(wordRegEx);
    const list = document.querySelector(".js-leaderboard-keywords");
    showStatistic(words, list);
  };

  const showTopTwoWordsPhrases = () => {
    const text = textField.value;
    const lowerCaseText = text.toLowerCase();
    const twoWordsRegEx = /[a-zA-Z\d]{1,} [a-zA-Z\d]{1,}/g;
    const words = lowerCaseText.match(twoWordsRegEx);
    const list = document.querySelector(".js-leaderboard-two-words");
    showStatistic(words, list);
  };

  const showTopThreeWordsPhrases = () => {
    const text = textField.value;
    const lowerCaseText = text.toLowerCase();
    const threeWordsRegEx = /[a-zA-Z\d]{1,} [a-zA-Z\d]{1,} [a-zA-Z\d]{1,}/g;
    const words = lowerCaseText.match(threeWordsRegEx);
    const list = document.querySelector(".js-leaderboard-three-words");
    showStatistic(words, list, "leaderboard__item--three-words");
  };

  const loadText = () => {
    if (localStorage.getItem("text")) {
      textField.value = localStorage.getItem("text");
      countCharacters();
      countCharactersWithoutSpaces();
      countWords();
      countLines();
      showTopKeywords();
      showTopTwoWordsPhrases();
      showTopThreeWordsPhrases();
    }
  };

  textField.addEventListener("input", countCharacters);
  textField.addEventListener("input", countCharactersWithoutSpaces);
  textField.addEventListener("input", countWords);
  textField.addEventListener("input", countLines);
  textField.addEventListener("input", saveText);

  /**
   * Prevent lagging when typing.
   *
   * If I use "input" event then the application
   * will start lagging every time I am typing.
   *
   * Another way that I was trying was to add "blur" event
   * to the `textField`. But, that could make me confused because
   * the application does not react. Then, I realized that I forgot
   * to remove my blinking cursor from the `textField`.
   */
  showTopWordsButton.addEventListener("click", () => {
    showTopKeywords();
    showTopTwoWordsPhrases();
    showTopThreeWordsPhrases();
  });

  document.addEventListener("DOMContentLoaded", loadText);
})();
