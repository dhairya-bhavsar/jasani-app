
export const addTextHTMLHandler = () => {
  return `
        <div class="text-customisation-main">
          <div class="show-selected-text">
              <input type="text" id="selectedText"/>
          </div>

          <div class="text-customisation">
              <div class="customisation-option">
                  <select id="fontType">
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Arial">Arial</option>
                      <option value="Tahoma">Tahoma</option>
                  </select>
                  <label for="fontType">Font Type</label>
              </div>

              <div class="customisation-option">
                  <input type="number" id="fontSize" value="40" />
                  <label for="fontSize">Font Size</label>
              </div>

              <div class="customisation-option">
                  <input type="color" id="textColor" value="#000000" />
                  <label for="textColor">Color</label>
              </div>

              <div class="customisation-option">
                  <input type="checkbox" id="fontBold" value="Bold"/>
                  <label for="fontBold" class="bold-font" id="boldFontLabel">B</label>
                  <label for="fontBold">Bold</p>
              </div>

              <div class="customisation-option">
                  <input type="checkbox" id="fontItalic" value="Italic" />
                  <label for="fontItalic" class="italic-font" id="italicFontLabel">I</label>
                  <label for="fontItalic">Italic</label>
              </div>

              <div class="customisation-option">
                  <input type="checkbox" id="fontUnderline" value="underline" />
                  <label for="fontUnderline" class="underline-font" id="underlineFontLabel">U</label>
                  <label for="fontUnderline">UnderLine</label>
              </div>

              <div class="customisation-option">
                  <select id="textAlign">
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                  </select>
                  <label for="textAlign">Text Alignment</label>
              </div>
          </div>
        </div>`;
};
