function SetFilteredQuestionList(
  allQuestions,
  currentFilters,
  clearQuestionFilterIds,
  setQuestionFilterIds,
  filteredQuestionsIds
) {
  let filteredQuestionIdList = [];

  if (!currentFilters) return [];

  // Filter by level
  if (currentFilters.level.length > 0) {
    for (const k in allQuestions) {
      if (currentFilters.level.includes(allQuestions[k].level.trim())) {
        filteredQuestionIdList.push(allQuestions[k].id);
      }
    }
  }
  // Filter by topic
  if (filteredQuestionIdList.length <= 0) {
    filteredQuestionIdList = Object.keys(allQuestions);
  }
  if (currentFilters.topic.length > 0) {
    const questIdsToRemove = [];
    filteredQuestionIdList.forEach((id) => {
      if (!currentFilters.topic.includes(allQuestions[id].topic.trim())) {
        questIdsToRemove.push(allQuestions[id].id);
      }
    });
    questIdsToRemove.forEach((id) => {
      if (filteredQuestionIdList.indexOf(id) >= 0)
        filteredQuestionIdList.splice(filteredQuestionIdList.indexOf(id), 1);
    });
  }

  // Filter by tags
  if (filteredQuestionIdList.length <= 0)
    filteredQuestionIdList = Object.keys(allQuestions);
  if (currentFilters.tags.length > 0) {
    const questIdsToRemove = [];
    filteredQuestionIdList.forEach((id) => {
      if (allQuestions[id].tags.length !== 0) {
        currentFilters.tags.forEach((tag) => {
          if (!allQuestions[id].tags.includes(tag.trim())) {
            questIdsToRemove.push(allQuestions[id].id);
          }
        });
      } else {
        questIdsToRemove.push(allQuestions[id].id);
      }
    });

    questIdsToRemove.forEach((id) => {
      if (filteredQuestionIdList.indexOf(id) >= 0)
        filteredQuestionIdList.splice(filteredQuestionIdList.indexOf(id), 1);
    });
  }

  return filteredQuestionIdList;
}

export default SetFilteredQuestionList;
