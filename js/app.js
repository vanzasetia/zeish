(function () {
  "use strict";
  // set up the application
  const textField = document.querySelector("textarea");
  const counter = `
  <div class="counter">
    <p>Characters: <span class="js-total-characters">0</span></p>
    <p>Words: <span class="js-total-words">0</span></p>
  </div>
  `;
  const topKeywords = `
  <div class="top-keywords">
    <h2>Top 10 keywords</h2>
    <ol type="1"></ol>
  </div>
  `;
  textField.insertAdjacentHTML("afterend", topKeywords);
  textField.insertAdjacentHTML("afterend", counter);

  const totalCharacters = document.querySelector(".js-total-characters");
  const totalWords = document.querySelector(".js-total-words");
  const wordRegEx = /[a-zA-Z\d]{1,}/g;

  const countCharacters = () => {
    const text = textField.value;
    totalCharacters.textContent = text.length;
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

  const showTopTenWords = () => {
    const text = textField.value;
    const lowerCaseText = text.toLowerCase();
    const words = lowerCaseText.match(wordRegEx);
    const list = document.querySelector('ol[type="1"');
    if (words === null) {
      list.innerHTML = "";
    } else {
      const wordsStatistic = getWordsStatistic(words);
      const sortedWordsStatistic = sortWordsStatistic(wordsStatistic);
      const topTenWordsStatistic = sortedWordsStatistic.slice(0, 10);
      let descriptionListHTML = topTenWordsStatistic
        .map((singleWordStatistic) => {
          const word = singleWordStatistic[0];
          const total = singleWordStatistic[1];
          return `<li>
                    <span>${word}</span>
                    <span>${total}</span>
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
      countWords();
      showTopTenWords();
    }
  };

  textField.addEventListener("input", countCharacters);
  textField.addEventListener("input", countWords);
  textField.addEventListener("input", saveText);
  textField.addEventListener("input", showTopTenWords);
  document.addEventListener("DOMContentLoaded", loadText);
})();
