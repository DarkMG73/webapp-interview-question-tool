import styles from "./SessionResultsRows.module.css";
import SessionResultsRow from "../SessionResultsRow/SessionResultsRow";
import Card from "../../UI/Cards/Card/Card";
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";

function SessionResultsRows(props) {
  const questionHistory = props.questionHistory;
  const questionHistoryCategories = [];
  const questionHistoryRows = {};
  let questionHistoryCount = 0;

  for (const k in questionHistory) {
    if (k !== "stats") {
      questionHistoryCategories.push(k);
      questionHistoryRows[k] = [];
      for (const key in questionHistory[k]) {
        // Add the row
        questionHistoryRows[k].push(key);
        questionHistoryCount++;
      }
    }
  }

  console.log(
    "%c --> %cline:12%cquestionHistory",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(34, 8, 7);padding:3px;border-radius:2px",
    questionHistory
  );
  console.log(
    "%c --> %cline:36%cquestionHistoryRows",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
    questionHistoryRows
  );

  return (
    <div className={styles["session-results-container"]}>
      {questionHistoryCount > 0 ? (
        questionHistoryCategories.map((cat) => {
          if (questionHistoryRows[cat].length > 0) {
            const output = (
              <div className={styles[cat]}>
                {!props.hideSectionTitles && (
                  <h3 className={styles["history-section-title"]}>{cat}</h3>
                )}
                {questionHistoryRows[cat].map((key) => {
                  return (
                    <SessionResultsRow
                      questionHistory={questionHistory}
                      keyOne={cat}
                      keyTwo={key}
                    />
                  );
                })}
              </div>
            );
            return output;
          }
        })
      ) : (
        <Card styles={{ borderRadius: "30px", padding: "3em" }}>
          {!props.showLoader && (
            <p>
              You do not have a history yet on this browser. Answer a few
              questions and they will be saved tot his browser's memory. This
              history will remain available until you decide to erase it."
            </p>
          )}
          {props.showLoader && <BarLoader />}
        </Card>
      )}
    </div>
  );
}

export default SessionResultsRows;
