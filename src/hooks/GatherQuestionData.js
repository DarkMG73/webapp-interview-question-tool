import { questionData } from "../storage/firebase.config";
import storage from "./storage";

export default async function GatherQuestionData() {
  const allQuestionsData = {};
  const dataFromStorage = storage("get");
  let historyDataFromStorage = null;
  let currentFilters = null;
  if (dataFromStorage) {
    historyDataFromStorage = dataFromStorage.questionHistory;
    currentFilters = dataFromStorage.currentFilters;
  }

  allQuestionsData.allQuestions = {};

  let allQuestions = await questionData;
  if (allQuestions.length <= 0)
    allQuestions = [
      {
        title: "*** Error getting questions from the database. ***",
        question:
          "***Error getting questions from the database. Make sure you are connected to the internet and refresh the page. If the problem continues, please contact the site administrator. ***",
        link: "*** Error getting data ***",
        answer:
          "***Error getting questions from the database. Make sure you are connected to the internet and refresh the page. If the problem continues, please contact the site administrator. ***",
        level: "*** Error Getting Levels Data ***",
        topic: "*** Error Getting Topics Data ***",
        tags: ["*** Error Getting Tags Data ***"],
        credit: "***",
        id: "errorGettingDataFromDatabase",
        search: "***",
      },
    ];
  console.log(
    "%c --> %cline:18%callQuestions",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px",
    allQuestions
  );

  /////// IF USING DUMMY QUERY
  // const allQuestions = [];
  // for (var i in DummyQuestionData) {
  //   allQuestions.push({ ...DummyQuestionData[i] });
  // }
  ////////////

  allQuestions.forEach((questionData) => {
    console.log(
      "%c --> %cline:27%cquestionData",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
      questionData
    );
    const tags = [];
    if (questionData.hasOwnProperty("tags")) {
      if (questionData.tags.constructor === String) {
        questionData.tags = stringToArray(questionData.tags);
      } else if (!questionData.tags.constructor === Array) {
        console.log("ERROR: The question tags are an incorrect format");
        questionData.tags = [];
      } else {
        questionData.tags = questionData.tags.map((tag) =>
          tag.replaceAll(" ", "")
        );
      }
    } else {
      questionData.tags = [];
    }
    allQuestionsData.allQuestions[questionData.id] = questionData;
  });

  allQuestionsData.questionHistory = historyDataFromStorage ?? {
    incorrect: {},
    correct: {},
    unmarked: {},
    stats: {},
  };
  allQuestionsData.currentFilters = currentFilters ?? {
    level: [],
    topic: [],
    tags: [],
  };

  allQuestionsData.questionMetadata = gatherAllMetadata(allQuestions);

  allQuestionsData.questionHistory.stats.usedIds = [];

  allQuestionsData.currentQuestionData = {};
  console.log(
    "%c --> %cline:62%callQuestionsData",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
    allQuestionsData
  );

  return allQuestionsData;
}

function gatherAllMetadata(dataObject) {
  const itemsToInclude = ["topic", "level", "id", "tags", "credit"];
  const valuesToExclude = ["undefined", "", " "];
  const outputSet = objectExtractAllValuesPerKey(
    dataObject,
    itemsToInclude,
    valuesToExclude
  );
  return outputSet;
}

function objectExtractAllValuesPerKey(
  objectToLoop,
  itemsToInclude,
  valuesToExclude
) {
  const outputObject = {};

  // Grab each question
  for (const i in objectToLoop) {
    // Get each item withing that question (ID, topic, answer, etc)
    for (let key in objectToLoop[i]) {
      key = key.trim();

      // Check if we are meant to include that item & the value is valid
      if (
        itemsToInclude.includes(key) &&
        !valuesToExclude.includes(objectToLoop[i][key])
      ) {
        // If the value is a list, separate at the comma
        if (objectToLoop[i][key].indexOf(",") >= 0) {
          const termArray = objectToLoop[i][key].split(",");

          // For each list item, put is in the Set (removes duplicates)
          termArray.forEach((term) => {
            const value = term.trim().toString();

            // Add to Set. If key Set does not exist, create it.
            if (outputObject.hasOwnProperty(key)) {
              outputObject[key].add(value);
            } else {
              outputObject[key] = new Set();
              outputObject[key].add(value);
            }
          });
        } // Since the value is not a string list, if the value is not an array, just add it as-is to the key Set
        else if (objectToLoop[i][key].constructor !== Array) {
          const value = objectToLoop[i][key].trim().toString();

          if (outputObject.hasOwnProperty(key)) {
            outputObject[key].add(value);
          } else {
            outputObject[key] = new Set();
            outputObject[key].add(value);
          }
        } // Since the value is an array, loop to add it
        else if (objectToLoop[i][key].constructor === Array) {
          if (objectToLoop[i][key].length > 0) {
            objectToLoop[i][key].forEach((rawValue) => {
              const value = rawValue.replaceAll(" ", "").toString();
              // Check if  the value is valid
              if (!valuesToExclude.includes(value)) {
                if (outputObject.hasOwnProperty(key)) {
                  outputObject[key].add(value);
                } else {
                  outputObject[key] = new Set();
                  outputObject[key].add(value);
                }
              }
            });
          } else {
            // Given this is an empty array, just return an empty Setup
            outputObject[key] = new Set();
          }
        }
      }
    }
  }

  for (const i in outputObject) {
    outputObject[i] = Array.from(outputObject[i]);
  }

  for (const i in outputObject) {
  }
  return outputObject;
}

function stringToArray(tagString) {
  if (tagString == "undefined") return [];

  return tagString.replaceAll(" ", "").split(",");
}
