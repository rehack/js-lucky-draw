// 检查中奖号码是否重复
function checkLuckyDuplicates(csvStrings) {
  const allItems = [];
  const duplicates = new Set();
  
  csvStrings.split('\n').forEach(line => {
    line.split(',').forEach(item => {
      const trimmed = item.trim();
      if (trimmed) {
        if (allItems.includes(trimmed)) {
          duplicates.add(trimmed);
        }
        allItems.push(trimmed);
      }
    });
  });

  return {
    hasDuplicates: duplicates.size > 0,
    duplicateItems: [...duplicates],
    totalItems: allItems.length,
    uniqueItems: new Set(allItems).size
  };
}

// 测试数据
const testData = `06,04,15,
31,42,23,
37,48,32,45,27,
09,38,
39,11,
50,36`;



console.log(checkLuckyDuplicates(testData));
