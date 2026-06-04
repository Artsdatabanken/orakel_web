import React, { useMemo } from "react";
import { useTranslation } from "../i18n";

// Per-language FAQ content lives in src/locales/faq/faq_{lang}.json.
const FAQ_DATA = import.meta.glob("../locales/faq/faq_*.json", {
  import: "default",
  eager: true,
});

function pickLanguage(activeCode) {
  const key = `../locales/faq/faq_${activeCode}.json`;
  if (FAQ_DATA[key]) return FAQ_DATA[key];
  return FAQ_DATA["../locales/faq/faq_en.json"];
}

function ExtendedManual() {
  const { t, activeCode } = useTranslation();
  const data = useMemo(() => pickLanguage(activeCode), [activeCode]);
  const items = data?.items ?? [];

  return (
    <div className="faqModal">
      <h2 className="faqModal__heading">{t("faq")}</h2>
      <dl className="faqModal__list">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <dt className="faqModal__question">{item.question}</dt>
            <dd className="faqModal__answer">{item.answer}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
}

export default ExtendedManual;
