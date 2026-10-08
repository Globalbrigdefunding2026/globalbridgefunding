/*
  GlobalBridgeFunding
  Central Website Language System

  Supported languages:
  en = English
  pt = Português
  vi = Tiếng Việt
  fa = فارسی
  id = Bahasa Indonesia
  fr = Français
  fi = Suomi
  es = Español

  The selected language is stored in:
  globalbridge_language
*/

(function () {

  const LANGUAGE_KEY = "globalbridge_language";

  const SUPPORTED_LANGUAGES = [
    "en",
    "pt",
    "vi",
    "fa",
    "id",
    "fr",
    "fi",
    "es"
  ];

  const LANGUAGE_NAMES = {
    en: "English",
    pt: "Português",
    vi: "Tiếng Việt",
    fa: "فارسی",
    id: "Bahasa Indonesia",
    fr: "Français",
    fi: "Suomi",
    es: "Español"
  };


  /*
    Get the currently saved language.
  */

  function getLanguage() {

    const saved =
      localStorage.getItem(LANGUAGE_KEY);

    if (
      saved &&
      SUPPORTED_LANGUAGES.includes(saved)
    ) {
      return saved;
    }

    /*
      Migration support for the old homepage key.
    */

    const oldLanguage =
      localStorage.getItem("selectedLanguage");

    if (
      oldLanguage &&
      SUPPORTED_LANGUAGES.includes(oldLanguage)
    ) {

      localStorage.setItem(
        LANGUAGE_KEY,
        oldLanguage
      );

      return oldLanguage;

    }

    return "en";
  }


  /*
    Save the selected language.
  */

  function setLanguage(language) {

    if (
      !SUPPORTED_LANGUAGES.includes(language)
    ) {
      language = "en";
    }

    localStorage.setItem(
      LANGUAGE_KEY,
      language
    );

    /*
      Keep the old homepage key temporarily
      so existing homepage code continues
      working during the transition.
    */

    localStorage.setItem(
      "selectedLanguage",
      language
    );

    applyLanguage(language);

  }


  /*
    Apply language settings to the page.
  */

  function applyLanguage(language) {

    if (
      !SUPPORTED_LANGUAGES.includes(language)
    ) {
      language = "en";
    }


    document.documentElement.lang =
      language;


    /*
      Persian is the only RTL language
      currently supported.
    */

    if (language === "fa") {

      document.documentElement.dir =
        "rtl";

      document.body.classList.add(
        "rtl-language"
      );

    } else {

      document.documentElement.dir =
        "ltr";

      document.body.classList.remove(
        "rtl-language"
      );

    }


    /*
      Keep every language selector on the
      current page synchronized.
    */

    document
      .querySelectorAll(
        "[data-language-selector]"
      )
      .forEach(selector => {

        selector.value = language;

      });


    document
      .querySelectorAll(
        "#languageSelector"
      )
      .forEach(selector => {

        selector.value = language;

      });

  }


  /*
    Create the language selector.

    Pages can use:

    <div data-language-container></div>

    or

    <select id="languageSelector">
  */

  function createLanguageSelector(
    container
  ) {

    if (!container) {
      return;
    }


    const select =
      document.createElement("select");


    select.id =
      "languageSelector";


    select.setAttribute(
      "data-language-selector",
      "true"
    );


    select.setAttribute(
      "aria-label",
      "Language"
    );


    Object.keys(LANGUAGE_NAMES)
      .forEach(code => {

        const option =
          document.createElement("option");

        option.value = code;

        option.textContent =
          LANGUAGE_NAMES[code];

        select.appendChild(option);

      });


    select.addEventListener(
      "change",
      function () {

        setLanguage(this.value);

      }
    );


    container.innerHTML = "";

    container.appendChild(select);

  }


  /*
    Public language functions.
  */

  window.GlobalBridgeLanguage = {

    getLanguage,

    setLanguage,

    applyLanguage,

    createLanguageSelector,

    supportedLanguages:
      SUPPORTED_LANGUAGES,

    languageNames:
      LANGUAGE_NAMES

  };


  /*
    Initialize when the page is ready.
  */

  function initializeLanguage() {

    const language =
      getLanguage();


    /*
      Automatically create selectors if
      a page has a language container.
    */

    document
      .querySelectorAll(
        "[data-language-container]"
      )
      .forEach(container => {

        createLanguageSelector(
          container
        );

      });


    applyLanguage(language);

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initializeLanguage
    );

  } else {

    initializeLanguage();

  }

})();
