export const convertToCartData = (carts) => {
  return carts.map((c) => {
    return {
      product: c.productId._id,
      name: c.productId.name,
      imageUrl: c.productId.imageUrl,
      price: c.productId.price,
      countInStock: c.productId.countInStock,
      qty: c.count,
      _id: c._id,
    };
  });
};

export const filterObj = (arr, keys, filter) => {
  if (!arr || !filter) return arr;
  let filterArr;
  if (typeof filter === 'string') {
    filterArr = filter.split(/\s+/).map((opt) => opt.toLowerCase());
  } else {
    filterArr = filter;
  }
  let newArr;
  filterArr.forEach((f) => {
    const opts = newArr ? newArr : arr;
    newArr = opts.filter((o) => {
      const str =
        typeof keys === 'string'
          ? o[keys]
          : keys.reduce((res, key) => res + o[key] + ' ', '');
      return str.toLowerCase().indexOf(f) !== -1;
    });
  });
  return newArr;
};
