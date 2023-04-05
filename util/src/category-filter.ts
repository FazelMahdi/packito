export function getFilterTree(conditions: any[]) {
  const result = [];

  // conditions.push(...defaultFilters());

  for (const condition of conditions) {
    const item = {
      id: condition.Id_Condition,
      title: condition.Answer,
      key: condition.Id_Key,
      type: condition.Id_ConditionType,
      unit: condition.Unit,
      order: 1,
      raw: condition,
      range: undefined as [number, number] | undefined,
      min: undefined,
      max: undefined,
      group: undefined as string | undefined,
      value: undefined as any,
    };

    switch (condition.Id_ConditionType) {
      case 0:
      case 13: {
        item.range = [condition.MinValue, condition.MaxValue];
        item.min = condition.MinValue;
        item.max = condition.MaxValue;
        item.group = `f${condition.Id_Condition}`;

        result.push(item);

        break;
      }
      case 1:
      case 10:
      case 11:
      case 14: {
        item.value = false;
        item.group = `f${condition.Id_Condition}`;

        result.push(item);

        break;
      }
      case 2:
      case 3:
      case 6:
      case 12: {
        item.title = condition.Question;
        item.value = conditions
          .filter((x: { Id_Key: any }) => x.Id_Key === condition.Id_Key)
          .reduce(
            (
              cval: { id: any; title: any; value: null; checked: boolean }[],
              pval: { Id_Condition: any; Answer: any },
            ) => {
              cval.push({
                id: pval.Id_Condition,
                title: pval.Answer,
                value: null,
                checked: false,
              });

              return cval;
            },
            [],
          );

        if (result.findIndex((x) => x.key === item.key) < 0) {
          (item.group = `f${condition.Id_Key}`), result.push(item);
        }

        break;
      }
      case 100: {
        item.title = condition.Question;
        item.value = '';
        item.group = `f${condition.Id_Condition}`;

        result.push(item);

        break;
      }
    }
  }

  return result;
}

// function defaultFilters() {
//   const temp = [];

//   temp.push({
//     Id_Condition: -1,
//     Id_ConditionType: 100,
//     Id_Key: 'Title',
//     Question: 'جستجو در نتایج',
//   });

//   return temp;
// }
