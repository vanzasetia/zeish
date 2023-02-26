(function () {
  "use strict";
  // set up the application
  const textField = document.querySelector("textarea");
  const counter = `
  <div class="counter">
    <h2>Statistics</h2>
    <p>Characters (with spaces): <span class="js-total-characters">0</span></p>
    <p>Characters (no spaces): <span class="js-total-characters-without-spaces">0</span></p>
    <p>Words: <span class="js-total-words">0</span></p>
    <p>Lines: <span class="js-total-lines">0</span></p>
  </div>
  `;
  const topKeywords = `
  <div class="top-keywords">
    <h2>Top keywords</h2>
    <ol type="1"></ol>
  </div>
  `;
  textField.insertAdjacentHTML("afterend", topKeywords);
  textField.insertAdjacentHTML("afterend", counter);

  const totalCharacters = document.querySelector(".js-total-characters");
  const totalCharactersWithoutSpaces = document.querySelector(
    ".js-total-characters-without-spaces"
  );
  const totalWords = document.querySelector(".js-total-words");
  const totalLines = document.querySelector(".js-total-lines");
  const wordRegEx = /[a-zA-Z\d]{1,}/g;

  const countCharacters = () => {
    const text = textField.value;
    totalCharacters.textContent = text.length;
  };

  const countCharactersWithoutSpaces = () => {
    const text = textField.value;
    const textWithoutSpaces = text.match(/\S/g);
    if (textWithoutSpaces === null) {
      totalCharactersWithoutSpaces.textContent = 0;
    } else {
      totalCharactersWithoutSpaces.textContent = textWithoutSpaces.length;
    }
  };

  const countWords = () => {
    const text = textField.value;
    const words = text.match(wordRegEx);
    if (words === null) {
      totalWords.textContent = 0;
    } else {
      totalWords.textContent = words.length;
    }
  };

  const countLines = () => {
    const text = textField.value;
    const lines = text.match(/\n/g);
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

  const showTopKeywords = () => {
    const text = textField.value;
    const lowerCaseText = text.toLowerCase();
    const words = lowerCaseText.match(wordRegEx);
    const list = document.querySelector('ol[type="1"');
    if (words === null) {
      list.innerHTML = "";
    } else {
      const wordsStatistic = getWordsStatistic(words);
      const sortedWordsStatistic = sortWordsStatistic(wordsStatistic);
      let descriptionListHTML = sortedWordsStatistic
        .map((singleWordStatistic) => {
          const word = singleWordStatistic[0];
          const total = singleWordStatistic[1];
          return `<li>
                    <span>${word}</span>
                    <span>Total: ${total}</span>
                  </li>`;
        })
        .join("");
      list.innerHTML = descriptionListHTML;
    }
  };

  const loadText = () => {
    if (localStorage.getItem("text")) {
      textField.value = localStorage.getItem("text");
      countCharacters();
      countCharactersWithoutSpaces();
      countWords();
      countLines();
      showTopKeywords();
    }
  };

  textField.addEventListener("input", countCharacters);
  textField.addEventListener("input", countCharactersWithoutSpaces);
  textField.addEventListener("input", countWords);
  textField.addEventListener("input", countLines);
  textField.addEventListener("input", saveText);
  textField.addEventListener("input", showTopKeywords);
  document.addEventListener("DOMContentLoaded", loadText);
})();
