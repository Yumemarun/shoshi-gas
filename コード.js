// ===== Code.gs =====
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('司法書士過去問肢別演習アプリ');
}

// スプレッドシートから問題と選択肢を取得
function getProblemsAndChoices() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Problems
  const problemsSheet = ss.getSheetByName('Problems');
  const problemsData = problemsSheet.getDataRange().getValues();

  // ★列位置（必要ならここだけ調整）
  // A:problem_id(0), C:year(2), D:subject(3), E:exam_time(4), F:question_summary(5)
  const problems = problemsData.slice(1).map(row => ({
    problem_id: row[0],
    year: row[1],
    exam_time: row[2],    // E列（区分）
    subject: row[3],      // D列
    question_summary: row[6],
  }));

  // Choices
  const choicesSheet = ss.getSheetByName('Choices');
  const choicesData = choicesSheet.getDataRange().getValues();

  // ★D列（choice_text = row[3]）が空白の行は「未準備」なので除外
  const choices = choicesData
    .slice(1)
    .filter(row => row[3] && row[3].toString().trim() !== '')
    .map(row => ({
      choice_id: row[0],
      problem_id: row[1],
      label: row[2],
      choice_text: row[3],
      correct: row[4] === true || row[4] === 'TRUE',
      explanation: row[5],
      explanation_add: row[7],
    }));

  return { problems, choices };
}