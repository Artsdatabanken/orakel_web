import React, { useState } from "react";
import SpeciesDetail from "./SpeciesDetail";
import TaxonImage from "./taxonImage";
import { useTranslation } from "../i18n";

// Non-linear gauge: first dot always filled, then each threshold the
// probability exceeds adds one more dot. All filled dots take the
// colour of the highest reached bucket. Matches Android/iOS native
// (CertaintyCircles in ResultsView.swift, NonLinearGaugeView.kt).
const GAUGE_THRESHOLDS = [0.35, 0.65, 0.85, 0.95];

function probabilityToFilledCount(probability) {
  let count = 1;
  for (const t of GAUGE_THRESHOLDS) {
    if (probability > t) count += 1;
  }
  return Math.max(1, Math.min(5, count));
}

function CertaintyRange({ probability, label }) {
  const filled = probabilityToFilledCount(probability ?? 0);
  return (
    <div className={`certainty certainty--s${filled}`} aria-label={label}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`certainty__dot${i < filled ? " certainty__dot--filled" : ""}`}
          aria-hidden
        />
      ))}
    </div>
  );
}

function capitalizeFirst(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function ResultRow({ prediction, isSelected, onSelect, t }) {
  const probability = prediction.probability ?? 0;
  const filled = probabilityToFilledCount(probability);
  const vernacular = prediction.vernacularName;
  const scientific = prediction.name;
  const sameName =
    vernacular && vernacular.toLowerCase() === scientific.toLowerCase();
  return (
    <li className={`resultRow${isSelected ? " resultRow--selected" : ""}`}>
      <button type="button" className="resultRow__btn" onClick={onSelect}>
        <span className="resultRow__thumb" aria-hidden>
          <TaxonImage result={prediction} size="69px" />
        </span>
        <span className="resultRow__text">
          <span className="resultRow__name">
            {vernacular && !sameName ? (
              capitalizeFirst(vernacular)
            ) : (
              <em className="resultRow__nameSci">{scientific}</em>
            )}
          </span>
          {vernacular && !sameName && (
            <span className="resultRow__sci">{scientific}</span>
          )}
          <span className="resultRow__group">{prediction.groupName}</span>
          <CertaintyRange
            probability={probability}
            label={t("match_label", { 1: filled }) || `${filled} / 5`}
          />
        </span>
        <span className="resultRow__chevron" aria-hidden>›</span>
      </button>
    </li>
  );
}

function ResultListPage({ previews, predictions, onAddFiles, onBack }) {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []);
    onAddFiles(files);
    event.target.value = "";
  };

  const heroImage = previews[0];
  const selected =
    selectedIndex !== null && predictions[selectedIndex]
      ? predictions[selectedIndex]
      : null;
  const isSplit = selected !== null;

  return (
    <div className={`resultPage startPage__inner${isSplit ? " resultPage--split" : ""}`}>
      <button type="button" className="resultPage__back" onClick={onBack}>
        <span className="resultPage__backArrow" aria-hidden>←</span>
        <span>{t("web_identify_another")}</span>
      </button>

      <div className="resultPage__layout">
        <div className="resultPage__listCol">
          <div className="resultPage__gallery">
            <div className="resultPage__hero">
              {heroImage ? (
                <img src={heroImage.url} alt="" />
              ) : (
                <div className="resultPage__heroPlaceholder" aria-hidden />
              )}
            </div>
            <div className="resultPage__addMore">
              <p className="resultPage__addMoreHint">{t("web_dropzone_addmore_hint")}</p>
              <label className="dropzone__button resultPage__addMoreBtn">
                {t("web_choose_images")}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="dropzone__input"
                  onChange={handleFiles}
                />
              </label>
            </div>
          </div>

          {predictions.length === 0 ? (
            <p className="resultList__empty">{t("web_no_suggestions")}</p>
          ) : (
            <ul className="resultList" aria-label={t("web_suggestions_label")}>
              {predictions.map((p, i) => (
                <ResultRow
                  key={p.scientificNameID ?? i}
                  prediction={p}
                  isSelected={i === selectedIndex}
                  onSelect={() => setSelectedIndex(i)}
                  t={t}
                />
              ))}
            </ul>
          )}
        </div>

        {selected && (
          <div className="resultPage__detailCol">
            <SpeciesDetail
              prediction={selected}
              croppedImages={previews}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultListPage;
