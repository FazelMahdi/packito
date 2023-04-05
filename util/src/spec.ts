export interface TreeNode {
  Id_Group: number;
  GTitle: string;
  Id_Condition: any;
  Answer: string;
  Condition: any;
  key: any;
}

export function specificationTree(data: TreeNode[]) {
  const idMapping = data.reduce((val, el, i) => {
    val[el.Id_Group] = i;

    return val;
  }, [] as number[]);

  data.reduce((val, elm) => {
    val.find((x) => {
      if (x.Id_Condition === elm.Id_Condition) {
        x.Answer += `، ${elm.Answer}`;
      }
    });
    val.push(elm);

    return val;
  }, [] as TreeNode[]);

  const root = [];
  for (const el of data) {
    const temp = data[idMapping[el.Id_Group]];
    const parentEl = {
      id: temp.Id_Group,
      title: temp.GTitle,
      children: [] as any[],
    };

    parentEl.children = [
      ...(parentEl.children || []),
      ...data
        .filter((x) => x.Id_Group === parentEl.id)
        .reduce((pval, cval) => {
          if (pval.findIndex((x) => x.key === cval.Condition) < 0) {
            pval.push({
              key: cval.Condition,
              id: cval.Id_Condition,
              value: `${cval.Answer ?? '-'}`,
            });
          }

          return pval;
        }, [] as any[]),
    ];

    if (root.findIndex((x) => x.id === parentEl.id) < 0) {
      root.push(parentEl);
    }
  }

  return root;
}

// export function importantSpecificationList(data) {
//   const result = Object.entries(group.groupBy(data, 'Id')).reduce((cval, pval) => {
//     const vals = pval[1].reduce((a, b) => (a += `${b.Value} ، `), '').trim();
//     cval.push({
//       Id: pval[0],
//       Title: pval[1][0].Title,
//       Value: vals.substr(0, vals.length - 1),
//     });

//     return cval;
//   }, []);

//   return result;
// }
