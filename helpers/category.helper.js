const Category = require("../models/category.model");

// Lấy cây danh mục
const buildCategoryTree = (categories, parentId = "") => {
  const tree = [];

  categories.forEach(item => {
    if (item.parent == parentId) {
      const children = buildCategoryTree(categories, item.id);

      tree.push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        children: children
      })
    }
  })

  return tree;
}

module.exports.buildCategoryTree = buildCategoryTree;
// Hết Lấy cây danh mục
// 
module.exports.getAllSubcateId = async (parentID) => {
  const result = [parentID] // tạo mảng lưu trữ id của tất cả danh mục con và cha
  const findChildren = async (currentID) => { //hàm tìm các id con
    const children = await Category.find({
      parent: currentID, // tìm id con sao cho trùng với id cha (vì id cha là id của danh mục con)
      deleted: false,
      status: "active"
    });
    for (const item of children) {
      result.push(item.id);
      await findChildren(item.id);
    }
  };

  await findChildren(parentID);
  return result;
}