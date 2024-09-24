document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("button").addEventListener("click", function () {
    this.textContent = "小壞蛋Even";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  fetch(chrome.runtime.getURL("symbol_token.txt"))
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      const tableBody = document.getElementById("symbolTableBody");
      const lines = data.trim().split("\n");
      // 跳過標題行
      for (let i = 1; i < lines.length; i++) {
        const [letter, uppercase, lowercase] = lines[i].split("\t");
        const row = document.createElement("tr");

        const cellLetter = document.createElement("td");
        cellLetter.textContent = letter;
        row.appendChild(cellLetter);

        const cellUpper = document.createElement("td");
        cellUpper.textContent = uppercase;
        row.appendChild(cellUpper);

        const cellLower = document.createElement("td");
        cellLower.textContent = lowercase;
        row.appendChild(cellLower);

        // 添加點擊事件處理器
        row.addEventListener("click", () => {
          const textToCopy = `${letter}\t${uppercase}\t${lowercase}`;
          copyToClipboard(textToCopy)
            .then(() => {
              // 可選：顯示複製成功的提示
              row.style.backgroundColor = "#d4edda";
              setTimeout(() => {
                row.style.backgroundColor = "";
              }, 500);
            })
            .catch((err) => {
              console.error("複製失敗:", err);
            });
        });

        tableBody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error fetching symbol tokens:", error);
    });
});

/**
 * 將指定的文字複製到剪貼簿
 * @param {string} text
 * @returns {Promise}
 */
function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    navigator.clipboard.writeText(text).then(resolve).catch(reject);
  });
}
